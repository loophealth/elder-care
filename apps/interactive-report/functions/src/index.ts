const functions = require("firebase-functions");
const { firestore } = require("firebase-admin");
const admin = require("firebase-admin");
import { firebaseConfig } from "./firebaseConfig";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp(firebaseConfig);

// firebase collection name
const notificationCollection = "notification";

// Creating a pubsub function with name `taskRunner`, memory `512MB` and schedule every 30 min between 6 am to 10 pm
exports.taskRunner = functions.runWith({ memory: '512MB' }).pubsub.schedule('*/30 6-22 * * *').timeZone('Asia/Kolkata').onRun(async (context: any) => {

    // Current Timestamp
    const now = admin.firestore.Timestamp.now()

    // Query all documents ready to perform
    const query = firestore().collection(notificationCollection).where('scheduledTime', '<=', now).where('sent', '==', false).where('cancel', '==', false)

    const tasks = await query.get()

    // Jobs to execute
    const jobs = [];

    tasks.forEach(async (snapshot: any) => {
        // destruct data from firebase document
        const { body, title } = snapshot.data()

        // using firebase-admin messaging function to send notification to our subscribed topic i.e. `all` with required `data`/payload
        const job = await admin.messaging().send({
            notification: {
                title: title,
                body: body,
            },
            token: "e10nKvFWtsSyQY1IfVNjks:APA91bETSD0a8-c0v5tBTlOzIc_MDCJFCttnOIO27Fwn3KlaJDwIllOrpuFXi65kGd9QZSrw3y9pkHd6QfBH2oT7YRt4J391f0jtHYh-ewwZJU2nRdQyFn5k8X1I66rudNXLaEFYKtoi"
        })

        if (job.length != 0) {
            console.log('Notification Sent');
            // updating firestore notification document's `sent` to true. 
            firestore().collection(notificationCollection).doc(snapshot.id).update({ 'sent': true });
        }
        console.log(`Message sent:: ${job}`);

        jobs.push(job)
    })
})
