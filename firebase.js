// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBxt4ZPf7CyIco8ABC0B5ezVauQESXB7RE',
  authDomain: 'department-manager-front-78a74.firebaseapp.com',
  projectId: 'department-manager-front-78a74',
  storageBucket: 'department-manager-front-78a74.appspot.com',
  messagingSenderId: '478006274227',
  appId: '1:478006274227:web:bf30a55ee1bb9d8e68a8c6',
  measurementId: 'G-RGRBMW101E',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
