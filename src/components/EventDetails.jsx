import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import { useParams } from "react-router-native";
import { auth } from "../firebaseConfig";
import { getEventDetails } from "../hooks/updateEvent";
import imageMapping from "../hooks/imageMapping";
import moment from "moment";
import { joinEvent, leaveEvent, getJoinedEvents } from "../hooks/joinedEvents";
import { useNavigate } from "react-router-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { updateAttendeeCount } from "../hooks/updateEvent";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const eventData = await getEventDetails(eventId); // Use the new function
        if (eventData) {
          setEvent(eventData);

          const eventDate = moment(eventData.date.toDate(), "YYYY-MM-DD");
          const now = moment();
          const daysDiff = eventDate.diff(now, "days");
          setDaysLeft(daysDiff);
          if (auth.currentUser && eventData.createdBy === auth.currentUser.uid) {
            setIsOwner(true);
          }
        } else {
          setError("Event not found");
        }
      } catch (error) {
        setError("Error fetching event details");
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkJoinedStatus = async () => {
      if (auth.currentUser) {
        const joinedEvents = await getJoinedEvents();
        setIsJoined(joinedEvents.includes(eventId));
      }
    };

    fetchEventDetails();
    checkJoinedStatus(); // Check joined status after fetching event details
  }, [eventId]);

  const handleJoinLeave = async () => {
    try {
      if (isJoined) {
        await leaveEvent(eventId);
        await updateAttendeeCount(eventId, false);
        setEvent({ ...event, attendeeCount: event.attendeeCount - 1 });
      } else {
        await joinEvent(eventId);
        await updateAttendeeCount(eventId, true);
        setEvent({ ...event, attendeeCount: event.attendeeCount + 1 });
      }
      setIsJoined(!isJoined); // Toggle joined state immediately
    } catch (error) {
      console.error("Error joining/leaving event:", error);
      // Handle error (e.g., show an error message)
    }
  };

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

  const bannerImage = event && event.bannerLocation && imageMapping[event.bannerLocation];

  return (
    <View style={styles.container}>
      <View style={styles.bannerImageContainer}>
        <Image
          source={bannerImage ? bannerImage : { uri: "https://picsum.photos/250/150" }}
          style={styles.bannerImage}
        />
      </View>
      <View style={styles.header}>
        <Pressable onPress={() => navigate(-1)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8b4513" />
        </Pressable>
        <Text style={styles.title}>{event.title}</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Ionicons name="document" size={24} color="#f0b375" />
        <Text style={styles.descriptionText}>{event.description}</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={24} color="#f0b375" />
          <Text style={styles.infoText}>
            {moment(event.date.seconds * 1000).format("D MMMM, YYYY ")}
            {daysLeft !== null && (
              <Text style={{ color: daysLeft <= 3 ? "red" : "black" }}>
                ({daysLeft} {daysLeft === 1 ? "day" : "days"} left)
              </Text>
            )}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={24} color="#f0b375" />
          <Text style={styles.infoText}> {event.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people" size={24} color="#f0b375" />
          <Text style={styles.infoText}> {event.attendeeCount} Attendees</Text>
        </View>
      </View>
      {isOwner && (
        <TouchableOpacity onPress={() => navigate(`/edit/${eventId}`)} style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Edit Event</Text>
        </TouchableOpacity>
      )}
      {daysLeft < 0 ? (
        <TouchableOpacity style={styles.joinButton} onPress={() => navigate("/")}>
          <Text style={styles.joinButtonText}>Event Ended, Check out More Events</Text>
        </TouchableOpacity>
      ) : auth.currentUser ? ( // Only show button if user is logged in
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinLeave}>
          <Text style={styles.joinButtonText}>{isJoined ? "Leave Event" : "Join Event"}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.joinButton} onPress={() => navigate("/login")}>
          <Text style={styles.joinButtonText}>Log In to Join Event</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFAF0",
  },
  joinButton: {
    backgroundColor: "#f0b375",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20, // Add margin top
    marginLeft: 20,
    marginRight: 20,
  },
  joinButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginLeft: 0,
    marginRight: 10,
  },
  bannerImageContainer: {
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: Platform.OS === "android" ? 5 : 0,
  },
  bannerImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
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
    padding: 20,
  },
});

export default EventDetails;
