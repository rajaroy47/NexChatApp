import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
    apiKey: "AIzaSyBblpZdFi8E3Lcf-4yEoJ3yhUonWmgpgyc",
    authDomain: "nexchat-8c980.firebaseapp.com",
    projectId: "nexchat-8c980",
    storageBucket: "nexchat-8c980.appspot.com",
    messagingSenderId: "87765028514",
    appId: "1:87765028514:web:26a575692fa3e343e3491fb",
    databaseURL: "https://nexchat-8c980-default-rtdb.firebaseio.com",
};

export const ADMIN_EMAIL = 'eduroket001@gmail.com';
export const ADMIN_UID = 'FUvapl5SDpXbjndBJoM5tNfkytx1';

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);