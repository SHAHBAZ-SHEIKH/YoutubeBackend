
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyC56dQFMU3Jg4C_mdtzjHSPN4nOe0FnV4o",
  authDomain: "phone-6aa72.firebaseapp.com",
  projectId: "phone-6aa72",
  storageBucket: "phone-6aa72.appspot.com",
  messagingSenderId: "963576307016",
  appId: "1:963576307016:web:8459e5e8e8c8425172e77d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export default app;
