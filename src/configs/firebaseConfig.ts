//
import serviceAccount from "../../my-payment-app-3b0ed-firebase-adminsdk-fbsvc-d19e68f4ce.json"

//
import admin from "firebase-admin"

// Inicializa o Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://my-payment-app-3b0ed.firebaseio.com"
  })
}

//
export const db = admin.firestore()
export const auth = admin.auth()
