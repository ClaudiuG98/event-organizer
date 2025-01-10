// currentUserData.js
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export const getCurrentUserData = async () => {
  try {
    const uid = auth.currentUser?.uid; // Handle the case where currentUser might be null
    if (!uid) {
      return null; // Or throw an error: throw new Error("User not logged in");
    }

    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data();
    } else {
      console.warn("User document doesn't exist in Firestore."); // Log a warning if document not found
      return null; // Or handle this case as needed.
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return null; // Return null or throw error as needed
  }
};
