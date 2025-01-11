// events.js (New hook)
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export const createEvent = async (eventData) => {
  try {
    const uid = auth.currentUser.uid; // Get current user's ID
    const eventsCollection = collection(db, "events");
    const newEventRef = await addDoc(eventsCollection, {
      ...eventData,
      createdAt: serverTimestamp(),
      createdBy: uid,
      attendeeCount: 1,
      bannerLocation: "https://picsum.photos/250/150", //TODO: Add banner image from user phone
    });

    // Update user's joinedEvents and createdEvents
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      joinedEvents: arrayUnion(newEventRef.id), // User automatically joins
      createdEvents: arrayUnion(newEventRef.id),
    });

    console.log("Event created with ID:", newEventRef.id);
    return newEventRef.id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error; // Re-throw the error to be handled in the component
  }
};
