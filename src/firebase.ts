// // import { initializeApp } from "firebase/app"
// // import { getFirestore } from "firebase/firestore"

// // const firebaseConfig = {
// //   apiKey: import.meta.env.VITE_API_KEY,
// //   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
// //   projectId: import.meta.env.VITE_PROJECT_ID,
// //   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
// //   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
// //   appId: import.meta.env.VITE_APP_ID
// // }

// // const app = initializeApp(firebaseConfig)

// // export const db = getFirestore(app)
// import { initializeApp } from "firebase/app"
// import { getFirestore } from "firebase/firestore"

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_API_KEY,
//   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_APP_ID
// }

// // Initialize Firebase
// const app = initializeApp(firebaseConfig)

// // Firestore DB
// export const db = getFirestore(app)
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// ✅ Yeh sab values Vercel Dashboard > Project > Settings > Environment Variables mein add karni hain
// Variable names EXACTLY yahi hone chahiye (VITE_ prefix zaroori hai)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
}

// ✅ Dev mode mein check — missing env variables ko console mein dikhao
if (import.meta.env.DEV) {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k)

  if (missing.length > 0) {
    console.error('❌ Firebase: Missing env variables:', missing)
    console.error('👉 .env file mein yeh add karo:')
    missing.forEach(k => console.error(`  VITE_${k.toUpperCase()}=your_value_here`))
  }
}

const app = initializeApp(firebaseConfig)
console.log('Firebase Config:', JSON.stringify(firebaseConfig))
export const db = getFirestore(app)