import { DocumentData, DocumentReference } from "firebase/firestore";

import { CarePlan, HealthReport, PatientNotification, UserProfile } from "./types";
import { findHealthReport, findOrCreateCarePlan, findOrCreateNotification, findUserProfile } from "./api";

export class Patient {
  profile: UserProfile;
  profileRef: DocumentReference<DocumentData>;
  report: HealthReport;
  reportRef: DocumentReference<DocumentData>;
  carePlan: CarePlan;
  carePlanRef: DocumentReference<DocumentData>;
  notification: PatientNotification;
  notificationRef: DocumentReference<DocumentData>;

  static async fromPhoneNumber(phoneNumber: string) {
    const profile = await findUserProfile(phoneNumber);
    const report = await findHealthReport(phoneNumber);
    const carePlan = await findOrCreateCarePlan(phoneNumber);
    const notification = await findOrCreateNotification(phoneNumber);
    return new Patient(
      profile.data,
      profile.ref,
      report.data,
      report.ref,
      carePlan.data,
      carePlan.ref,
      notification.data,
      notification.ref
    );
  }

  constructor(
    profile: UserProfile,
    profileRef: DocumentReference<DocumentData>,
    report: HealthReport,
    reportRef: DocumentReference<DocumentData>,
    carePlan: CarePlan,
    carePlanRef: DocumentReference<DocumentData>,
    notification: PatientNotification,
    notificationRef: DocumentReference<DocumentData>
  ) {
    this.profile = profile;
    this.profileRef = profileRef;
    this.report = report;
    this.reportRef = reportRef;
    this.carePlan = carePlan;
    this.carePlanRef = carePlanRef;
    this.notification = notification;
    this.notificationRef = notificationRef;
  }
}
