import { useCallback, useEffect, useState } from "react";
import { concat } from "lodash";
import { formatISO } from "date-fns";

import { CarePlan, CarePlanItem } from "@loophealth/api";

export interface CarePlanChecklistItem extends CarePlanItem {
  category: string;
  isDone: boolean;
}

const CHECKLIST_LOCAL_STORAGE_KEY = "carePlanChecklist";
const LAST_MODIFIED_LOCAL_STORAGE_KEY = "carePlanChecklistLastModified";

export const useCarePlanChecklistItems = (carePlan?: CarePlan) => {
  const [carePlanChecklistItems, setCarePlanChecklistItems] = useState<
    CarePlanChecklistItem[]
  >(() => {
    // Find existing items in localStorage.
    const existingChecklistJson = window.localStorage.getItem(
      CHECKLIST_LOCAL_STORAGE_KEY
    );
    let existingChecklist = [] as CarePlanChecklistItem[];
    if (existingChecklistJson) {
      existingChecklist = JSON.parse(
        existingChecklistJson
      ) as CarePlanChecklistItem[];
    }

    // Add metadata to items passed in from the user.
    const passedInItems = concat(
      carePlan?.diet.map(extendItem("diet")),
      carePlan?.medication.map(extendItem("medication")),
      carePlan?.physicalActivity.map(extendItem("physicalActivity")),
      carePlan?.others.map(extendItem("others"))
    ).filter((item) => !!item) as CarePlanChecklistItem[];

    // Merge the existing items with the passed-in items. If an item exists in
    // both, use the existing item. If an item exists only in the passed-in
    // items, use the passed-in item. If an item exists only in the existing
    // items, discard it.
    let mergedItems = passedInItems.map((passedInItem) => {
      const existingItem = existingChecklist.find(
        (existingItem) =>
          existingItem.recommendation === passedInItem.recommendation &&
          existingItem.category === passedInItem.category &&
          existingItem.details === passedInItem.details
      );
      if (existingItem) {
        return existingItem;
      } else {
        return passedInItem;
      }
    });

    // If the modified date has changed, reset all items to not done.
    if (hasDateChanged()) {
      mergedItems = mergedItems.map((item) => ({ ...item, isDone: false }));
    }

    // Store the merged items in localStorage.
    window.localStorage.setItem(
      CHECKLIST_LOCAL_STORAGE_KEY,
      JSON.stringify(mergedItems)
    );

    // Return the merged items.
    return mergedItems;
  });

  const setAndPersistCarePlanChecklist = (
    newCarePlanChecklist: CarePlanChecklistItem[]
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

  return [carePlanChecklistItems, setAndPersistCarePlanChecklist] as const;
};

const extendItem = (category: string) => (item: CarePlanItem) => ({
  ...item,
  category,
  isDone: false,
});

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
