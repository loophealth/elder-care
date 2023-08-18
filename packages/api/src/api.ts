import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  where,
  updateDoc,
} from "firebase/firestore";
import { customAlphabet } from "nanoid";

import { db } from "./firebaseEntities";
import {
  CarePlan,
  DoctorsProfile,
  HealthReport,
  PatientNotification,
  UserProfile,
} from "./types";
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
  phoneNumber: string,
  userData?: UserProfile
): Promise<ApiResponse<HealthReport>> => {
  let q;
  if (userData?.relation) {
    q = query(
      collection(db, "healthReports"),
      where("phoneNumber", "==", phoneNumber),
      where("relation", "==", userData.relation)
    );
  } else {
    q = query(
      collection(db, "healthReports"),
      where("phoneNumber", "==", phoneNumber)
    );
  }
  const snapshot = await getDocs(q);
  // const reports = snapshot.docs
  //   .map((doc, index) => ({ data: doc.data() as HealthReport, index }))
  //   .sort(
  //     (a: any, b: any) => b.data.createdOn.toDate() - a.data.createdOn.toDate()
  //   );

  const filteredReports = filteredDoc(snapshot, userData?.relation);
  const sortedReport = filteredReports.sort(
    (a: any, b: any) => b.data.createdOn.toDate() - a.data.createdOn.toDate()
  );

  let selectedIndex = sortedReport[0]?.index;

  if (sortedReport.length === 0) {
    throw new ApiError(
      "No report found with that phone number",
      ApiErrorCode.NotFound
    );
  }
  return { ref: snapshot.docs[selectedIndex].ref, data: sortedReport[0].data };
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

  const profile = await findOrCreateUserProfile(
    userProfile.phoneNumber,
    userProfile.fullName,
    userProfile.age,
    userProfile.relation,
    userProfile.plan
  );

  const newHealthReport = await UpdateOrCreateHealthReport(
    healthReport,
    profile.data
  );
  return newHealthReport;
};

/**
 * Creates a new health report.
 */
export const UpdateOrCreateHealthReport = async (
  healthReport: HealthReport,
  userData?: UserProfile
): Promise<ApiResponse<HealthReport>> => {
  const healthReportsRef = collection(db, "healthReports");

  //Added query to check if report already exsist for given phoneNumber & date
  let q;
  if (userData?.relation) {
    q = query(
      collection(db, "healthReports"),
      where("phoneNumber", "==", healthReport.phoneNumber),
      where("createdOn", "==", healthReport.createdOn),
      where("relation", "==", userData.relation)
    );
  } else {
    q = query(
      collection(db, "healthReports"),
      where("phoneNumber", "==", healthReport.phoneNumber),
      where("createdOn", "==", healthReport.createdOn)
    );
  }
  const snapshot = await getDocs(q);
  // const reports = snapshot.docs.map((doc) => doc.data() as HealthReport);
  const filteredReports = filteredDoc(snapshot, userData?.relation);

  let updatedHealthReport = { ...healthReport };

  if (userData?.relation) {
    updatedHealthReport = {
      ...updatedHealthReport,
      relation: userData?.relation,
      userId: userData?.id,
      parentId: healthReport.phoneNumber, // TODO: Need to replace with parent userid in future
    };
  }

  if (filteredReports.length !== 0) {
    const selectedIndex = filteredReports?.[0].index;
    await updateDoc(snapshot.docs[selectedIndex].ref, {
      ...updatedHealthReport,
    });
    return {
      ref: snapshot.docs[selectedIndex].ref,
      data: {
        ...updatedHealthReport,
      } as HealthReport,
    };
  } else {
    const newReportRef = await addDoc(healthReportsRef, {
      ...updatedHealthReport,
    });
    const newReport = await getDoc(newReportRef);
    return { ref: newReportRef, data: newReport.data() as HealthReport };
  }
};

/**
 * Finds a user profile using the patient's phone number.
 */
export const findUserProfile = async (
  phoneNumber: string,
  relation?: string | null
): Promise<ApiResponse<UserProfile>> => {
  let q;
  if (relation) {
    q = query(
      collection(db, "userProfiles"),
      where("phoneNumber", "==", phoneNumber),
      where("relation", "==", relation)
    );
  } else {
    q = query(
      collection(db, "userProfiles"),
      where("phoneNumber", "==", phoneNumber)
    );
  }
  const snapshot = await getDocs(q);
  // const profiles = snapshot.docs.map((doc) => doc.data() as UserProfile);
  const filteredProfile = filteredDoc(snapshot, relation);

  if (filteredProfile.length === 0) {
    throw new ApiError(
      "No profile found with that phone number",
      ApiErrorCode.NotFound
    );
  } else if (filteredProfile.length > 1) {
    throw new ApiError(
      "Multiple profiles found with that phone number, please contact support",
      ApiErrorCode.MultipleFound
    );
  }
  const profiles = filteredProfile?.[0].data;
  const selectedIndex = filteredProfile?.[0].index;

  return { ref: snapshot.docs[selectedIndex].ref, data: profiles };
};

