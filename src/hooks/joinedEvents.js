import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export const joinEvent = async (eventId) => {
  const uid = auth.currentUser.uid;
  console.log("uid ==>  ", uid);
  const userRef = doc(db, "users", uid);

  try {
    await updateDoc(userRef, {
      joinedEvents: arrayUnion(eventId), // Use arrayUnion to add the event ID
    });
  } catch (error) {
    console.error("Error joining event:", error);
  }
};

export const leaveEvent = async (eventId) => {
  const uid = auth.currentUser.uid;
  const userRef = doc(db, "users", uid);

  try {
    await updateDoc(userRef, {
      joinedEvents: arrayRemove(eventId), // Use arrayRemove to remove the event ID
    });
  } catch (error) {
    console.error("Error leaving event:", error);
  }
};

export const getJoinedEvents = async () => {
  const uid = auth.currentUser.uid;
  const userRef = doc(db, "users", uid);

  try {
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().joinedEvents || []; // Return an empty array if no joined events
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting joined events:", error);
    return [];
  }
};
