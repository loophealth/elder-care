import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";

import {
  CarePlan,
  CarePlanCategory,
  CarePlanItem,
  usePatient,
} from "@loophealth/api";

import { Navbar, IconTextTile } from "components";
import { CATEGORY_ICONS } from "lib/carePlan";

import "./CarePlanRoute.css";
import { LoadingSpinner } from "@loophealth/ui";

export const CarePlanRoute = () => {
  const { patient } = usePatient();
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);

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

  return (
    <>
      <Navbar />
      {!carePlan ? (
        <div className="CareLoaderMargin">
          <LoadingSpinner />
        </div>
      ) : (
        <main className="CarePlanRoute">
          <div className="CarePlanRoute__CategoryList">
            <h1 className="Utils__Label Utils__Label--Bold CarePlanRoute__CategoryList__CategoryTitle">
              Diet
            </h1>
            <TileList items={carePlan?.diet ?? []} category="diet" />
          </div>
          <div className="CarePlanRoute__CategoryList">
            <h1 className="Utils__Label Utils__Label--Bold CarePlanRoute__CategoryList__CategoryTitle">
              Physical Activity
            </h1>
            <TileList
              items={carePlan?.physicalActivity ?? []}
              category="physicalActivity"
            />
          </div>
          <div className="CarePlanRoute__CategoryList">
            <h1 className="Utils__Label Utils__Label--Bold CarePlanRoute__CategoryList__CategoryTitle">
              Medication
            </h1>
            <TileList
              items={carePlan?.medication ?? []}
              category="medication"
            />
          </div>
          <div className="CarePlanRoute__CategoryList">
            <h1 className="Utils__Label Utils__Label--Bold CarePlanRoute__CategoryList__CategoryTitle">
              Others
            </h1>
            <TileList items={carePlan?.others ?? []} category="others" />
          </div>
          {carePlan?.suggestedContent &&
          carePlan.suggestedContent.length > 0 ? (
            <div className="CarePlanRoute__CategoryList">
              <h1 className="Utils__Label Utils__Label--Bold CarePlanRoute__CategoryList__CategoryTitle">
                Suggested Content
              </h1>
              <TileList
                items={carePlan?.suggestedContent ?? []}
                category="suggestedContent"
              />
            </div>
          ) : null}
        </main>
      )}
    </>
  );
};

const TileList = ({
  items,
  category,
}: {
  items: CarePlanItem[];
  category: CarePlanCategory;
}) => {
  return (
    <>
      {items.map((item) => (
        <IconTextTile
          key={item.recommendation}
          title={item.recommendation}
          details={item.details}
          link={item?.link}
          icon={
            category !== "suggestedContent" && category !== "prescription"
              ? CATEGORY_ICONS[category]
              : ""
          }
        />
      ))}
      {items.length === 0 ? (
        <IconTextTile
          key="noItems"
          title="No recommendations"
          details="No recommendations for this category"
        />
      ) : null}
    </>
  );
};
