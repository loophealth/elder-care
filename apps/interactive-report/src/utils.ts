import { CarePlanReminder, CarePlanTask } from "@loophealth/api";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

interface DayMap {
  [key: string]: number;
}

export const substractDate = (date: Date, count = 0) => {
  var dateOffset = 24 * 60 * 60 * 1000 * count;
  return Timestamp.fromDate(
    new Date(new Date().setTime(date.getTime() - dateOffset))
  );
};

export const generateId = () => {
  return crypto.randomUUID();
};

export const convertFollowupDate = (date: string) => {
  const newDate: Date = new Date(date);
  //FollowUp Notification will be scheduled at 12 afternoon
  newDate.setHours(12);
  newDate.setMinutes(0);
  return {
    firebaseFollowUpDate: Timestamp.fromDate(newDate),
    followUpDate: newDate,
  };
};

export const getTodayDate = () => new Date().toISOString().split("T")[0];

export const createTask = (task: any) => {
  const {
    refId,
    days,
    time,
    meal,
    recommendation,
    category,
    details,
    dateRange,
  } = task;

  const dates = getDaysBetweenDates(
    new Date(dateRange?.from),
    new Date(dateRange?.to),
    days
  );

  let tasksArr = [];

  for (let d in dates) {
    for (let t in time) {
      const careTime = (carePlanCategoryTime as any)[
        time[t]?.toLowerCase()
      ]?.split(":");
      let careDate = new Date(dates[d]);
      careDate.setHours(careTime[0]);
      careDate.setMinutes(careTime[1]);

      tasksArr.push({
        refId,
        recommendation,
        meal: meal,
        category,
        details,
        date: dates[d],
        scheduledTime: Timestamp.fromDate(careDate),
        checked: false,
        time: time[t],
      });
    }
  }
  return tasksArr as CarePlanTask[];
};

export const getDaysBetweenDates = (
  start: Date,
  end: Date,
  dayName: string[]
) => {
  let result = [];
  const days: DayMap = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };
  for (let i = 0; i < dayName.length; i++) {
    var day = days[dayName[i].toLowerCase()];
    // Copy start date
    var current = new Date(start);
    // Shift to next of required days
    current.setDate(current.getDate() + ((day - current.getDay() + 7) % 7));
    // While less than end date, add dates to result array
    while (current < end) {
      result.push(new Date(+current));
      current.setDate(current.getDate() + 7);
    }
  }
  return result.sort((a: any, b: any) => a - b);
};

export const formatDateRange = (range: any) => {
  if (range) {
    const fromDate = format(new Date(range?.from), "d MMMM");
    const toDate = format(new Date(range?.to), "d MMMM");
    return `${fromDate} - ${toDate}`;
  }
  return "";
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

//FollowUp is before 1 week(i.e. 7 days), before 2 days(i.e. 2 days), before 2 day, selected date
export const followUpRules = [7, 2, 1, 0];

//CarePlan Category Time
export const carePlanCategoryTime = {
  morning: "08:00",
  afternoon: "13:00",
  evening: "17:00",
  night: "20:00",
};

//Notification source
export const notificationSource = {
  notification: "Notification",
  carePlan: "Care Plan",
  followUp: "Follow Up",
};

export const timeOrderMap = {
  morning: 0,
  afternoon: 1,
  evening: 2,
  night: 3,
};
