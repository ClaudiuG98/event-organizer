import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Route, Routes, Navigate } from "react-router-native";
import { useEffect, useState } from "react";
import { getDocs, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import EventList from "./EventList";
import FooterBar from "./FooterBar";
import ProfilePage from "./ProfilePage";
import JoinedEvents from "./JoinedEvents";
import EventDetails from "./EventDetails";
import CreateEvent from "./CreateEvent";
import EditEvent from "./EditEvent";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: "#e1e4e8",
    marginTop: 0,
  },
});

const Main = () => {
  const [events, setEvents] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(startDate, 7));

  function addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (querySnapshot) => {
      // Use onSnapshot
      const eventList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        animated={false}
        barStyle="light-content"
        backgroundColor="#f8e7af"
        showHideTransition="none"
        hidden={true}
      />
      <Routes>
        <Route
          path="/"
          element={
            <EventList
              events={events}
              startDate={startDate}
              endDate={endDate}
              setEndDate={setEndDate}
              setStartDate={setStartDate}
            />
          }
        />
        <Route path="/joinedEvents" element={<JoinedEvents />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/edit/:eventId" element={<EditEvent />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FooterBar />
    </View>
  );
};

export default Main;
