import { CarePlan, CarePlanTask, usePatient } from "@loophealth/api";
import { ProgressBar } from "components/ProgressBar";
import { groupBy } from "lodash";
import { useEffect, useState } from "react";
import { getWeekDatesFromDate, getTaskBetweenDate } from "utils";
import { ReactComponent as DietIcon } from "images/diet.svg";
import { ReactComponent as MedicationIcon } from "images/medication.svg";
import { ReactComponent as PhysicalActivityIcon } from "images/exercise.svg";
import { onSnapshot } from "firebase/firestore";
import "./WeeklyProgress.css";

interface IProgressData {
  category: string;
  totalTask: number;
  completedTask: number;
  completed: number;
  bgcolor: string;
}

export const WeeklyProgress = () => {
  const { patient } = usePatient();
  const [progressData, setProgressData] = useState<IProgressData[] | []>([]);
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

  useEffect(() => {
    const tasks = carePlan?.tasks || [];
    if (tasks && tasks.length > 0) {
      getWeeklyTask(tasks);
    } else {
      setProgressData([]);
    }
  }, [carePlan]);

  const getWeeklyTask = (careTasks: CarePlanTask[]) => {
    const { firstDate, lastDate } = getWeekDatesFromDate(new Date());
    let newTasks = [];

    const allTasks = careTasks
      ? getTaskBetweenDate(firstDate, lastDate, careTasks)
      : [];
    const filteredTask = allTasks.filter(
      (data: CarePlanTask) => data.checked === true
    );
    const groupedAllTask = groupBy(allTasks, "category");
    const groupedfilteredTask = groupBy(filteredTask, "category");
    const taskKeys = Object.keys(groupedAllTask);

    for (let i in taskKeys) {
      const category = taskKeys[i];
      const totalTask = groupedAllTask[category]?.length;
      const completedTask = groupedfilteredTask[category]?.length || 0;
      if (totalTask) {
        newTasks.push({
          category,
          totalTask,
          completedTask,
          completed: Math.round((completedTask / totalTask) * 100),
          bgcolor: "#75E064",
        });
      }
    }
    setProgressData(newTasks);
  };
  if (progressData && progressData.length > 0) {
    return (
      <main className="WeeklyProgress">
        <div className="WeeklyProgress__Title">Weekly Progress</div>
        {progressData?.map((item: IProgressData, index: number) => {
          const icon = icons.get(item.category) || "";
          return (
            <div key={index.toString()}>
              <div className="Utils__Label WeeklyProgress__TodayLabel">
                {item?.category.toLowerCase() === "physicalactivity"
                  ? "EXERCISE"
                  : item?.category.toUpperCase()}
              </div>
              <label className="WeeklyProgress__Items__Item">
                <div>{icon}</div>
                <div className="WeeklyProgress__Items__Item__Container">
                  <div className="WeeklyProgress__Items__Item__Name">
                    <ProgressBar
                      key={index}
                      bgcolor={item.bgcolor}
                      completed={item.completed}
                    />
                  </div>

                  <div className="WeeklyProgress__Items__Item__Description">
                    {`${item.completedTask}/${item.totalTask} tasks done this week`}
                  </div>
                </div>
              </label>
            </div>
          );
        })}
      </main>
    );
  } else {
    return null;
  }
};

const icons = new Map([
  ["diet", <DietIcon className="WeeklyProgress__Items__Item__Icon" />],
  [
    "medication",
    <MedicationIcon className="WeeklyProgress__Items__Item__Icon" />,
  ],
  [
    "physicalActivity",
    <PhysicalActivityIcon className="WeeklyProgress__Items__Item__Icon" />,
  ],
]);
