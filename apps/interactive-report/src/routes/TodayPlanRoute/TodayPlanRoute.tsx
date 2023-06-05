import { useEffect, useState } from "react";
import { onSnapshot, updateDoc } from "firebase/firestore";

import { usePatient, CarePlan, CarePlanTask } from "@loophealth/api";

import { AdminEditorLayout, IconTextTile, IconTextTileList } from "components";
import { CATEGORY_ICONS } from "lib/carePlan";

import "./TodayPlanRoute.css";
import { getTaskBetweenDate } from "utils";

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
    const today = new Date();
    const filteredTasks = carePlan?.tasks
      ? getTaskBetweenDate(today, today, carePlan?.tasks)
      : [];
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
