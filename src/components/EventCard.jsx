import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, Dimensions } from "react-native"; // Import Dimensions
import imageMapping from "../hooks/imageMapping";
import { useNavigate } from "react-router-native";
import { joinEvent, leaveEvent, getJoinedEvents } from "../hooks/joinedEvents";
import { auth } from "../firebaseConfig";
import moment from "moment";
import { updateAttendeeCount } from "../hooks/updateEvent";

const { width } = Dimensions.get("window");

const EventCard = ({ event, past }) => {
  const [isJoined, setIsJoined] = useState(false);
  const bannerSource = imageMapping[event.bannerLocation];

  const navigate = useNavigate();

  useEffect(() => {
    const checkJoined = async () => {
      if (auth.currentUser) {
        const joinedEvents = await getJoinedEvents();
        setIsJoined(joinedEvents.includes(event.id));
      }
    };
    checkJoined();
  }, [event.id]);

  const handleJoinLeave = async () => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }
    if (isJoined) {
      await leaveEvent(event.id);
      await updateAttendeeCount(event.id, false);
      event = { ...event, attendeeCount: event.attendeeCount - 1 };
    } else {
      await joinEvent(event.id);
      await updateAttendeeCount(event.id, true);
      event = { ...event, attendeeCount: event.attendeeCount + 1 };
    }
    setIsJoined(!isJoined);
  };

  return (
    <Pressable
      style={[styles.card, past && styles.pastEvent]}
      onPress={() => navigate(`/event/${event.id}`)}
      disabled={past}
    >
      <Image
        source={bannerSource ? bannerSource : { uri: "https://picsum.photos/250/150" }}
        style={styles.banner}
      />

      <View style={styles.details}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>
          {moment(event.date.seconds * 1000).format("DD-MM-YYYY h:mm A")}
        </Text>
      </View>

      <Pressable style={styles.joinButton} onPress={handleJoinLeave} disabled={past}>
        {!past ? (
          <Text style={styles.joinButtonText}>{isJoined ? "Leave" : "Join"}</Text>
        ) : (
          <Text style={styles.joinButtonText}>Ended</Text>
        )}
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: (width - 36) / 2, // Calculate width dynamically
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 6,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  banner: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  details: {
    padding: 16,
    flexDirection: "column",
    justifyContent: "space-around",
    height: 100,
  },
  starButton: {
    padding: 8,
  },
  joinButton: {
    // Style for the Join/Leave button
    backgroundColor: "#f0b375",
    paddingLeft: 16,
    paddingRight: 16,
    height: 45,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
  },
  starIcon: {
    fontSize: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: -5,
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  pastEvent: {
    opacity: 0.5, // Adjust opacity as needed
  },
});

export default EventCard;
