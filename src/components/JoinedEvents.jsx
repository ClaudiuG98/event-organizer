import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getJoinedEvents } from "../hooks/joinedEvents";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import EventCard from "./EventCard";
import { auth } from "../firebaseConfig"; // Import auth
import { useNavigate } from "react-router-native";

const JoinedEvents = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    let unsubscribe;

    const fetchJoinedEvents = async () => {
      setLoading(true);
      try {
        if (!auth.currentUser) {
          setJoinedEvents([]);
          setLoading(false);
          return;
        }

        const joinedEventIds = await getJoinedEvents();
        if (joinedEventIds.length === 0) {
          setJoinedEvents([]);
          setLoading(false);
          return;
        }

        unsubscribe = onSnapshot(
          collection(db, "events"), // Listen to the whole events collection
          (snapshot) => {
            const updatedJoinedEvents = [];
            snapshot.forEach((doc) => {
              if (joinedEventIds.includes(doc.id)) {
                updatedJoinedEvents.push({ id: doc.id, ...doc.data() });
              }
            });
            setJoinedEvents(updatedJoinedEvents);
            setLoading(false);
          },
          (error) => {
            console.log("onSnapshot Error: " + error);
          }
        );
      } catch (error) {
        console.error("Error fetching joined events:", error);
      }
    };

    fetchJoinedEvents();

    return () => unsubscribe && unsubscribe(); // Unsubscribe on unmount
  }, []);

  const Header = () => {
    return (
      <View style={styles.header}>
        <Pressable onPress={() => navigate(-1)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8b4513" />
        </Pressable>
        <Text style={styles.title}>Joined Events</Text>
      </View>
    );
  };
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
        <View style={{ flex: 1 }}>
          <Header />
          <View style={styles.noEventsContainer}>
            <Text style={styles.noEventsText}>You haven't joined any events yet.</Text>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Header />
          <FlatList
            data={joinedEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EventCard event={item} />}
            contentContainerStyle={styles.flatListContent}
            numColumns={2} // Display 2 columns
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#FFFAF0",
    flexDirection: "row",
  },
  flatListContent: {
    paddingHorizontal: 10, // Reduced horizontal padding
    paddingTop: 10, // Reduced top padding
    paddingBottom: 85,
  },
  columnWrapper: {
    justifyContent: "space-between", // Space evenly between columns
    marginBottom: 10, // Vertical spacing between rows
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
  header: {
    // Style the header container
    width: "100%", // Take full width
    flexDirection: "row", // Arrange back button and title horizontally
    alignItems: "center", // Vertically center items
    justifyContent: "center", // Center the Title
    marginBottom: 20, // Add margin below the header
  },
  title: {
    // Center the title horizontally
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffa500", // Orange
  },
  backButton: {
    position: "absolute", // Take the back button out of the flow
    left: 10, // Position it to the left edge of the header
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
