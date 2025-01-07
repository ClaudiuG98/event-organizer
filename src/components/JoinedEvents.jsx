import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getJoinedEvents } from "../hooks/joinedEvents";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import EventCard from "./EventCard";
import { auth } from "../firebaseConfig"; // Import auth

const JoinedEvents = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      setError(null);
      setLoading(true);
      try {
        if (!auth.currentUser) {
          // Handle the case where the user is not logged in
          setJoinedEvents([]);
          setLoading(false);
          return;
        }
        const joinedEventIds = await getJoinedEvents();
        const eventsCollectionRef = collection(db, "events");
        const fetchedEvents = [];

        for (const eventId of joinedEventIds) {
          const eventDoc = await getDoc(doc(eventsCollectionRef, eventId));
          if (eventDoc.exists()) {
            fetchedEvents.push({ id: eventDoc.id, ...eventDoc.data() });
          }
        }
        setJoinedEvents(fetchedEvents);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedEvents();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f0b375" />
          <Text style={styles.loadingText}>Loading your joined events...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : joinedEvents.length === 0 ? (
        <View style={styles.noEventsContainer}>
          <Text style={styles.noEventsText}>You haven't joined any events yet.</Text>
        </View>
      ) : (
        <FlatList
          data={joinedEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard event={item} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // Light background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noEventsText: {
    fontSize: 20,
    color: "#888", // Slightly darker gray
    textAlign: "center",
  },
});

export default JoinedEvents;
