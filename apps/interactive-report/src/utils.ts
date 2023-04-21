import { Timestamp } from "firebase/firestore";

export const substractDate = (date: Date, count = 0) => {
    var dateOffset = (24*60*60*1000) * count;
    return  Timestamp.fromDate(new Date(new Date().setTime(date.getTime() - dateOffset)));
};

export const generateId = () => {
    return new Date().getTime()
};
