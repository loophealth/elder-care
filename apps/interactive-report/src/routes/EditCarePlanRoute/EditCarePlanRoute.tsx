import { FormEvent, useEffect, useState } from "react";
import { onSnapshot, updateDoc } from "firebase/firestore";

import {
  usePatient,
  CarePlan,
  CarePlanCategory,
  CarePlanFilterCategory,
  CarePlanReminder,
  CarePlanItem,
  PatientNotificationItem,
} from "@loophealth/api";

import {
  AdminEditorLayout,
  Button,
  Input,
  Select,
  TextArea,
  IconTextTile,
  IconTextTileList,
} from "components";
import { CATEGORY_ICONS } from "lib/carePlan";

import "./EditCarePlanRoute.css";
import { carePlanCategoryTime, generateId, notificationSource } from "utils";

export const EditCarePlanRoute = () => {
  const { patient } = usePatient();

  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);

  const [category, setCategory] = useState<CarePlanCategory | "">("");
  const [filterCategory, setFilterCategory] = useState<
    CarePlanFilterCategory | ""
  >("");
  const [recommendation, setRecommendation] = useState("");
  const [details, setDetails] = useState("");
  const [reminder, setReminder] = useState<CarePlanReminder | "">("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<PatientNotificationItem[]>(
    []
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

    const unsubNotification = onSnapshot(
      patient.notificationRef,
      (snapshot) => {
        const data = snapshot.data();
        const notifications: PatientNotificationItem[] =
          data?.notifications ?? [];
        setNotifications(notifications);
      }
    );

    return () => {
      unsub();
      unsubNotification();
    };
  }, [patient]);

  const updateCarePlanNotification = (reminder: string, id: string) => {
    // Care Plan Notification daily
    let newNotification: PatientNotificationItem = {
      id,
      title: recommendation,
      body: details,
      sent: false,
      time: (carePlanCategoryTime as any)[reminder],
      source: notificationSource.carePlan,
    };
    const newNotifications = [...notifications, newNotification];
    return newNotifications;
  };

  // Handle form submission.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patient || category === "" || !carePlan) {
      return;
    }

    setIsLoading(true);
    const newCarePlanId = generateId();
    try {
      const newCarePlanItem = {
        id: newCarePlanId,
        recommendation,
        details,
        reminder,
        link,
      };
      const newCarePlan = [...carePlan[category], newCarePlanItem];
      await updateDoc(patient.carePlanRef, { [category]: newCarePlan });
      if (category !== "suggestedContent" && reminder) {
        await updateDoc(patient.notificationRef, {
          notifications: updateCarePlanNotification(reminder, newCarePlanId),
        });
      }
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
    setReminder("");
  };

  // Delete an item.
  const onDelete = async (category: CarePlanCategory, id: string) => {
    if (!patient) {
      return;
    }

    setIsLoading(true);
    try {
      let newCategoryItems = [...patient.carePlan[category]];
      newCategoryItems = newCategoryItems.filter((item) => item.id !== id);
      await updateDoc(patient.carePlanRef, { [category]: newCategoryItems });

      //Delete Care plan Notification
      let newNotifications = [...notifications];
      newNotifications = newNotifications.filter(
        (data) => !data.id || (data.id && data.id !== id)
      );
      await updateDoc(patient.notificationRef, {
        notifications: newNotifications,
      });
    } catch (e) {
      alert(
        "There was an error while deleting this item from the care plan, please contact support"
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredData = (
    carePlan: CarePlan,
    filterCategory: CarePlanFilterCategory
  ) => {
    const filteredDiet = carePlan.diet
      ?.filter((item: CarePlanItem) => item.reminder === filterCategory)
      .map((item: CarePlanItem, index: number) => (
        <IconTextTile
          key={`${item.recommendation}-${index}`}
          title={item.recommendation}
          details={item.details}
          icon={CATEGORY_ICONS.diet}
          onDelete={() => onDelete("diet", item?.id)}
        />
      ));
    const filteredPhysicalActivity = carePlan.physicalActivity
      ?.filter((item: CarePlanItem) => item.reminder === filterCategory)
      .map((item: CarePlanItem, index: number) => (
        <IconTextTile
          key={`${item.recommendation}-${index}`}
          title={item.recommendation}
          details={item.details}
          icon={CATEGORY_ICONS.physicalActivity}
          onDelete={() => onDelete("physicalActivity", item?.id)}
        />
      ));
    const filteredMedication = carePlan.medication
      ?.filter((item: CarePlanItem) => item.reminder === filterCategory)
      .map((item: CarePlanItem, index: number) => (
        <IconTextTile
          key={`${item.recommendation}-${index}`}
          title={item.recommendation}
          details={item.details}
          icon={CATEGORY_ICONS.medication}
          onDelete={() => onDelete("medication", item?.id)}
        />
      ));
    return [...filteredDiet, filteredPhysicalActivity, ...filteredMedication];
  };

  return (
    <AdminEditorLayout
      title="Care Plan"
      renderLeft={() => (
        <form
          className="Utils__VerticalForm EditCarePlanRoute__Form"
          onSubmit={onSubmit}
        >
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="category">
              Category
            </label>
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
              <option value="suggestedContent">Suggested content</option>
            </Select>
          </div>

          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="recommendation">
              Heading
            </label>
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
          {category === "suggestedContent" ? (
            <div className="Utils__VerticalForm__Group">
              <label className="Utils__Label" htmlFor="link">
                Enter Link
              </label>
              <TextArea
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter Link"
                disabled={isLoading}
              />
            </div>
          ) : null}
          {category !== "suggestedContent" ? (
            <>
              <div className="Utils__VerticalForm__Group">
                <label className="Utils__Label" htmlFor="details">
                  Additional info
                </label>
                <TextArea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Any additional info (eg. before breakfast)"
                  disabled={isLoading}
                />
              </div>

              <div className="Utils__VerticalForm__Group">
                <label className="Utils__Label" htmlFor="reminder">
                  Set reminder
                </label>
                <Select
                  name="reminder"
                  id="reminder"
                  value={reminder}
                  onChange={(e) =>
                    setReminder(e.target.value as CarePlanReminder)
                  }
                  disabled={isLoading}
                >
                  <option value="">Select reminder</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="night">Night</option>
                </Select>
              </div>
            </>
          ) : null}

          <div className="Utils__VerticalForm__ButtonsContainer">
            <Button type="submit" isPrimary disabled={isLoading}>
              Add to care plan
            </Button>
          </div>
        </form>
      )}
      renderRight={() => (
        <div className="Utils__VerticalForm EditCarePlanRoute__Form">
          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label Hide_Label" htmlFor="filterCategory">
              Care Plan for
            </label>
            <Select
              name="filterCategory"
              id="filterCategory"
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as CarePlanFilterCategory)
              }
              required
              disabled={isLoading}
            >
              <option value="">Show Care Plan for</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
              <option value="suggestedContent">Suggested content</option>
            </Select>
          </div>
          <div className="Utils__VerticalForm__Group">
            <IconTextTileList>
              {carePlan &&
              filterCategory &&
              filterCategory !== "suggestedContent" ? (
                getFilteredData(carePlan, filterCategory)
              ) : carePlan &&
                filterCategory &&
                filterCategory === "suggestedContent" ? (
                <>
                  {carePlan.suggestedContent?.map((item, index) => (
                    <IconTextTile
                      key={`${item.recommendation}-${index}`}
                      title={item.recommendation}
                      link={item?.link}
                      icon={CATEGORY_ICONS.suggestedContent}
                      onDelete={() => onDelete("suggestedContent", item.id)}
                    />
                  ))}
                </>
              ) : null}
            </IconTextTileList>
          </div>
        </div>
      )}
    />
  );
};