/**
 * Finds a linked user profile using the patient's phone number.
 */
export const findLinkedUserProfile = async (
  phoneNumber: string
): Promise<{ data: UserProfile[] }> => {
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
  }
  if (profiles.length > 1) {
    const parentProfileIndex = profiles.findIndex((data) => !data.relation);
    const tempProfile = profiles[0];
    profiles[0] = profiles[parentProfileIndex];
    profiles[parentProfileIndex] = tempProfile;
  }

  return { data: profiles };
};

/**
 * Creates a new user profile.
 */
export const createUserProfile = async (
  phoneNumber: string,
  fullName: string | null = null,
  age: number | null = null,
  relation: string | null = null,
  plan: string | null = null
): Promise<ApiResponse<UserProfile>> => {
  let userProfile: UserProfile = {
    fullName,
    age,
    phoneNumber,
    role: "patient",
    healthTimeline: [],
    doctorId: "",
    physioId: "",
    coachId: "",
  };

  if (plan) {
    userProfile = {
      ...userProfile,
      plan,
    };
  }

  if (relation) {
    userProfile = {
      ...userProfile,
      relation,
      parentId: phoneNumber, // TODO: Need to replace with parent userid in future
      id: createLoopId("LRU"),
    };
  }

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
  age: number | null = null,
  relation: string | null = null,
  plan: string | null = null
): Promise<ApiResponse<UserProfile>> => {
  try {
    const profile = await findUserProfile(phoneNumber, relation);
    return profile;
  } catch (error: any) {
    if (isApiError(error) && error.apiErrorCode === ApiErrorCode.NotFound) {
      const profile = await createUserProfile(
        phoneNumber,
        fullName,
        age,
        relation,
        plan
      );
      return profile;
    }

    throw error;
  }
};

/**
 * Finds a care plan using the patient's phone number.
 */
export const findCarePlan = async (
  phoneNumber: string,
  relation?: string | null
): Promise<ApiResponse<CarePlan>> => {
  let q;
  if (relation) {
    q = query(
      collection(db, "carePlans"),
      where("phoneNumber", "==", phoneNumber),
      where("relation", "==", relation)
    );
  } else {
    q = query(
      collection(db, "carePlans"),
      where("phoneNumber", "==", phoneNumber)
    );
  }
  const snapshot = await getDocs(q);
  // const carePlans = snapshot.docs.map((doc) => doc.data() as CarePlan);
  const filteredCarePlans = filteredDoc(snapshot, relation);

  if (filteredCarePlans.length === 0) {
    throw new ApiError(
      "No care plan found associated with that phone number",
      ApiErrorCode.NotFound
    );
  } else if (filteredCarePlans.length > 1) {
    throw new ApiError(
      "Multiple care plans found with that phone number, please contact support",
      ApiErrorCode.MultipleFound
    );
  }
  const carePlans = filteredCarePlans?.[0]?.data;
  const selectedIndex = filteredCarePlans?.[0]?.index;

  return { ref: snapshot.docs[selectedIndex].ref, data: carePlans };
};

/**
 * Creates a new care plan.
 */
export const createCarePlan = async (
  carePlan: CarePlan,
  userData?: UserProfile
): Promise<ApiResponse<CarePlan>> => {
  if (userData?.relation) {
    carePlan = {
      ...carePlan,
      relation: userData?.relation,
      userId: userData?.id,
      parentId: userData?.phoneNumber, // TODO: Need to replace with parent userid in future
    };
  }
  const carePlansRef = collection(db, "carePlans");
  const newCarePlan = await addDoc(carePlansRef, carePlan);

  return { ref: newCarePlan, data: carePlan };
};

/**
 * Finds a care plan using the patient's phone number. If no care plan is found,
 * creates a new care plan with the given phone number.
 */
