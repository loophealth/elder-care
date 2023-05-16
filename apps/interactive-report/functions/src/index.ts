const functions = require("firebase-functions");
const { firestore } = require("firebase-admin");
const admin = require("firebase-admin");
import { firebaseConfig } from "./firebaseConfig";
import { getIndTime, getTokenForProfile } from "./utils";

admin.initializeApp(firebaseConfig);

// firebase collection name
const notificationCollection = "notification";
const profileCollection = "userProfiles";

// Creating a pubsub function with name `taskRunner`, memory `512MB` and schedule every 31 min between 7 am to 10 pm
exports.taskRunner = functions
  .runWith({ memory: "512MB" })
  .pubsub.schedule("*/31 7-22 * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async (context: any) => {
    // Current Timestamp
    const firebaseCurrentTime = admin.firestore.Timestamp.now();
    const currentDateTime = new Date();
    console.log("firebaseCurrentTime : ", firebaseCurrentTime);

    // Query all documents ready to perform
    const query = firestore().collection(notificationCollection);

    const tasks = await query.get();

    tasks.forEach((snapshot: any) => {
      // destruct data from firebase document
      const { notifications, phoneNumber } = snapshot.data();
      let newNotifications: any = [],
        fcmToken: string = "";
      notifications.forEach(
        async (notification: any, notificationIndex: number) => {
          const isScheduledNotif =
            notification?.scheduledTime &&
            notification?.scheduledTime <= firebaseCurrentTime &&
            notification?.sent == false;
          const isRecurringNotif =
            !notification?.scheduledTime && notification?.time;
          const isScheduledArrayNotif =
            notification?.scheduledTimeArray &&
            notification?.scheduledTimeArray?.length > 0;

          if (isScheduledNotif || isRecurringNotif || isScheduledArrayNotif) {
            // destruct data from firebase document
            const { body, title } = notification;

            let tempDateTime =
              notification?.scheduledTime ||
              notification?.scheduledTimeArray?.[0];
            const sentTime = notification?.["sentTimestamp"]
              ? new Date(notification?.["sentTimestamp"])
              : null;
            const currentTime = new Date(
              currentDateTime.setTime(getIndTime(currentDateTime))
            );

            //Handling Recurring Notification
            if (
              isRecurringNotif &&
              (!sentTime ||
                (sentTime && sentTime.getDate() == currentTime.getDate()))
            ) {
              const time = notification.time.split(":");
              tempDateTime = currentDateTime;
              tempDateTime.setHours(time[0]);
              tempDateTime.setMinutes(time[1]);
              tempDateTime.setTime(getIndTime(tempDateTime));
              tempDateTime = admin.firestore.Timestamp.fromDate(tempDateTime);
            }

            if (tempDateTime && tempDateTime <= firebaseCurrentTime) {
              if (!fcmToken) {
                const profileQuery = firestore()
                  .collection(profileCollection)
                  .where("phoneNumber", "==", phoneNumber);
                const profile = await profileQuery.get();

                fcmToken = await getTokenForProfile(profile);
              }

              // using firebase-admin messaging function to send notification to our subscribed topic i.e. `all` with required `data`/payload
              const job = await admin.messaging().send({
                notification: {
                  title: title,
                  body: body,
                },
                token: fcmToken,
              });
            //   functions.https("makeRequest", async (req: any, res: any) => {
            //     const url =
            //       "https://graph.facebook.com/v16.0/FROM_PHONE_NUMBER_ID/messages"; // URL to send the request to
            //     const data = {
            //       messaging_product: "whatsapp",
            //       recipient_type: "individual",
            //       to: "PHONE_NUMBER",
            //       type: "text",
            //       text: {
            //         // the text object
            //         preview_url: false,
            //         body: "MESSAGE_CONTENT",
            //       },
            //     };
            //     const externalRes = await fetch(url, {
            //       method: "POST", // *GET, POST, PUT, DELETE, etc.
            //       headers: {
            //         "Content-Type": "application/json",
            //         Authorization: "Bearer ACCESS_TOKEN",
            //         // 'Content-Type': 'application/x-www-form-urlencoded',
            //       },
            //       body: JSON.stringify(data), // body data type must match "Content-Type" header
            //     });
            //     res.sendStatus(externalRes.ok ? 200 : 500);
            //   });

              if (job.length != 0) {
                newNotifications = [...notifications];
                if (isScheduledArrayNotif) {
                  newNotifications[notificationIndex][
                    "scheduledTimeArray"
                  ].splice(0, 1);
                }
                newNotifications[notificationIndex]["sent"] = true;
                newNotifications[notificationIndex]["sentTimestamp"] =
                  firebaseCurrentTime;
                // updating firestore notification document's `sent` to true.
                console.log(`Updating firestore ${snapshot.id}`);
                firestore()
                  .collection(notificationCollection)
                  .doc(snapshot.id)
                  .update({ notifications: newNotifications });
              }
            }
          }
        }
      );
    });
  });
