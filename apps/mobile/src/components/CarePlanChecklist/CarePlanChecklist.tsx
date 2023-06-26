import { useEffect, useMemo, useState } from "react";
import {
  CarePlan,
  CarePlanItem,
  CarePlanTask,
  logCustomEvent,
  usePatient,
} from "@loophealth/api";

import { Checkbox } from "components/Checkbox";
import { useCarePlanChecklistItems } from "lib/useCarePlanTodoList";

import "./CarePlanChecklist.css";

import { ReactComponent as DietIcon } from "images/rice-bowl.svg";
import { ReactComponent as MedicationIcon } from "images/pill.svg";
import { ReactComponent as PhysicalActivityIcon } from "images/walk.svg";
import { ReactComponent as OthersIcon } from "images/sun.svg";
import { ReactComponent as VideoIcon } from "images/video-logo.svg";
import { ReactComponent as BlogIcon } from "images/blog-logo.svg";
import { ReactComponent as RightArrowIcon } from "images/right-arrow.svg";
import { ReactComponent as MedPresIcon } from "images/medical-prescription.svg";
import { ReactComponent as PhysioPresIcon } from "images/physio-prescription.svg";
import { groupBy } from "lodash";
import { onSnapshot, updateDoc } from "firebase/firestore";
import { Button, ButtonVariant } from "components/Button";

