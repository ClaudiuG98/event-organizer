import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
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

export const getJoinedEventsData = async () => {
  // Renamed for clarity
  const uid = auth.currentUser.uid;
  const userRef = doc(db, "users", uid);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const joinedEventIds = userSnap.data().joinedEvents || [];

      if (joinedEventIds.length === 0) return []; // Return early if no joined events

      const eventsCollectionRef = collection(db, "events");
      const fetchedEvents = await Promise.all(
        joinedEventIds.map(async (eventId) => {
          const eventDoc = await getDoc(doc(eventsCollectionRef, eventId));
          return eventDoc.exists() ? { id: eventDoc.id, ...eventDoc.data() } : null;
        })
      ).then((events) => events.filter((event) => event !== null));

      return fetchedEvents;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting joined events data:", error);
    return [];
  }
};

export const getCreatedEventsData = async () => {
  // Renamed for clarity
  const uid = auth.currentUser.uid;
  const userRef = doc(db, "users", uid);

  try {
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const joinedEventIds = userSnap.data().createdEvents || [];

      if (joinedEventIds.length === 0) return []; // Return early if no joined events

      const eventsCollectionRef = collection(db, "events");
      const fetchedEvents = await Promise.all(
        joinedEventIds.map(async (eventId) => {
          const eventDoc = await getDoc(doc(eventsCollectionRef, eventId));
          return eventDoc.exists() ? { id: eventDoc.id, ...eventDoc.data() } : null;
        })
      ).then((events) => events.filter((event) => event !== null));

      return fetchedEvents;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting joined events data:", error);
    return [];
  }
};
