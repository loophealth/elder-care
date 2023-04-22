import { Timestamp } from "firebase/firestore";

export enum IRequestStatus {
  Idle,
  Loading,
  Loaded,
  Error,
}

/**
 * An event on this patient's global health timeline.
 */
export interface HealthTimelineEvent {
  approximateTime: string;
  event: string;
}

/**
 * The status of a measurement category (such as bloodwork or urine test). These
 * are used to display indicators on category tiles in the report overview.
 */
export type MeasurementCategoryStatus = "None" | "Ok" | "Warning" | "Danger";

/**
 * A measurement category (such as bloodwork or urine test).
 */
export interface MeasurementCategory {
  name: string;
  status: MeasurementCategoryStatus;
}

/**
 * Safe ranges for a health measurement (such as blood pressure or blood sugar).
 * The upper and lower values are only used for display purposes. The upper and
 * lower danger values indicate the ranges where the measurement is considered
 * to be a danger. The upper and lower warning values indicate the ranges where
 * the measurement is considered to be a warning.
 */
export interface MeasurementRange {
  lower: number;
  lowerDanger: number | null;
  lowerWarning: number | null;
  upperWarning: number | null;
  upperDanger: number | null;
  upper: number;
}

/**
 * A single health measurement (such as blood pressure or blood sugar).
 */
export interface Measurement {
  category: string;
  name: string;
  value: string | number;
  unit: string;
  range: MeasurementRange | null;
}

/**
 * A single entry in the report summary.
 */
export interface SummaryItem {
  title: string;
  details: string;
  relatedMeasurements: string[];
}

/**
 * A health report for a single patient.
 */
export interface HealthReport {
  phoneNumber: string;
  createdOn: Timestamp;
  categories: MeasurementCategory[];
  measurements: Measurement[];
  summary: SummaryItem[];
}

/**
 * A user profile for a single patient or doctor.
 */
export interface UserProfile {
  fullName: string | null;
  age: number | null;
  phoneNumber: string;
  role: "patient" | "doctor";
  healthTimeline: HealthTimelineEvent[];
  riskFactors?: RiskFactor[];
  followUps?: FollowUp[];
  fcmToken?: string;
}

/**
 * A single item in a care plan.
 */
export interface CarePlanItem {
  id: number;
  recommendation: string;
  details?: string;
  reminder?: string;
  link?: string;
}

/**
 * A care plan for a single patient.
 */
export interface CarePlan {
  phoneNumber: string;
  diet: CarePlanItem[];
  physicalActivity: CarePlanItem[];
  medication: CarePlanItem[];
  suggestedContent: CarePlanItem[];
}

export type CarePlanCategory =
  | "diet"
  | "physicalActivity"
  | "medication"
  | "suggestedContent";

export type CarePlanReminder =
  | "morning"
  | "afternoon"
  | "evening"
  | "night";

export type CarePlanFilterCategory =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "suggestedContent";

/**
 * A single risk factor for a patient.
 */
export interface RiskFactor {
  name: string;
  reasons: string;
  description: string;
}

/**
 * A single follow-up for a patient.
 */
export interface FollowUp {
  id: number;
  title: string;
  date: Timestamp;
  description?: string;
}

/**
 * A single Notification for a patient.
 */
export interface PatientNotificationItem {
  id?: number;
  title: string;
  body?: string;
  scheduledTime?: Timestamp | "";
  cancel: boolean;
  sent: boolean;
  time?: string;
  scheduledTimeArray?: Timestamp[];
}

export interface PatientNotification {
  phoneNumber: string;
  notifications: PatientNotificationItem[],
}

export type NotificationCategory =
  | "immediate"
  | "scheduled"
  | "recurring";

