import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebaseEntities";
import { CarePlan, HealthReport, UserProfile } from "./types";
import {
  ExcelHealthReport,
  toHealthReport,
  toUserProfile,
} from "./ExcelHealthReport";

/**
 * A numerical code represeting an error type in our API calls.
 */
export enum ApiErrorCode {
  GenericApiError,
  NotFound,
  MultipleFound,
}

/**
 * An error that can be returned from an API call. This type is used for logical
 * or data shape errors in our Firebase store, and not for cases such as network
 * or authentication errors. Those basic errors are already covered by the types
 * included with Firebase.
 */
export class ApiError extends Error {
  apiErrorCode: ApiErrorCode;

  constructor(message: string, apiErrorCode?: ApiErrorCode) {
    super(message);
    this.name = "ApiError";
    this.apiErrorCode = apiErrorCode || ApiErrorCode.GenericApiError;
  }
}

/**
 * Returns true if the error is an ApiError.
 */
export const isApiError = (error: any): boolean => error instanceof ApiError;

/**
 * A generic type that is used for any API call that returns a single document
 * from Firebase. The `ref` property is the reference to the document in
 * Firebase, and the `data` property is the data from the document.
 */
export interface ApiResponse<T> {
  ref: DocumentReference<DocumentData>;
  data: T;
}

/**
 * Finds a health report using the patient's phone number.
 */
export const findHealthReport = async (
  phoneNumber: string
): Promise<ApiResponse<HealthReport>> => {
  const q = query(
    collection(db, "healthReports"),
    where("phoneNumber", "==", phoneNumber)
  );
  const snapshot = await getDocs(q);
  const reports = snapshot.docs.map((doc) => doc.data() as HealthReport);

  if (reports.length === 0) {
    throw new ApiError(
      "No report found with that phone number",
      ApiErrorCode.NotFound
    );
  } else if (reports.length > 1) {
    throw new ApiError(
      "Multiple reports found with that phone number, please contact support",
      ApiErrorCode.MultipleFound
    );
  }

  return { ref: snapshot.docs[0].ref, data: reports[0] };
};

/**
 * Stores a health report parsed from an Excel sheet in Firebase. Creates a new
 * user profile for the patient if one does not exist.
 */
export const createHealthReportAndUserProfile = async (
  excelHealthReport: ExcelHealthReport
): Promise<ApiResponse<HealthReport>> => {
  const healthReport = toHealthReport(excelHealthReport);
  const userProfile = toUserProfile(excelHealthReport);

  await findOrCreateUserProfile(
    userProfile.phoneNumber,
    userProfile.fullName,
    userProfile.age
  );

  const newHealthReport = await createHealthReport(healthReport);
  return newHealthReport;
};

/**
 * Creates a new health report.
 */
export const createHealthReport = async (
  healthReport: HealthReport
): Promise<ApiResponse<HealthReport>> => {
  const healthReportsRef = collection(db, "healthReports");
  const newReportRef = await addDoc(healthReportsRef, healthReport);
  const newReport = await getDoc(newReportRef);
  return { ref: newReportRef, data: newReport.data() as HealthReport };
};

/**
 * Finds a user profile using the patient's phone number.
 */
export const findUserProfile = async (
  phoneNumber: string
): Promise<ApiResponse<UserProfile>> => {
  const q = query(
    collection(db, "userProfiles"),
    where("phoneNumber", "==", phoneNumber)
  );
  const snapshot = await getDocs(q);
  const profiles = snapshot.docs.map((doc) => doc.data() as UserProfile);

  if (profiles.length === 0) {
    throw new ApiError(
      "No profile found with that phone number",
      ApiErrorCode.NotFound
    );
  } else if (profiles.length > 1) {
    throw new ApiError(
      "Multiple profiles found with that phone number, please contact support",
      ApiErrorCode.MultipleFound
    );
  }

  return { ref: snapshot.docs[0].ref, data: profiles[0] };
};

/**
 * Creates a new user profile.
 */
export const createUserProfile = async (
  phoneNumber: string,
  fullName: string | null = null,
  age: number | null = null
): Promise<ApiResponse<UserProfile>> => {
  const userProfile: UserProfile = {
    fullName,
    age,
    phoneNumber,
    role: "patient",
    healthTimeline: [],
  };

  const userProfilesRef = collection(db, "userProfiles");
  const newProfile = await addDoc(userProfilesRef, userProfile);

  return { ref: newProfile, data: userProfile };
};

/**
 * Finds a user profile using the patient's phone number. If no profile is found,
 * creates a new profile with the given phone number.
 */
export const findOrCreateUserProfile = async (
  phoneNumber: string,
  fullName: string | null = null,
  age: number | null = null
): Promise<ApiResponse<UserProfile>> => {
  try {
    const profile = await findUserProfile(phoneNumber);
    return profile;
  } catch (error: any) {
    if (isApiError(error) && error.apiErrorCode === ApiErrorCode.NotFound) {
      const profile = await createUserProfile(phoneNumber, fullName, age);
      return profile;
    }

    throw error;
  }
};

/**
 * Finds a care plan using the patient's phone number.
 */
export const findCarePlan = async (
  phoneNumber: string
): Promise<ApiResponse<CarePlan>> => {
  const q = query(
    collection(db, "carePlans"),
    where("phoneNumber", "==", phoneNumber)
  );
  const snapshot = await getDocs(q);
  const carePlans = snapshot.docs.map((doc) => doc.data() as CarePlan);

  if (carePlans.length === 0) {
    throw new ApiError(
      "No care plan found associated with that phone number",
      ApiErrorCode.NotFound
    );
  } else if (carePlans.length > 1) {
    throw new ApiError(
      "Multiple care plans found with that phone number, please contact support",
      ApiErrorCode.MultipleFound
    );
  }

  return { ref: snapshot.docs[0].ref, data: carePlans[0] };
};

/**
 * Creates a new care plan.
 */
export const createCarePlan = async (
  carePlan: CarePlan
): Promise<ApiResponse<CarePlan>> => {
  const carePlansRef = collection(db, "carePlans");
  const newCarePlan = await addDoc(carePlansRef, carePlan);

  return { ref: newCarePlan, data: carePlan };
};

/**
 * Finds a care plan using the patient's phone number. If no care plan is found,
 * creates a new care plan with the given phone number.
 */
export const findOrCreateCarePlan = async (
  phoneNumber: string
): Promise<ApiResponse<CarePlan>> => {
  try {
    const carePlan = await findCarePlan(phoneNumber);
    return carePlan;
  } catch (error: any) {
    if (isApiError(error) && error.apiErrorCode === ApiErrorCode.NotFound) {
      const carePlan = await createCarePlan({
        phoneNumber,
        diet: [],
        physicalActivity: [],
        medication: [],
        others: [],
      });
      return carePlan;
    }

    throw error;
  }
};
