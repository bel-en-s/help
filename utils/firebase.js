import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCWcnQoIS9JE49Iw94ZYmj6HA0tAmjdNys",
    authDomain: "nw-app-dashboard.firebaseapp.com",
    databaseURL: "https://nw-app-dashboard-default-rtdb.firebaseio.com",
    projectId: "nw-app-dashboard",
    storageBucket: "nw-app-dashboard.appspot.com",
    messagingSenderId: "989935726924",
    appId: "1:989935726924:web:ab6ad64a823e993913dfe9"
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);