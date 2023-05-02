import { useMemo } from "react";
import { usePatient } from "@loophealth/api";

import { Checkbox } from "components/Checkbox";
import {
  CarePlanChecklistItem,
  useCarePlanChecklistItems,
} from "lib/useCarePlanTodoList";

import "./CarePlanChecklist.css";

import { ReactComponent as DietIcon } from "images/rice-bowl.svg";
import { ReactComponent as MedicationIcon } from "images/pill.svg";
import { ReactComponent as PhysicalActivityIcon } from "images/walk.svg";
import { ReactComponent as OthersIcon } from "images/sun.svg";
import { groupBy } from "lodash";

export const CarePlanChecklist = () => {
  const { patient } = usePatient();

  const carePlan = patient?.carePlan;
  const [carePlanChecklistItems, setCarePlanChecklistItems] =
    useCarePlanChecklistItems(carePlan);

  const onCheck = (id: string) => {
    let newCarePlanChecklistItems = [...carePlanChecklistItems];
    newCarePlanChecklistItems = newCarePlanChecklistItems.map((item: any) => {
      if (item.id === id) {
        item["isDone"] = !item["isDone"];
      }
      return item;
    });
    setCarePlanChecklistItems(newCarePlanChecklistItems);
  };

  const getGroupedChecklistItem: any = useMemo(() => {
    return carePlanChecklistItems
      ? groupBy(carePlanChecklistItems, "reminder")
      : [];
  }, [carePlanChecklistItems]);

  const convertToEmbedUrl = (url: string) => {
    return (
      url.replace("watch?v=", "embed/").replace("&t", "?start") + "?controls=0"
    );
  };

  return (
    <div className="CarePlanChecklist">
      <div className="CarePlanChecklist__Title">Your care plan</div>
      {Object.keys(getGroupedChecklistItem).map((data: string) => (
        <div key={data}>
          <div className="Utils__Label CarePlanChecklist__TodayLabel">
            {data.toUpperCase()}
          </div>
          <div className="CarePlanChecklist__Items">
            {getGroupedChecklistItem[data].map(
              (item: CarePlanChecklistItem, index: number) => {
                const icon = icons.get(item.category) || "";

                return (
                  <label
                    key={item.recommendation}
                    className="CarePlanChecklist__Items__Item"
                  >
                    <Checkbox
                      type="checkbox"
                      className="CarePlanChecklist__Items__Item__Checkbox"
                      checked={item.isDone}
                      onChange={() => onCheck(item.id)}
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
              }
            )}
          </div>
        </div>
      ))}
      <div className="CarePlanChecklist__Container_Margin">
        <div className="Utils__Label CarePlanChecklist__TodayLabel">
          {"SUGGESTED CONTENT"}
        </div>
        {carePlan?.suggestedContent.map((item) => (
          <div
            key={item.recommendation}
            className="CarePlanChecklist__Items CarePlanChecklist__Items_Margin"
          >
            <label className="CarePlanChecklist__Items__Item">
              <div>
                <div className="CarePlanChecklist__Items__Item__Name">
                  {item.recommendation}
                </div>
                {item.link ? (
                  <div className="CarePlanChecklist__Items__Item__Description">
                    {item.link.indexOf("youtube") !== -1 ? (
                      <iframe
                        title="Loop health video"
                        src={convertToEmbedUrl(item.link)}
                        width={window.innerWidth}
                        height={0.57 * window.innerWidth}
                        loading="eager"
                        seamless={true}
                      />
                    ) : (
                      <a href={item.link}>{"Open Link"}</a>
                    )}
                  </div>
                ) : null}
              </div>
            </label>
          </div>
        ))}
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
