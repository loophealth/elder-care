import { useEffect, useMemo, useState } from "react";
import { CarePlan, logCustomEvent, usePatient } from "@loophealth/api";

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
import { onSnapshot } from "firebase/firestore";
import { Button, ButtonVariant } from "components/Button";

export const CarePlanChecklist = () => {
  const { patient } = usePatient();
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);

  const [carePlanChecklistItems, setCarePlanChecklistItems] =
    useCarePlanChecklistItems(carePlan || undefined);

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

  const onDownloadPrescription = () => {
    logCustomEvent("click_event", {
      name: "Download prescription",
      category: "Home",
    });
    const prescription = carePlan?.prescription;
    if (prescription) {
      const lastPrescription = prescription[prescription.length - 1];
      window.open(lastPrescription.link, "_blank");
    }
  };

  return (
    <div className="CarePlanChecklist">
      <div className="CarePlanChecklist__Title">Care plan</div>
      {carePlan?.prescription && carePlan?.prescription.length > 0 ? (
        <div className="HomeRoute__Logout">
          <Button
            className="HomeRoute__Logout__Button"
            variant={ButtonVariant.Primary}
            onClick={onDownloadPrescription}
          >
            Download prescription
          </Button>
        </div>
      ) : null}
      {Object.keys(getGroupedChecklistItem).map((data: string) => {
        if (
          getGroupedChecklistItem[data] &&
          getGroupedChecklistItem[data].length !== 0
        ) {
          return (
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
          );
        } else {
          return null;
        }
      })}
      {carePlan?.suggestedContent &&
      carePlan?.suggestedContent?.length !== 0 ? (
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
      ) : null}
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
