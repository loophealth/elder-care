import { FormEvent, useEffect, useState } from "react";
import { onSnapshot, updateDoc } from "firebase/firestore";

import {
  usePatient,
  CarePlan,
  CarePlanCategory,
  PatientNotificationItem,
  CarePlanItem,
  deleteFileFromUrl,
  getUrlFromFile,
} from "@loophealth/api";

import {
  AdminEditorLayout,
  Button,
  Input,
  Select,
  TextArea,
  IconTextTile,
  IconTextTileList,
  MultiSelect,
} from "components";
import { CATEGORY_ICONS } from "lib/carePlan";

import "./EditCarePlanRoute.css";
import {
  // carePlanCategoryTime,
  createTask,
  formatDateRange,
  generateId,
  getTodayDate,
  // notificationSource,
} from "utils";

export const EditCarePlanRoute = () => {
  const { patient } = usePatient();

  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [category, setCategory] = useState<CarePlanCategory | "">("");
  const [recommendation, setRecommendation] = useState("");
  const [details, setDetails] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<PatientNotificationItem[]>(
    []
  );
  const [selectedData, setSelectedData] = useState<
    CarePlanItem | undefined | null
  >();

  const [prescriptionFile, setPrescriptionFile] = useState("");
  const [prescriptionData, setPrescriptionData] = useState<File | null>();

  const [time, setTime] = useState<string[] | []>([]);
  const [meal, setMeal] = useState<string[] | []>([]);
  const [days, setDays] = useState<string[] | []>([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  // const updateCarePlanNotification = (reminder: string, id: string) => {
  //   // Care Plan Notification daily
  //   let newNotification: PatientNotificationItem = {
  //     id,
  //     title: recommendation,
  //     body: details,
  //     sent: false,
  //     time: (carePlanCategoryTime as any)[reminder],
  //     source: notificationSource.carePlan,
  //   };
  //   return newNotification;
  // };

  // Handle form submission.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patient || category === "" || !carePlan) {
      return;
    }

    if (selectedData) {
      onUpdate(category, selectedData.id);
    } else {
      setIsLoading(true);
      let fileUrl = "";

      try {
        const newCarePlanId = generateId();

        //If link exsist skip prescription file upload
        if (prescriptionData && !link) {
          const metadata = {
            id: newCarePlanId,
            category: category,
            phoneNumber: patient.profile.phoneNumber,
            createdAt: new Date(),
          };
          fileUrl = (await getUrlFromFile(prescriptionData, metadata)) || "";
        }

        const careData = {
          recommendation,
          details,
          days,
          time,
          meal,
          dateRange: {
            from: startDate,
            to: endDate,
          },
        };
        const newCarePlanItem = {
          ...careData,
          id: newCarePlanId,
          link: link || fileUrl,
        };
        const newCarePlan =
          category === "prescription"
            ? [newCarePlanItem]
            : [...carePlan[category], newCarePlanItem];

        const careTaskData = {
          ...careData,
          refId: newCarePlanId,
          category,
        };
        const tasks = createTask(careTaskData);
        const newTask = carePlan.tasks ? [...carePlan.tasks, ...tasks] : tasks;
        await updateDoc(patient.carePlanRef, {
          [category]: newCarePlan,
          tasks: newTask,
        });

        // if (
        //   category !== "suggestedContent" &&
        //   category !== "others" &&
        //   category !== "prescription" &&
        //   reminder
        // ) {
        //   await updateDoc(patient.notificationRef, {
        //     notifications: [
        //       ...notifications,
        //       updateCarePlanNotification(reminder, newCarePlanId),
        //     ],
        //   });
        // }
        onReset();
      } catch (e) {
        alert(
          "There was an error while adding this item to the care plan, please contact support"
        );
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Reset form.
  const onReset = () => {
    setCategory("");
    setRecommendation("");
    setDetails("");
    setLink("");
    setSelectedData(null);
    setPrescriptionFile("");
    setPrescriptionData(null);
    setStartDate("");
    setEndDate("");
    setTime([]);
    setMeal([]);
    setDays([]);
  };

  // Delete an item.
  const onDelete = async (category: CarePlanCategory, item: CarePlanItem) => {
    if (!patient || !carePlan) {
      return;
    }

    setIsLoading(true);
    try {
      let newCategoryItems = [...carePlan[category]];
      let newTask = carePlan.tasks ? [...carePlan.tasks] : [];
      newCategoryItems = newCategoryItems.filter((data) => data.id !== item.id);
      newTask = newTask?.filter(
        (data) =>
          data.scheduledTime.toDate() < new Date() || data?.refId !== item.id
      );
      await updateDoc(patient.carePlanRef, {
        [category]: newCategoryItems,
        tasks: newTask,
      });

      //Delete Care plan Notification
      let newNotifications = [...notifications];
      newNotifications = newNotifications.filter(
        (data) => !data.id || (data.id && data.id !== item.id)
      );
      await updateDoc(patient.notificationRef, {
        notifications: newNotifications,
      });
      if (item.link) await deleteFileFromUrl(item.link);
    } catch (e) {
      alert(
        "There was an error while deleting this item from the care plan, please contact support"
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  //update data on edit
  const updateData = (category: CarePlanCategory, item: CarePlanItem) => {
    onReset();
    setSelectedData(item);
    setCategory(category);
    if (item?.recommendation) {
      setRecommendation(item.recommendation);
    }
    if (item?.details) {
      setDetails(item.details);
    }
    if (item?.link) {
      setLink(item.link);
    }
  };

  // Update item.
  const onUpdate = async (category: CarePlanCategory, id: string) => {
    if (!patient || !carePlan) {
      return;
    }

    setIsLoading(true);
    let fileUrl = "";

    try {
      //If link exsist skip prescription file upload
      if (prescriptionData && !link) {
        const metadata = {
          id,
          category: category,
          phoneNumber: patient.profile.phoneNumber,
          createdAt: new Date(),
        };
        fileUrl = (await getUrlFromFile(prescriptionData, metadata)) || "";
      }
      let categoryItems = [...carePlan[category]];

      const updatedData = categoryItems.map((item) => {
        if (item.id === id) {
          item.details = details;
          item.link = link || fileUrl;
          item.recommendation = recommendation;
        }
        return item;
      });

      await updateDoc(patient.carePlanRef, { [category]: updatedData });
      // if (reminder && id) {
      //   //Update Care plan Notification
      //   let newNotifications = [...notifications];
      //   newNotifications = newNotifications.filter(
      //     (data) => !data.id || (data.id && data.id !== id)
      //   );
      //   newNotifications = [
      //     ...newNotifications,
      //     updateCarePlanNotification(reminder, id),
      //   ];
      //   await updateDoc(patient.notificationRef, {
      //     notifications: newNotifications,
      //   });
      // }
      onReset();
    } catch (e) {
      alert(
        "There was an error while updating this item, please contact support"
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const isTask = () =>
    category === "medication" ||
    category === "diet" ||
    category === "physicalActivity";

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
              <option value="prescription">Prescription</option>
              <option value="suggestedContent">Suggested content</option>
              <option value="others">Others</option>
            </Select>
          </div>

          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="recommendation">
              {category === "medication" ? "Medicine" : "Heading"}
            </label>
            <Input
              id="recommendation"
              type="text"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder={
                category === "medication"
                  ? "Medicine Name"
                  : "Enter the main text"
              }
              required
              disabled={isLoading}
            />
          </div>
          {category === "suggestedContent" || category === "prescription" ? (
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
          {category === "prescription" ? (
            <div className="Utils__VerticalForm__Group">
              <label className="Utils__Label" htmlFor="prescriptionFile">
                Select prescription (upto 2Mb)
              </label>
              <Input
                id="prescriptionFile"
                type="file"
                accept="image/*,.pdf"
                value={prescriptionFile}
                onChange={async (e) => {
                  setPrescriptionFile(e.target.value);
                  setPrescriptionData(e.target.files?.[0]);
                }}
                placeholder="Select prescription"
                disabled={isLoading}
                multiple={false}
              />
            </div>
          ) : null}
          {category !== "suggestedContent" &&
          category !== "prescription" &&
          category !== "medication" ? (
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
          ) : null}
          {category !== "suggestedContent" &&
          category !== "others" &&
          category !== "prescription" ? (
            <>
              <div className="Utils__VerticalForm__Group">
                <label className="Utils__Label" htmlFor="time">
                  Time
                </label>
                <MultiSelect
                  id="time"
                  name="Care_Time_Multiselect"
                  data={["Morning", "Afternoon", "Evening", "Night"]}
                  value={time}
                  onChange={setTime}
                  required={isTask()}
                />
              </div>
              {category === "medication" ? (
                <div className="Utils__VerticalForm__Group">
                  <label className="Utils__Label" htmlFor="food">
                    With meal?
                  </label>
                  <MultiSelect
                    id="food"
                    name="Care_Meal_Multiselect"
                    data={["After food", "On empty stomach", "No preference"]}
                    value={meal}
                    onChange={setMeal}
                    multiple={false}
                    required={isTask()}
                  />
                </div>
              ) : null}
              <div className="Utils__VerticalForm__Group">
                <label className="Utils__Label" htmlFor="days">
                  Days applicable
                </label>
                <MultiSelect
                  id="days"
                  name="Care_Day_Multiselect"
                  data={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                  value={days}
                  onChange={setDays}
                  required={isTask()}
                />
              </div>
              <div className="Utils__VerticalForm__Group">
                <label className="Utils__Label" htmlFor="dateRange">
                  Dates that this will run for:
                </label>
                <div className="Date_Range_Input" id="dateRange">
                  <Input
                    id="startDate"
                    type="date"
                    placeholder="Select Start Date"
                    value={startDate}
                    min={getTodayDate()}
                    onChange={(event) => setStartDate(event.target.value)}
                    disabled={isLoading}
                    required={isTask()}
                  />
                  <Input
                    id="endDate"
                    type="date"
                    placeholder="Select End Date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    disabled={isLoading}
                    required={isTask()}
                  />
                </div>
              </div>
            </>
          ) : null}

          <div className="Utils__VerticalForm__ButtonsContainer">
            <Button type="submit" isPrimary disabled={isLoading}>
              {selectedData ? "Done" : "Add to care plan"}
            </Button>
            {selectedData ? (
              <Button onClick={onReset} isPrimary={false} disabled={isLoading}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      )}
      renderRight={() => (
        <IconTextTileList>
          {carePlan ? (
            <>
              {carePlan.prescription.map((item) => (
                <IconTextTile
                  key={item.id}
                  title={item.recommendation}
                  icon={CATEGORY_ICONS.prescription}
                  link={item?.link}
                  onDelete={() => onDelete("prescription", item)}
                  onUpdate={() => updateData("prescription", item)}
                />
              ))}
              {carePlan.medication.map((item) => (
                <IconTextTile
                  key={item.id}
                  title={item.recommendation}
                  details={item?.days?.toString()}
                  description_line_1={item?.time?.toString()}
                  description_line_2={formatDateRange(item?.dateRange)}
                  icon={CATEGORY_ICONS.medication}
                  onDelete={() => onDelete("medication", item)}
                  // onUpdate={() => updateData("medication", item)}
                />
              ))}
              {carePlan.diet.map((item) => (
                <IconTextTile
                  key={item.id}
                  title={item.recommendation}
                  details={item.details}
                  description_line_1={item?.days?.toString()}
                  description_line_2={item?.time?.toString()}
                  description_line_3={formatDateRange(item?.dateRange)}
                  icon={CATEGORY_ICONS.diet}
                  onDelete={() => onDelete("diet", item)}
                  // onUpdate={() => updateData("diet", item)}
                />
              ))}
              {carePlan.physicalActivity.map((item) => (
                <IconTextTile
                  key={item.id}
                  title={item.recommendation}
                  details={item.details}
                  description_line_1={item?.days?.toString()}
                  description_line_2={item?.time?.toString()}
                  description_line_3={formatDateRange(item?.dateRange)}
                  icon={CATEGORY_ICONS.physicalActivity}
                  onDelete={() => onDelete("physicalActivity", item)}
                  // onUpdate={() => updateData("physicalActivity", item)}
                />
              ))}
              {carePlan.others.map((item) => (
                <IconTextTile
                  key={item.id}
                  title={item.recommendation}
                  details={item.details}
                  icon={CATEGORY_ICONS.others}
                  onDelete={() => onDelete("others", item)}
                  onUpdate={() => updateData("others", item)}
                />
              ))}
              {carePlan.suggestedContent.map((item) => (
                <IconTextTile
                  key={item.id}
                  title={item.recommendation}
                  link={item?.link}
                  onDelete={() => onDelete("suggestedContent", item)}
                  onUpdate={() => updateData("suggestedContent", item)}
                />
              ))}
            </>
          ) : null}
        </IconTextTileList>
      )}
    />
  );
};
