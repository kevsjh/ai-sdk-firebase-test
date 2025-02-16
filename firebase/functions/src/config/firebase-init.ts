import { initializeApp } from "firebase-admin/app";

import { getFirestore, } from "firebase-admin/firestore";

import { getFunctions } from "firebase-admin/functions";


initializeApp();


const firebaseFunction = getFunctions()
const firebaseFirestore = getFirestore();

firebaseFirestore.settings({ ignoreUndefinedProperties: true });


export {
    firebaseFunction,
    firebaseFirestore,



}