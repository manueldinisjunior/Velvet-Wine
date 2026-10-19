import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAuop4Vnuq7zR2WP6m7nAJuv7TTXDn_4S8",
  authDomain: "nevinny-shop.firebaseapp.com",
  projectId: "nevinny-shop",
  storageBucket: "nevinny-shop.appspot.com",
  messagingSenderId: "712174046561",
  appId: "1:712174046561:web:844d6e349003a91a038920",
  databaseURL:
    "https://nevinny-shop-default-rtdb.europe-west1.firebasedatabase.app/",
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

export default database;
