import { useCallback, useEffect, useState } from "react";
// import { concat } from "lodash";
import { formatISO } from "date-fns";

import { CarePlan, CarePlanItem, CarePlanTask } from "@loophealth/api";

export interface CarePlanChecklistItem extends CarePlanItem {
  category: string;
  isDone: boolean;
}

const CHECKLIST_LOCAL_STORAGE_KEY = "carePlanChecklist";
const LAST_MODIFIED_LOCAL_STORAGE_KEY = "carePlanChecklistLastModified";

const setChecklistState = (carePlan: CarePlan) => {
  const reminderLookup: any = {
    morning: 0,
    afternoon: 1,
    evening: 2,
    night: 3,
    others: 4,
  };
  // Find existing items in localStorage.
  const existingChecklistJson = window.localStorage.getItem(
    CHECKLIST_LOCAL_STORAGE_KEY
  );
  let existingChecklist = [] as CarePlanTask[];
  if (existingChecklistJson) {
    existingChecklist = JSON.parse(existingChecklistJson) as CarePlanTask[];
  }

  // Add metadata to items passed in from the user.
  // const passedInItems = concat(
  //   carePlan?.diet.map(extendItem("diet")),
  //   carePlan?.medication.map(extendItem("medication")),
  //   carePlan?.physicalActivity.map(extendItem("physicalActivity")),
  //   carePlan?.others.map(extendItem("others"))
  // ).filter((item) => !!item) as CarePlanChecklistItem[];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );
  const passedInItems = carePlan?.tasks?.filter(
    (item) =>
      item &&
      item.scheduledTime.toDate() > today &&
      item.scheduledTime.toDate() < tomorrow &&
      (item.category === "diet" ||
        item.category === "medication" ||
        item.category === "physicalActivity")
  );

  //Sort based on time
  passedInItems.sort((a: CarePlanTask, b: CarePlanTask) => {
    const aReminder = a.time.toLowerCase() as string,
      bReminder = b.time.toLowerCase() as string;
    return reminderLookup[aReminder] - reminderLookup[bReminder];
  });

  // Merge the existing items with the passed-in items. If an item exists in
  // both, use the existing item. If an item exists only in the passed-in
  // items, use the passed-in item. If an item exists only in the existing
  // items, discard it.
  let mergedItems = passedInItems.map((passedInItem) => {
    const existingItem = existingChecklist.find(
      (existingItem) =>
        existingItem.recommendation === passedInItem.recommendation &&
        existingItem.category === passedInItem.category &&
        existingItem.details === passedInItem.details &&
        existingItem.time === passedInItem.time &&
        existingItem.scheduledTime === passedInItem.scheduledTime &&
        existingItem.refId === passedInItem.refId &&
        existingItem.checked === passedInItem.checked
    );
    if (existingItem) {
      return existingItem;
    } else {
      return passedInItem;
    }
  });

  // If the modified date has changed, reset all items to not done.
  // if (hasDateChanged()) {
  //   mergedItems = mergedItems.map((item) => ({ ...item, isDone: false }));
  // }

  // Store the merged items back into localStorage.
  window.localStorage.setItem(
    CHECKLIST_LOCAL_STORAGE_KEY,
    JSON.stringify(mergedItems)
  );
  // Return the merged items.
  return mergedItems;
};

export const useCarePlanChecklistItems = (carePlan?: CarePlan) => {
  const [carePlanChecklistItems, setCarePlanChecklistItems] = useState<
    CarePlanTask[]
  >([]);

  useEffect(() => {
    if (carePlan) {
      const data = setChecklistState(carePlan);
      setCarePlanChecklistItems(data);
    }
  }, [carePlan]);

  const setAndPersistCarePlanChecklist = (
    newCarePlanChecklist: CarePlanTask[]
  ) => {
    setCarePlanChecklistItems(newCarePlanChecklist);
    window.localStorage.setItem(
      CHECKLIST_LOCAL_STORAGE_KEY,
      JSON.stringify(newCarePlanChecklist)
    );
    window.localStorage.setItem(
      LAST_MODIFIED_LOCAL_STORAGE_KEY,
      new Date().toISOString()
    );
  };

  const maybeResetItems = useCallback(() => {
    if (hasDateChanged()) {
      const newCarePlanChecklist = carePlanChecklistItems.map((item) => ({
        ...item,
        isDone: false,
      }));
      setAndPersistCarePlanChecklist(newCarePlanChecklist);
    }
  }, [carePlanChecklistItems]);

  // Check if the day has changed every minute. If it has, reset the isDone of
  // all items to false.
  useEffect(() => {
    const intervalId = setInterval(() => {
      maybeResetItems();
    }, 1000 * 60);

    return () => clearInterval(intervalId);
  }, [maybeResetItems]);

  // Check if the day has changed when the page becomes visible again. If it
  // has, reset the isDone of all items to false.
  const onVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      maybeResetItems();
    }
  }, [maybeResetItems]);

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [maybeResetItems, onVisibilityChange]);

  return [carePlanChecklistItems, setAndPersistCarePlanChecklist] as const;
};

// const extendItem = (category: string) => (item: CarePlanItem) => {
//   if (category === "others") {
//     return {
//       ...item,
//       category,
//       isDone: false,
//       reminder: category,
//     };
//   } else {
//     return { ...item, category, isDone: false };
//   }
// };

const hasDateChanged = () => {
  const lastModifiedString = window.localStorage.getItem(
    LAST_MODIFIED_LOCAL_STORAGE_KEY
  );

  if (!lastModifiedString) {
    return false;
  }

  const lastModifiedDateString = formatISO(new Date(lastModifiedString), {
    representation: "date",
  });
  const todayDateString = formatISO(new Date(), { representation: "date" });

  return lastModifiedDateString !== todayDateString;
};

export const resetLocalStorageOnLogout = () => {
  window.localStorage.removeItem(CHECKLIST_LOCAL_STORAGE_KEY);
  window.localStorage.removeItem(LAST_MODIFIED_LOCAL_STORAGE_KEY);
};
