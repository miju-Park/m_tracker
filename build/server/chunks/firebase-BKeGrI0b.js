import { getApps, initializeApp, getApp, deleteApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAaMSu4aYw57q2Zaq36lONWg6iITrLd50",
  authDomain: "m-tracker-14780.firebaseapp.com",
  projectId: "m-tracker-14780",
  storageBucket: "m-tracker-14780.appspot.com",
  messagingSenderId: "737690142669",
  appId: "1:737690142669:web:0976b7123211372c23a684"
};
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
  deleteApp(firebaseApp);
  firebaseApp = initializeApp(firebaseConfig);
}
const db = getFirestore(firebaseApp);
getAuth(firebaseApp);

export { db as d };
//# sourceMappingURL=firebase-BKeGrI0b.js.map
