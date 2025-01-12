// eventUtils.js (new file)

import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const updateAttendeeCount = async (eventId, isJoining) => {
  try {
    const eventRef = doc(db, "events", eventId);

    // Use increment to atomically update the attendee count
    await updateDoc(eventRef, {
      attendeeCount: increment(isJoining ? 1 : -1),
    });
  } catch (error) {
    console.error("Error updating attendee count:", error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

export const updateEventDetails = async (eventId, updates) => {
  try {
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, updates); // updates is an object with the fields to change
  } catch (error) {
    console.error("Error updating event details:", error);
    throw error;
  }
};

export const getEventDetails = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventDocSnap = await getDoc(eventRef);

    if (eventDocSnap.exists()) {
      return eventDocSnap.data();
    } else {
      return null; // Or throw an error if you prefer
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
};
