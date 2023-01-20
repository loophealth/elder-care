import { DocumentData, DocumentReference } from "firebase/firestore";

import { CarePlan, HealthReport, UserProfile } from "lib/commonTypes";
import {
  findHealthReport,
  findOrCreateCarePlan,
  findUserProfile,
} from "lib/api";

export class Patient {
  profile: UserProfile;
  profileRef: DocumentReference<DocumentData>;
  report: HealthReport;
  reportRef: DocumentReference<DocumentData>;
  carePlan: CarePlan;
  carePlanRef: DocumentReference<DocumentData>;

  static async fromPhoneNumber(phoneNumber: string) {
    const profile = await findUserProfile(phoneNumber);
    const report = await findHealthReport(phoneNumber);
    const carePlan = await findOrCreateCarePlan(phoneNumber);
    return new Patient(
      profile.data,
      profile.ref,
      report.data,
      report.ref,
      carePlan.data,
      carePlan.ref
    );
  }

  constructor(
    profile: UserProfile,
    profileRef: DocumentReference<DocumentData>,
    report: HealthReport,
    reportRef: DocumentReference<DocumentData>,
    carePlan: CarePlan,
    carePlanRef: DocumentReference<DocumentData>
  ) {
    this.profile = profile;
    this.profileRef = profileRef;
    this.report = report;
    this.reportRef = reportRef;
    this.carePlan = carePlan;
    this.carePlanRef = carePlanRef;
  }
}