export const CarePlanChecklist = () => {
  const { patient } = usePatient();
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);

  const [carePlanChecklistItems] = useCarePlanChecklistItems(
    carePlan || undefined
  );

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

  const onCheck = async (task: CarePlanTask) => {
    if (!patient || !carePlan) {
      return;
    }
    const newTask = carePlan?.tasks.map((data) => {
      if (
        data.recommendation === task.recommendation &&
        data.scheduledTime === task.scheduledTime
      ) {
        data["checked"] = !data["checked"];
        return data;
      }
      return data;
    });
    await updateDoc(patient.carePlanRef, {
      tasks: newTask,
    });
  };

  const getGroupedChecklistItem: any = useMemo(() => {
    return carePlanChecklistItems
      ? groupBy(carePlanChecklistItems, "time")
      : [];
  }, [carePlanChecklistItems]);

  // const convertToEmbedUrl = (url: string) => {
  //   return (
  //     url.replace("watch?v=", "embed/").replace("&t", "?start") + "?controls=0"
  //   );
  // };

  const getLatestPres = (data: CarePlanItem[]) => {
    const filteredData = data.sort(
      (a: CarePlanItem, b: CarePlanItem) =>
        (b?.createdOn?.valueOf() || 0) - (a?.createdOn?.valueOf() || 0)
    )[0];
    return filteredData;
  };

  const onDownloadPrescription = (data: any, type: string) => {
    logCustomEvent("ClickedOn_Download_" + type + "_Prescription", {
      name: "Download " + type + " prescription",
      category: "Home",
      user_name: patient?.profile?.fullName,
      platform: "Elder_Care",
    });
    if (data) {
      const lastPrescription =
        data.length === 1 ? data[0] : getLatestPres(data);
      window.open(lastPrescription.link, "_blank");
    }
  };

  const openLink = (link?: string, eventName?: string) => {
    logCustomEvent("ClickedOn_" + eventName, {
      name: eventName,
      category: "Home",
      user_name: patient?.profile?.fullName,
      platform: "Elder_Care",
    });
    if (link) {
      window.open(link, "_blank");
    }
  };

  const PrescriptionButton = ({
    title,
    icon,
    onClicked,
  }: {
    title: string;
    icon: any;
    onClicked: () => void;
  }) => {
    return (
      <label className="CarePlanChecklist__Items__Item Prescription_Button_Container">
        {icon}
        <div>
          <div className="CarePlanChecklist__Items__Item__Name Prescription_Label">
            {title}
          </div>
        </div>
        <Button variant={ButtonVariant.Primary} onClick={onClicked}>
          Download
        </Button>
      </label>
    );
  };

  return (
    <div className="CarePlanChecklist">
      <div className="CarePlanChecklist__Title">Care plan</div>
      {(carePlan?.prescription && carePlan?.prescription.length > 0) ||
      (carePlan?.physioPrescription &&
        carePlan?.physioPrescription.length > 0) ? (
        <div className="Prescription__Title">{"Latest Prescriptions"}</div>
      ) : null}
      {carePlan?.prescription && carePlan?.prescription.length > 0 ? (
        <PrescriptionButton
          title="Physician"
          icon={
            <MedPresIcon className="CarePlanChecklist__Items__Item__Icon" />
          }
          onClicked={() =>
            onDownloadPrescription(carePlan?.prescription, "Physician")
          }
        />
      ) : null}
      {carePlan?.physioPrescription &&
      carePlan?.physioPrescription.length > 0 ? (
        <PrescriptionButton
          title="Physiotherapy"
          icon={
            <PhysioPresIcon className="CarePlanChecklist__Items__Item__Icon" />
          }
          onClicked={() =>
            onDownloadPrescription(
              carePlan?.physioPrescription,
              "Physiotherapy"
            )
          }
        />
      ) : null}
      {Object.keys(getGroupedChecklistItem)?.length > 0 ? (
        <div className="Prescription__Title">{"Today’s tasks"}</div>
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
                  (item: CarePlanTask, index: number) => {
                    const icon = icons.get(item.category) || "";

                    return (
                      <label
                        key={item.recommendation + "_" + index}
                        className={
                          item?.checked
                            ? "CarePlanChecklist__Items__Item CarePlanChecklist__Items__Item__Checked"
                            : "CarePlanChecklist__Items__Item"
                        }
                      >
                        {!patient?.profile?.parentId ? (
                          <Checkbox
                            type="checkbox"
                            className={
                              "CarePlanChecklist__Items__Item__Checkbox"
                            }
                            checked={item?.checked}
                            readOnly={false}
                            onChange={() => onCheck(item)}
                          />
                        ) : null}
                        <div>
                          <div
                            className={
                              item?.checked
                                ? "CarePlanChecklist__Items__Item__Name Checked__Item__Label"
                                : "CarePlanChecklist__Items__Item__Name"
                            }
                          >
                            {item.recommendation}
                          </div>
                          {item.meal.toString() ? (
                            <div
                              className={
                                item?.checked
                                  ? "CarePlanChecklist__Items__Item__Description Checked__Item__Label"
                                  : "CarePlanChecklist__Items__Item__Description"
                              }
                            >
                              {item.meal.toString()}
                              {item.dateRange ? (
                                <span>
                                  {" "}
                                  &#x2022; {item.dateRange?.toString()}
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                          {item.details ? (
                            <div
                              className={
                                item?.checked
                                  ? "CarePlanChecklist__Items__Item__Description Checked__Item__Label"
                                  : "CarePlanChecklist__Items__Item__Description"
                              }
                            >
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
      {carePlan?.others && carePlan?.others?.length !== 0 ? (
        <div className="CarePlanChecklist__Container_Margin">
          <div className="Utils__Label CarePlanChecklist__TodayLabel">
            {"OTHERS"}
          </div>
          {carePlan?.others.map((item, index) => {
            const icon = icons.get("others") || "";
            return (
              <label
                key={item.recommendation + "_" + index}
                className="CarePlanChecklist__Items__Item"
              >
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
      ) : null}
      {carePlan?.suggestedContent &&
      carePlan?.suggestedContent?.length !== 0 ? (
        <div className="CarePlanChecklist__Container_Margin Suggested__Content__Container">
          <div className="Prescription__Title">{"Referred content"}</div>
          {carePlan?.suggestedContent.map((item, index) => (
            <div
              key={item.recommendation + "_" + index}
              className="CarePlanChecklist__Items CarePlanChecklist__Items_Margin"
            >
              <label className="CarePlanChecklist__Items__Item">
                <div>
                  {item.link ? (
                    <div
                      className="CarePlanChecklist__Items__Suggested__Content"
                      onClick={() => openLink(item?.link, "Referred_Content")}
                    >
                      {item.link.indexOf("youtube") !== -1 ? (
                        <>
                          <VideoIcon className="CarePlanChecklist__Items__Item__Icon" />
                          <div className="CarePlanChecklist__Items__Item__Name Suggested__Content__Label">
                            {item.recommendation}
                          </div>
                          <RightArrowIcon />
                        </>
                      ) : (
                        <>
                          <BlogIcon className="CarePlanChecklist__Items__Item__Icon" />
                          <div className="CarePlanChecklist__Items__Item__Name Suggested__Content__Label">
                            {item.recommendation}
                          </div>
                          <RightArrowIcon />
                        </>
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
