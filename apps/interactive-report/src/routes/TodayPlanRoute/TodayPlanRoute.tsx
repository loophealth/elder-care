import { useEffect, useState } from "react";
import { onSnapshot, updateDoc } from "firebase/firestore";

import {
  usePatient,
  CarePlan,
  CarePlanTask,
  CarePlanReminder,
} from "@loophealth/api";

import { AdminEditorLayout, IconTextTile, IconTextTileList } from "components";
import { CATEGORY_ICONS } from "lib/carePlan";

import "./TodayPlanRoute.css";
import { timeOrderMap } from "utils";

export const TodayPlanRoute = () => {
  const { patient } = usePatient();

  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);

  // Subscribe to care plan updates.
  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.carePlanRef, (snapshot) => {
      const carePlan = (snapshot.data() ?? []) as CarePlan;
      setCarePlan(carePlan);
    });

    return () => {
      unsub();
    };
  }, [patient]);

  const onCheckTask = async (task: CarePlanTask) => {
    if (!patient || !carePlan) {
      return;
    }
    const newTask = carePlan?.tasks.map((data) => {
      if (
        data.recommendation === task.recommendation &&
        data.scheduledTime === task.scheduledTime
      ) {
        data["checked"] = !data["checked"];
        return data;
      }
      return data;
    });
    await updateDoc(patient.carePlanRef, {
      tasks: newTask,
    });
  };

  const renderTodayTask = () => {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const filteredTasks = carePlan?.tasks?.filter(
      (data) =>
        data.scheduledTime.toDate() > today &&
        data.scheduledTime.toDate() < tomorrow
    );
    filteredTasks?.sort(
      (a, b) =>
      timeOrderMap[a.time.toLowerCase() as CarePlanReminder] -
      timeOrderMap[b.time.toLowerCase() as CarePlanReminder]
    );
    return (
      <>
        {filteredTasks?.map((item: CarePlanTask, index: number) => (
          <IconTextTile
            key={index.toString()}
            title={item.recommendation}
            details={item?.time?.toString()}
            description_line_1={item?.meal.toString()}
            icon={CATEGORY_ICONS[item.category]}
            checked={item?.checked}
            onCheck={() => onCheckTask(item)}
          />
        ))}
      </>
    );
  };

  return (
    <AdminEditorLayout
      title="Today's Plan"
      renderLeft={() => (
        <div className="Utils__VerticalForm TodayPlanRoute__Form">
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label">Today's Plan</label>
          </div>
        </div>
      )}
      renderRight={() => (
        <IconTextTileList>
          {carePlan ? renderTodayTask() : null}
        </IconTextTileList>
      )}
    />
  );
};
