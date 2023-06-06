import { FormEvent, useCallback, useEffect, useState } from "react";
import { Timestamp, onSnapshot, updateDoc } from "firebase/firestore";

import {
  CarePlanSummary,
  CarePlanSummaryCategory,
  usePatient,
} from "@loophealth/api";

import {
  Button,
  Input,
  AdminEditorLayout,
  TextArea,
  IconTextTile,
  IconTextTileList,
  Select,
} from "components";

import "./EditWeeklySummaryRoute.css";
import { generateId, getWeekDatesFromDate } from "utils";
import { groupBy } from "lodash";
import { format, add } from "date-fns";

export const EditWeeklySummaryRoute = () => {
  const { patient } = usePatient();

  const [weeklySummary, setWeeklySummary] = useState<CarePlanSummary[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [summaryName, setSummaryName] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [summaryDate, setSummaryDate] = useState("");
  const [filteredData, setFilteredData] = useState<any>([]);

  const [selectedData, setSelectedData] = useState<
    CarePlanSummary | undefined | null
  >();
  // Subscribe to Summary updates.
  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.carePlanRef, (snapshot) => {
      const summary = (snapshot.data()?.summary ?? []) as CarePlanSummary[];
      setWeeklySummary(summary);
    });

    return () => {
      unsub();
    };
  }, [patient]);

  useEffect(() => {
    if (!summaryDate) {
      setSummaryDate(format(new Date(), "yyyy-MM-dd"));
    }
    setFilteredData(
      getSummaryFromDate(summaryDate || format(new Date(), "yyyy-MM-dd"))
    );
    // eslint-disable-next-line
  }, [weeklySummary]);

  // Add new Summary.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!patient) {
      return;
    }
    if (selectedData) {
      onUpdate();
    } else {
      setIsLoading(true);
      const id = generateId();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const currentWeekSummary = getSummaryFromDate(
        format(new Date(), "yyyy-MM-dd")
      );
      if (
        currentWeekSummary["MA Summary"]?.length > 0 &&
        category === "MA Summary"
      ) {
        let result = window.confirm(
          "Summary already exists for current week. Do you want to replace?"
        );
        if (result === false) {
          setIsLoading(false);
          return;
        }
      }
      try {
        const newSummary: CarePlanSummary = {
          category: category as CarePlanSummaryCategory,
          title: summaryName,
          details,
          id,
          createdOn: Timestamp.fromDate(today),
        };

        let newSummarys = [...weeklySummary, newSummary];
        if (category === "MA Summary") {
          newSummarys = newSummarys.filter(
            (data) => data.id !== currentWeekSummary["MA Summary"]?.[0]?.id
          );
        }
        await updateDoc(patient.carePlanRef, { summary: newSummarys });
        onReset();
      } catch (e) {
        alert(
          "There was an error adding the summary. Please check your network and try again. If the error persists, please contact support."
        );
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Delete Summary.
  const onDelete = async (item: CarePlanSummary) => {
    if (!patient) {
      return;
    }

    setIsLoading(true);
    try {
      const newSummarys = [...weeklySummary];
      const selectedIndex = newSummarys.findIndex(
        (data) => data.id === item.id
      );
      newSummarys.splice(selectedIndex, 1);
      await updateDoc(patient.carePlanRef, { summary: newSummarys });
    } catch (e) {
      alert(
        "There was an error deleting this summary. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form.
  const onReset = () => {
    setSummaryName("");
    setDetails("");
    setCategory("");
    setSelectedData(null);
  };

  //update data on edit
  const updateData = (item: CarePlanSummary, index: number) => {
    onReset();
    setSelectedData(item);
    if (item?.category) {
      setCategory(item.category);
    }
    if (item?.title) {
      setSummaryName(item.title);
    }
    if (item?.details) {
      setDetails(item.details);
    }
  };

  // Update item.
  const onUpdate = async () => {
    if (!patient || !selectedData) {
      return;
    }

    setIsLoading(true);

    try {
      const newSummarys = [...weeklySummary];
      const selectedIndex = newSummarys.findIndex(
        (data) => data.id === selectedData.id
      );
      newSummarys[selectedIndex || 0] = {
        category: category as CarePlanSummaryCategory,
        title: summaryName,
        details,
        id: selectedData?.id,
        createdOn: selectedData?.createdOn,
      };

      await updateDoc(patient.carePlanRef, {
        summary: newSummarys,
      });
      onReset();
    } catch (e) {
      alert(
        "There was an error updating this summary. Please check your network and try again. If the error persists, please contact support."
      );
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getSummaryFromDate = useCallback(
    (date: string) => {
      const { firstDate, lastDate } = getWeekDatesFromDate(new Date(date));
      const filteredSummary = weeklySummary.filter((data) => {
        return (
          data.createdOn.toDate() >= firstDate &&
          data.createdOn.toDate() < add(lastDate, { days: 1 })
        );
      });
      return groupBy(filteredSummary, "category");
    },
    [weeklySummary]
  );

  return (
    <AdminEditorLayout
      title="Summary"
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
              onChange={(e) =>
                setCategory(e.target.value as CarePlanSummaryCategory)
              }
              required
              disabled={isLoading}
            >
              <option value="">Select a category</option>
              <option value="MA Summary">MA Summary</option>
              <option value="Advice">Advice</option>
            </Select>
          </div>
          {category === "Advice" ? (
            <div className="Utils__VerticalForm__Group">
              <label className="Utils__Label" htmlFor="summaryName">
                Heading
              </label>
              <Input
                id="summaryName"
                type="text"
                value={summaryName}
                onChange={(e) => setSummaryName(e.target.value)}
                placeholder="Enter Heading"
                disabled={isLoading}
              />
            </div>
          ) : null}

          <div className="Utils__VerticalForm__Group">
            <label className="Utils__Label" htmlFor="details">
              Summary
            </label>
            <TextArea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add text here"
              required
              disabled={isLoading}
            />
          </div>

          <div className="Utils__VerticalForm__ButtonsContainer">
            <Button type="submit" isPrimary disabled={isLoading}>
              {selectedData ? "Done" : "Add Summary"}
            </Button>
            {selectedData ? (
              <Button onClick={onReset} isPrimary={false} disabled={isLoading}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      )}
      renderRight={() => {
        return filteredData ? (
          <>
            <div className="Utils__VerticalForm__Group WeeklySummaryDate">
              <label className="Utils__Label" htmlFor="summaryDate">
                Select Date:
              </label>
              <Input
                id="summaryDate"
                type="date"
                placeholder="Select Date"
                value={summaryDate}
                onChange={(event) => {
                  setSummaryDate(event.target.value);
                  setFilteredData(getSummaryFromDate(event.target.value));
                }}
                disabled={isLoading}
              />
            </div>
            <IconTextTileList>
              <label className="Utils__Label">Summary</label>
              {filteredData["MA Summary"]?.map(
                (summary: CarePlanSummary, index: number) => (
                  <IconTextTile
                    key={summary.id}
                    title={summary.title}
                    details={summary.details}
                    onDelete={() => onDelete(summary)}
                    onUpdate={() => updateData(summary, index)}
                    isLoading={isLoading}
                  />
                )
              )}
              <label className="Utils__Label">Advice</label>
              {filteredData["Advice"]?.map(
                (summary: CarePlanSummary, index: number) => (
                  <IconTextTile
                    key={summary.id}
                    title={summary.title}
                    details={summary.details}
                    onDelete={() => onDelete(summary)}
                    onUpdate={() => updateData(summary, index)}
                    isLoading={isLoading}
                  />
                )
              )}
            </IconTextTileList>
          </>
        ) : null;
      }}
    />
  );
};
