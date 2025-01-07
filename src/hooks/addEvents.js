import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Add multiple events
const addEvents = async () => {
  const events = [
    {
      attendeeCount: 45,
      bannerLocation: "../assets/events/event5.jpg",
      createdAt: new Date(),
      creatorId: "ZinYc3CrmOwzrS9h4cak",
      date: "2025-02-15",
      description: "A big tech conference",
      eventId: "uniqueEventId5",
      location: "New York",
      title: "Tech Conference 2025",
    },
    {
      attendeeCount: 100,
      bannerLocation: "../assets/events/event6.jpg",
      createdAt: new Date(),
      creatorId: "differentUserId",
      date: "2025-03-10",
      description: "Annual Sports Meetup",
      eventId: "uniqueEventId6",
      location: "San Francisco",
      title: "Sports Meetup",
    },
    {
      attendeeCount: 51,
      createdAt: new Date(),
      description: "Summer Music Festival meeting",
      eventId: "uniqueEventId1",
      creatorId: "differentUserId",
      location: "San Francisco",
      title: "Summer Music Festival",
      date: "2025-01-09",
      bannerLocation: "../../assets/events/event1.jpg",
    },
    {
      attendeeCount: 21,
      createdAt: new Date(),
      description: "Food Truck Fiesta",
      eventId: "uniqueEventId2",
      creatorId: "differentUserId",
      location: "San Francisco",
      title: "Food Truck Fiesta",
      date: "2025-01-03",
      bannerLocation: "../../assets/events/event2.jpg",
    },
    {
      attendeeCount: 12,
      createdAt: new Date(),
      description: "Annual Sports Meetup",
      eventId: "uniqueEventId3",
      creatorId: "differentUserId",
      location: "San Francisco",
      title: "Art Exhibition Opening",
      date: "2025-01-05",
      bannerLocation: "../../assets/events/event3.jpg",
    },
    {
      attendeeCount: 34,
      createdAt: new Date(),
      description: "Annual Sports Meetup",
      eventId: "uniqueEventId4",
      creatorId: "ZinYc3CrmOwzrS9h4cak",
      location: "San Francisco",
      title: "Coding Workshop",
      date: "2025-01-20",
      bannerLocation: "../../assets/events/event4.jpg", // Example: Add more events
    },
  ];

  try {
    for (const event of events) {
      const docRef = await addDoc(collection(db, "events"), event);
      console.log("Document written with ID: ", docRef.id);
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

addEvents();

export default addEvents;
