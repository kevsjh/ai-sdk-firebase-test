import { onRequest } from "firebase-functions/v2/https";
import mainApp from "./express/main-app";


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.api = onRequest({
    region: 'us-central1',
    cors: true,

    minInstances: 0,
    maxInstances: 100,
    // timeout within 3 minutes
    timeoutSeconds: 180,
    concurrency: 30,
    memory: '1GiB',
}, (req, res) => {

    return mainApp(req, res)
});
