import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps"; // Import for the map
import { useParams } from "react-router-native";
import { db } from "../firebaseConfig"; // Import your Firestore instance
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions

const EventDetails = () => {
  const { eventId } = useParams(); // Access the eventId parameter
  console.log("eventId ==> ", eventId);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const eventDocRef = doc(db, "events", eventId);
        const eventDocSnap = await getDoc(eventDocRef);

        if (eventDocSnap.exists()) {
          setEvent(eventDocSnap.data());
        } else {
          setError("Event not found");
        }
      } catch (error) {
        setError("Error fetching event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [eventId]);

  const dateConvertor = (dateTime) => dateTime.toLocaleString(); // Improved date formatting

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f0b375" />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return event && event.location ? (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Date:</Text> {dateConvertor(event.date)}
      </Text>
      <Text style={styles.info}>
        <Text style={styles.label}>Attendees:</Text> {event.attendeeCount}
      </Text>
      {/* {event.location && ( // Only render the map if location data exists
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: event.location.latitude,
              longitude: event.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: event.location.latitude,
                longitude: event.location.longitude,
              }}
              title={event.title}
            />
          </MapView>
          <Text style={styles.mapLink} onPress={openMap}>
            Open in Maps
          </Text>
        </View>
      )} */}
    </View>
  ) : (
    <Text>Loading or no location data...</Text>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  mapContainer: {
    height: 200, // Set the height of the map
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Make the map fill its container
  },
  mapLink: {
    color: "blue",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

export default EventDetails;
