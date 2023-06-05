import { CarePlanReminder, CarePlanTask } from "@loophealth/api";

export const timeOrderMap = {
  morning: 0,
  afternoon: 1,
  evening: 2,
  night: 3,
};

export const getWeekDatesFromDate = (date: Date) => {
  const curr = date; // get current date
  curr.setHours(0,0,0,0);
  const firstDate = new Date(
    curr.setDate(
      curr.getDay()
        ? curr.getDate() - curr.getDay() + 1
        : curr.getDate() - curr.getDay() - 6
    )
  );
  const lastDate = new Date(curr.setDate(curr.getDate() - curr.getDay() + 7));

  return { firstDate, lastDate };
};


export const getTaskBetweenDate = (
  fromDate: Date,
  toDate: Date,
  careTasks: CarePlanTask[]
): CarePlanTask[] => {
  const day1 = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate()
  );
  const day2 = new Date(
    toDate.getFullYear(),
    toDate.getMonth(),
    toDate.getDate() + 1
  );
  const filteredTasks = careTasks?.filter(
    (data) =>
      data.scheduledTime.toDate() > day1 && data.scheduledTime.toDate() < day2
  );
  filteredTasks?.sort(
    (a, b) =>
      timeOrderMap[a.time.toLowerCase() as CarePlanReminder] -
      timeOrderMap[b.time.toLowerCase() as CarePlanReminder]
  );
  return filteredTasks;
};
