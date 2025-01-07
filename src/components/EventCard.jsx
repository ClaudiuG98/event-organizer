import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import imageMapping from "../hooks/imageMapping";
import { useNavigate } from "react-router-native";
import { joinEvent, leaveEvent, getJoinedEvents } from "../hooks/joinedEvents";
import { auth } from "../firebaseConfig";

const EventCard = ({ event }) => {
  const [isJoined, setIsJoined] = useState(false);
  const dateConvertor = (dateTime) => dateTime.slice(0, 21);
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
    } else {
      await joinEvent(event.id);
    }
    setIsJoined(!isJoined);
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={() => navigate(`/event-details/${event.id}`)}>
        <Image source={bannerSource} style={styles.banner} />
        <View style={styles.details}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={styles.date}>{dateConvertor(event.date.toString())}</Text>
          </View>

          <Pressable
            style={styles.starButton}
            onPress={() => (auth.currentUser ? handleJoinLeave() : navigate("/login"))}
          >
            <Ionicons
              style={styles.starIcon}
              name={isJoined ? "star" : "star-outline"}
              size={30}
              color="#f0b375"
            />
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden", // To clip the image if it overflows
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  banner: {
    width: "100%",
    height: 250,
  },
  details: {
    padding: 16,
    flexDirection: "row",
  },
  starButton: {
    padding: 8,
  },
  starIcon: {
    fontSize: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
});

export default EventCard;
