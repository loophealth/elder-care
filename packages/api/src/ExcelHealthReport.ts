import { Timestamp } from "firebase/firestore";
import { isNull } from "lodash";
import { read } from "xlsx";
import { z } from "zod";

import { HealthReport, UserProfile } from "./types";

export const parseExcelHealthReport = async (
  file: File
): Promise<ExcelHealthReport> => {
  const ab = await file.arrayBuffer();
  const wb = read(ab, { cellDates: true });

  // Grab sheets.
  const basicInformationWorksheet = wb.Sheets["Basic Information"];
  const reportOverviewWorksheet = wb.Sheets["Report Overview"];
  const detailedReportWorksheet = wb.Sheets["Detailed Report"];
  const reportSummaryWorksheet = wb.Sheets["Report Summary"];

  // Check that all the sheets are present.
  if (
    !basicInformationWorksheet ||
    !reportOverviewWorksheet ||
    !detailedReportWorksheet ||
    !reportSummaryWorksheet
  ) {
    throw new ExcelHealthReportParseError(
      "Invalid report format, some of the required sheets are missing from the Excel file"
    );
  }

  // Parse basic information.
  const createdOn = basicInformationWorksheet["B1"]?.v || new Date();
  const fullName = basicInformationWorksheet["B2"].v;
  const age = basicInformationWorksheet["B3"].v;
  const relation = basicInformationWorksheet["B5"]?.v || "";
  const plan = basicInformationWorksheet["B6"]?.v || "";

  let phoneNumber = String(basicInformationWorksheet["B4"].v);
  if (!phoneNumber.startsWith("+91")) {
    phoneNumber = `+91${phoneNumber}`;
  }

  // Parse statuses for measurement categories.
  const categories = [];
  for (let i = 2; ; i++) {
    const categoryName = reportOverviewWorksheet[`A${i}`]?.v;
    const status = reportOverviewWorksheet[`B${i}`]?.v;
    if (!categoryName || !status) {
      break;
    }
    categories.push({ name: categoryName, status });
  }

  // Parse measurements.
  const measurements = [];
  for (let i = 2; ; i++) {
    const name = detailedReportWorksheet[`A${i}`]?.v;
    const value = detailedReportWorksheet[`B${i}`]?.v;
    const unit = detailedReportWorksheet[`C${i}`]?.v ?? "";
    const category = detailedReportWorksheet[`D${i}`]?.v;

    if (!category || !name) {
      break;
    }

    if(!value){
      continue;
    }

    const lowerRange = detailedReportWorksheet[`E${i}`]?.v ?? null;
    const upperRange = detailedReportWorksheet[`J${i}`]?.v ?? null;
    let range = null;

    // If both the upper and lower range is present, then we have a range
    // override in the report. Otherwise, we use the default ranges defined in
    // the domain constants.
    if (!isNull(lowerRange) && !isNull(upperRange)) {
      range = {
        lower: lowerRange,
        lowerDanger: detailedReportWorksheet[`F${i}`]?.v ?? null,
        lowerWarning: detailedReportWorksheet[`G${i}`]?.v ?? null,
        upperWarning: detailedReportWorksheet[`H${i}`]?.v ?? null,
        upperDanger: detailedReportWorksheet[`I${i}`]?.v ?? null,
        upper: upperRange,
      };
    }

    measurements.push({ category, name, value, unit, range });
  }

  // Parse report summary.
  const summary = [];
  for (let i = 2; ; i++) {
    const title = reportSummaryWorksheet[`A${i}`]?.v;
    const details = reportSummaryWorksheet[`B${i}`]?.v;
    if (!title || !details) {
      break;
    }

    const relatedMeasurements = [];
    let startingCell = `C${i}`;
    while (true) {
      const measurement = reportSummaryWorksheet[startingCell]?.v;
      if (!measurement) {
        break;
      }
      relatedMeasurements.push(measurement);
      startingCell = incrementCellColumn(startingCell);
    }

    summary.push({ title, details, relatedMeasurements });
  }

  const report = {
    createdOn,
    fullName,
    age,
    phoneNumber,
    relation: relation !== "Self" ? relation : "",
    plan,
    categories,
    measurements,
    summary,
  };

  return ExcelHealthReportSchema.parse(report);
};

const incrementCellColumn = (cell: string) => {
  const column = cell[0];
  const row = cell.slice(1);
  const nextColumn = String.fromCharCode(column.charCodeAt(0) + 1);
  return nextColumn + row;
};

const ExcelHealthReportSchema = z.object({
  createdOn: z.date(),
  fullName: z.string(),
  age: z.number(),
  phoneNumber: z.string().length(13),
  relation: z.string(),
  plan: z.string(),
  categories: z.array(
    z.object({
      name: z.string(),
      status: z.union([
        z.literal("None"),
        z.literal("Ok"),
        z.literal("Warning"),
        z.literal("Danger"),
      ]),
    })
  ),
  measurements: z.array(
    z.object({
      category: z.string(),
      name: z.string(),
      value: z.union([z.number(), z.string()]),
      unit: z.string(),
      range: z.union([
        z.null(),
        z.object({
          lower: z.number(),
          lowerDanger: z.union([z.number(), z.null()]),
          lowerWarning: z.union([z.number(), z.null()]),
          upperWarning: z.union([z.number(), z.null()]),
          upperDanger: z.union([z.number(), z.null()]),
          upper: z.number(),
        }),
      ]),
    })
  ),
  summary: z.array(
    z.object({
      title: z.string(),
      details: z.string(),
      relatedMeasurements: z.array(z.string()),
    })
  ),
});

export type ExcelHealthReport = z.infer<typeof ExcelHealthReportSchema>;

export class ExcelHealthReportParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExcelHealthReportError";
  }
}

export const toHealthReport = (
  excelReport: ExcelHealthReport
): HealthReport => {
  return {
    phoneNumber: excelReport.phoneNumber,
    createdOn: Timestamp.fromDate(excelReport.createdOn),
    categories: excelReport.categories,
    measurements: excelReport.measurements,
    summary: excelReport.summary,
    relation: excelReport?.relation,
  };
};

export const toUserProfile = (excelReport: ExcelHealthReport): UserProfile => {
  return {
    fullName: excelReport.fullName,
    age: excelReport.age,
    phoneNumber: excelReport.phoneNumber,
    role: "patient",
    healthTimeline: [],
    relation: excelReport?.relation,
    plan: excelReport?.plan,
  };
};
