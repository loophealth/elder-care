import { useState } from "react";
import { concat } from "lodash";

import { CarePlan, CarePlanItem } from "@loophealth/api";

export interface CarePlanChecklistItem extends CarePlanItem {
  category: string;
  isDone: boolean;
}

const LOCAL_STORAGE_KEY = "carePlanChecklist";

export const useCarePlanChecklistItems = (carePlan?: CarePlan) => {
  const [carePlanChecklistItems, setCarePlanChecklistItems] = useState<
    CarePlanChecklistItem[]
  >(() => {
    // Find existing items in localStorage.
    const existingChecklistJson =
      window.localStorage.getItem(LOCAL_STORAGE_KEY);
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
    const mergedItems = passedInItems.map((passedInItem) => {
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

    // Store the merged items in localStorage.
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedItems));

    // Return the merged items.
    return mergedItems;
  });

  const setAndPersistCarePlanChecklist = (
    newCarePlanChecklist: CarePlanChecklistItem[]
  ) => {
    setCarePlanChecklistItems(newCarePlanChecklist);
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(newCarePlanChecklist)
    );
  };

  return [carePlanChecklistItems, setAndPersistCarePlanChecklist] as const;
};

const extendItem = (category: string) => (item: CarePlanItem) => ({
  ...item,
  category,
  isDone: false,
});
