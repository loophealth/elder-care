import { concat } from "lodash";

import { CarePlanItem, usePatient } from "@loophealth/api";

import { Checkbox } from "components/Checkbox";

import "./CarePlanChecklist.css";

import { ReactComponent as DietIcon } from "images/rice-bowl.svg";
import { ReactComponent as MedicationIcon } from "images/pill.svg";
import { ReactComponent as PhysicalActivityIcon } from "images/walk.svg";
import { ReactComponent as OthersIcon } from "images/sun.svg";

interface CarePlainItemWithCategory extends CarePlanItem {
  category: string;
}

export const CarePlanChecklist = () => {
  const { patient } = usePatient();

  const addCategory = (category: string) => (item: CarePlanItem) => ({
    ...item,
    category,
  });

  const carePlan = patient?.carePlan;
  const carePlanItems = concat(
    [],
    carePlan?.diet.map(addCategory("diet")),
    carePlan?.medication.map(addCategory("medication")),
    carePlan?.physicalActivity.map(addCategory("physicalActivity")),
    carePlan?.others.map(addCategory("others"))
  ).filter((item) => !!item) as CarePlainItemWithCategory[];

  return (
    <div className="CarePlanChecklist">
      <div className="CarePlanChecklist__Title">Your care plan</div>
      <div className="Utils__Label CarePlanChecklist__TodayLabel">Today</div>
      <div className="CarePlanChecklist__Items">
        {carePlanItems.map((item) => {
          const icon = icons.get(item.category);

          return (
            <label
              key={item.recommendation}
              className="CarePlanChecklist__Items__Item"
            >
              <Checkbox
                type="checkbox"
                className="CarePlanChecklist__Items__Item__Checkbox"
              />
              <div>
                <div className="CarePlanChecklist__Items__Item__Name">
                  {item.recommendation}
                </div>
                {item.details ? (
                  <div className="CarePlanChecklist__Items__Item__Description">
                    {item.details}
                  </div>
                ) : null}
              </div>
              {icon}
            </label>
          );
        })}
      </div>
    </div>
  );
};

const icons = new Map([
  ["diet", <DietIcon className="CarePlanChecklist__Items__Item__Icon" />],
  [
    "medication",
    <MedicationIcon className="CarePlanChecklist__Items__Item__Icon" />,
  ],
  [
    "physicalActivity",
    <PhysicalActivityIcon className="CarePlanChecklist__Items__Item__Icon" />,
  ],
  ["others", <OthersIcon className="CarePlanChecklist__Items__Item__Icon" />],
]);