export const findOrCreateCarePlan = async (
  phoneNumber: string,
  userData?: UserProfile
): Promise<ApiResponse<CarePlan>> => {
  try {
    const carePlan = await findCarePlan(phoneNumber, userData?.relation);
    return carePlan;
  } catch (error: any) {
    if (isApiError(error) && error.apiErrorCode === ApiErrorCode.NotFound) {
      const carePlan = await createCarePlan(
        {
          phoneNumber,
          diet: [],
          physicalActivity: [],
          medication: [],
          suggestedContent: [],
          others: [],
          prescription: [],
          physioPrescription: [],
          tasks: [],
          summary: [],
        },
        userData
      );
      return carePlan;
    }

    throw error;
  }
};

/**
 * Update user with registered fcm token.
 */
export const updateUserToken = async (
  phoneNumber: string,
  token: string
): Promise<void> => {
  if (!phoneNumber) return;
  try {
    const { ref, data } = await findUserProfile(phoneNumber);
    //Avoiding un-necessary update
    if (data?.fcmToken && data?.fcmToken === token) return;
    await updateDoc(ref, {
      fcmToken: token,
      updatedAt: new Date(),
    });
  } catch (error: any) {
    throw error;
  }
};

/**
 * Finds a notification using the patient's phone number.
 */
export const findNotification = async (
  phoneNumber: string,
  relation?: string | null
): Promise<ApiResponse<PatientNotification>> => {
  let q;
  if (relation) {
    q = query(
      collection(db, "notification"),
      where("phoneNumber", "==", phoneNumber),
      where("relation", "==", relation)
    );
  } else {
    q = query(
      collection(db, "notification"),
      where("phoneNumber", "==", phoneNumber)
    );
  }
  const snapshot = await getDocs(q);
  // const notifications = snapshot.docs.map(
  //   (doc) => doc.data() as PatientNotification
  // );
  const filteredNotifications = filteredDoc(snapshot, relation);

  if (filteredNotifications.length === 0) {
    throw new ApiError(
      "No notification found associated with that phone number",
      ApiErrorCode.NotFound
    );
  } else if (filteredNotifications.length > 1) {
    throw new ApiError(
      "Multiple notifications found with that phone number, please contact support",
      ApiErrorCode.MultipleFound
    );
  }

  const notifications = filteredNotifications?.[0]?.data;
  const selectedIndex = filteredNotifications?.[0]?.index;

  return { ref: snapshot.docs[selectedIndex].ref, data: notifications };
};

/**
 * Creates a new notification.
 */
export const createNotification = async (
  notification: PatientNotification,
  userData?: UserProfile
): Promise<ApiResponse<PatientNotification>> => {
  if (userData?.relation) {
    notification = {
      ...notification,
      relation: userData?.relation,
      userId: userData?.id,
      parentId: userData?.phoneNumber, // TODO: Need to replace with parent userid in future
    };
  }
  const notificationsRef = collection(db, "notification");
  const newNotification = await addDoc(notificationsRef, notification);

  return { ref: newNotification, data: notification };
};

/**
 * Finds a notification using the patient's phone number. If no notification is found,
 * creates a new notification with the given phone number.
 */
export const findOrCreateNotification = async (
  phoneNumber: string,
  userData?: UserProfile
): Promise<ApiResponse<PatientNotification>> => {
  try {
    const notification = await findNotification(
      phoneNumber,
      userData?.relation
    );
    return notification;
  } catch (error: any) {
    if (isApiError(error) && error.apiErrorCode === ApiErrorCode.NotFound) {
      const notification = await createNotification(
        {
          phoneNumber,
          notifications: [],
        },
        userData
      );
      return notification;
    }

    throw error;
  }
};

export const createLoopId = (prefix: string): string => {
  if (!prefix) {
    throw new Error("Invalid Prefix Argument");
  }
  const nanoId6 = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6);
  const documentId = `${prefix}-` + nanoId6().toLocaleUpperCase();
  return documentId;
};

const filteredDoc = (
  snapshot: QuerySnapshot<DocumentData>,
  relation?: string | null
) => {
  const filteredData = snapshot.docs
    .map((doc: DocumentData, index: number) => {
      const docData = doc.data();
      if (!relation) {
        return !docData.parentId ? { data: docData, index } : null;
      }
      return { data: docData, index };
    })
    .filter((data: any) => data) as { data: any; index: number }[];
  return filteredData;
};

export const getDoctors = async (id?: string) => {
  let q;
  if (id) {
    q = query(collection(db, "doctorsProfile"), where("id", "==", id));
  } else {
    q = query(collection(db, "doctorsProfile"));
  }
  const snapshot = await getDocs(q);
  const profiles = snapshot.docs.map((doc) => doc.data() as DoctorsProfile);
  return profiles;
};
