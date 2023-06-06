import { CarePlanSummary, usePatient } from "@loophealth/api";
import { groupBy } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { getWeekDatesFromDate } from "utils";
import { onSnapshot } from "firebase/firestore";
import "./WeeklySummary.css";
import { add, sub, format, differenceInCalendarDays } from "date-fns";

export const WeeklySummary = () => {
  const { patient } = usePatient();
  const [weeklySummary, setWeeklySummary] = useState<CarePlanSummary[] | []>(
    []
  );
  const [summaryDate, setSummaryDate] = useState("");
  const [filteredData, setFilteredData] = useState<any>([]);
  const [dateRange, setDateRange] = useState<any>();

  // Subscribe to care plan updates.
  useEffect(() => {
    if (!patient) {
      return;
    }

    const unsub = onSnapshot(patient.carePlanRef, (snapshot) => {
      const summary = (snapshot.data()?.summary ?? []) as CarePlanSummary[];
      summary.sort(
        (a, b) =>
          a?.createdOn.toDate().valueOf() - b?.createdOn.toDate().valueOf()
      );
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

  const getSummaryFromDate = useCallback(
    (date: string) => {
      const { firstDate, lastDate } = getWeekDatesFromDate(new Date(date));
      setDateRange({ from: firstDate, to: lastDate });
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

  const disablePrevWeek = () =>
    differenceInCalendarDays(
      new Date(summaryDate),
      weeklySummary[0]?.createdOn.toDate()
    ) < 0;

  const disableNextWeek = () =>
    summaryDate === format(new Date(), "yyyy-MM-dd");

  if (weeklySummary && weeklySummary.length > 0) {
    return (
      <main className="WeeklySummary">
        <div className="Summary__Week__Controller">
          <div
            onClick={() => {
              if (disablePrevWeek()) {
                return;
              }
              const prevWeekDate = sub(new Date(summaryDate), { days: 7 });
              setSummaryDate(format(prevWeekDate, "yyyy-MM-dd"));
              setFilteredData(
                getSummaryFromDate(format(prevWeekDate, "yyyy-MM-dd"))
              );
            }}
            className={
              disablePrevWeek()
                ? "WeeklySummaryButton disabledButton"
                : "WeeklySummaryButton"
            }
          >
            {"<"}
          </div>
          <div className="WeeklySummaryDateLabel">{`${format(
            dateRange?.from,
            "dd MMM"
          )}  to  ${format(dateRange?.to, "dd MMM")}`}</div>
          <div
            onClick={() => {
              if (disableNextWeek()) {
                return;
              }
              const nextWeekDate = add(new Date(summaryDate), { days: 7 });
              setSummaryDate(format(nextWeekDate, "yyyy-MM-dd"));
              setFilteredData(
                getSummaryFromDate(format(nextWeekDate, "yyyy-MM-dd"))
              );
            }}
            className={
              disableNextWeek()
                ? "WeeklySummaryButton disabledButton"
                : "WeeklySummaryButton"
            }
          >
            {">"}
          </div>
        </div>
        <div className="Summary__Container">
          {filteredData["MA Summary"]?.length > 0 ? (
            <div className="Summary__Content__Container">
              <label className="Utils__Label Summary__Heading">
                MA Summary
              </label>

              {filteredData["MA Summary"]?.map(
                (item: CarePlanSummary, index: number) => {
                  return (
                    <div key={index.toString()} className="Summary__Detail">
                      {item?.details}
                    </div>
                  );
                }
              )}
            </div>
          ) : null}
          {filteredData["Advice"]?.length > 0 ? (
            <div className="Summary__Content__Container">
              <label className="Utils__Label Summary__Heading">Advice</label>

              {filteredData["Advice"]?.map(
                (item: CarePlanSummary, index: number) => {
                  return (
                    <div
                      className="Summary__Week__Advice__Content__Container"
                      key={index.toString()}
                    >
                      <div className="Summary__Title">{item?.title}</div>
                      <div className="Summary__Detail">{item?.details}</div>
                    </div>
                  );
                }
              )}
            </div>
          ) : null}
        </div>
      </main>
    );
  } else {
    return null;
  }
};