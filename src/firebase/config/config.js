// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAEera31BHh_mVMJHHyqJWf23R7C4L8MvM",
  authDomain: "pengaduan-masyarakat-48fb5.firebaseapp.com",
  databaseURL: "https://pengaduan-masyarakat-48fb5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pengaduan-masyarakat-48fb5",
  storageBucket: "pengaduan-masyarakat-48fb5.appspot.com",
  messagingSenderId: "176866783765",
  appId: "1:176866783765:web:2fa8c51cd1bfbab050941c",
  measurementId: "G-X8MCK1JV1X"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)