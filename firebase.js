// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDL3xQDsYkXI11vBZ5d1hCWG9qn7reCuEs',
  authDomain: 'department-manager-f40aa.firebaseapp.com',
  projectId: 'department-manager-f40aa',
  storageBucket: 'department-manager-f40aa.appspot.com',
  messagingSenderId: '773772926960',
  appId: '1:773772926960:web:a6d6f24a59ce83d7678735',
  measurementId: 'G-H7JPSHCVWJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
