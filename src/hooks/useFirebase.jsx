import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCt4dRWFOE5TzliKbDnS40Z9wpKWqx9VDE",
    authDomain: "test-6a1e2.firebaseapp.com",
    projectId: "test-6a1e2",
    storageBucket: "test-6a1e2.appspot.com",
    messagingSenderId: "208581422849",
    appId: "1:208581422849:web:5d308e8e60a2b1484b3500"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
// Firebase storage reference
const storage = getStorage(app);
export default storage;