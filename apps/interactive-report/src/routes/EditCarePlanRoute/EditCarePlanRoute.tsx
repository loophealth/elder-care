import { FormEvent, useEffect, useState } from "react";
import { onSnapshot, updateDoc } from "firebase/firestore";

import { AdminEditorLayout } from "components/AdminEditorLayout";
import { Button } from "components/Button";
import { Input } from "components/Input";
import { Select } from "components/Select";
import { TextArea } from "components/TextArea";
import { IconTextTile } from "components/IconTextTile";
import { usePatient } from "lib/PatientProvider";
import { CATEGORY_ICONS } from "lib/carePlan";
import { CarePlan, CarePlanCategory } from "lib/commonTypes";

import "./EditCarePlanRoute.css";

export const EditCarePlanRoute = () => {
  const { patient } = usePatient();

  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);

  const [category, setCategory] = useState<CarePlanCategory | "">("");
  const [recommendation, setRecommendation] = useState("");
  const [details, setDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle form submission.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patient || category === "" || !carePlan) {
      return;
    }

    setIsLoading(true);
    try {
      const newCarePlanItem = { recommendation, details };
      const newCarePlan = [...carePlan[category], newCarePlanItem];
      await updateDoc(patient.carePlanRef, { [category]: newCarePlan });
      onReset();
    } catch (e) {
      alert(
        "There was an error while adding this item to the care plan, please contact support"
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form.
  const onReset = () => {
    setCategory("");
    setRecommendation("");
    setDetails("");
  };

  // Delete an item.
  const onDelete = async (category: CarePlanCategory, index: number) => {
    if (!patient) {
      return;
    }

    setIsLoading(true);
    try {
      const newCategoryItems = [...patient.carePlan[category]];
      newCategoryItems.splice(index, 1);
      await updateDoc(patient.carePlanRef, { [category]: newCategoryItems });
    } catch (e) {
      alert(
        "There was an error while deleting this item from the care plan, please contact support"
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminEditorLayout
      renderLeft={() => (
        <form
          className="Utils__VerticalForm EditCarePlanRoute__Form"
          onSubmit={onSubmit}
        >
          <div className="Utils__VerticalForm__Group">
            <label htmlFor="category">Category</label>
            <Select
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CarePlanCategory)}
              required
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              <option value="diet">Diet</option>
              <option value="physicalActivity">Physical Activity</option>
              <option value="medication">Medication</option>
              <option value="others">Others</option>
            </Select>
          </div>

          <div className="Utils__VerticalForm__Group">
            <label htmlFor="recommendation">Heading</label>
            <Input
              id="recommendation"
              type="text"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder="Enter the main text"
              required
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__Group">
            <label htmlFor="details">Additional info</label>
            <TextArea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Any additional info (eg. before breakfast)"
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__ButtonsContainer">
            <Button type="submit" isPrimary disabled={isLoading}>
              Add to care plan
            </Button>
          </div>
        </form>
      )}
      renderRight={() => (
        <div className="EditCarePlanRoute__CarePlan">
          {carePlan ? (
            <>
              {carePlan.diet.map((item, index) => (
                <IconTextTile
                  key={item.recommendation}
                  title={item.recommendation}
                  details={item.details}
                  icon={CATEGORY_ICONS.diet}
                  onDelete={() => onDelete("diet", index)}
                />
              ))}
              {carePlan.physicalActivity.map((item, index) => (
                <IconTextTile
                  key={item.recommendation}
                  title={item.recommendation}
                  details={item.details}
                  icon={CATEGORY_ICONS.physicalActivity}
                  onDelete={() => onDelete("physicalActivity", index)}
                />
              ))}
              {carePlan.medication.map((item, index) => (
                <IconTextTile
                  key={item.recommendation}
                  title={item.recommendation}
                  details={item.details}
                  icon={CATEGORY_ICONS.medication}
                  onDelete={() => onDelete("medication", index)}
                />
              ))}
              {carePlan.others.map((item, index) => (
                <IconTextTile
                  key={item.recommendation}
                  title={item.recommendation}
                  details={item.details}
                  icon={CATEGORY_ICONS.others}
                  onDelete={() => onDelete("others", index)}
                />
              ))}
            </>
          ) : null}
        </div>
      )}
    />
  );
};
