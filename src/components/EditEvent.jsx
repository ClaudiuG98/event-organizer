import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { useNavigate, useParams } from "react-router-native";
import { updateEventDetails, getEventDetails } from "../hooks/updateEvent"; // Import the update function
import Ionicons from "@expo/vector-icons/Ionicons";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const eventData = await getEventDetails(eventId); // Use getEventDetails
        if (eventData) {
          setTitle(eventData.title);
          setDescription(eventData.description);
          setDate(new Date(eventData.date)); // Convert date string to Date object
          setLocation(eventData.location);
        } else {
          console.error("Event not found"); // Or handle the error as needed
          // Consider navigating back or displaying an error message
          navigate(-1); // Example: navigate back to the previous screen.
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleSubmit = async () => {
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const updates = { title, description, date: formattedDate, location };
      await updateEventDetails(eventId, updates);
      navigate(-1); // Navigate back to event details
    } catch (error) {
      console.error("Error updating event:", error);
      // Handle the error
    }
  };

  if (loading) {
    // Show loading indicator while fetching data
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f0b375" />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate(-1)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8b4513" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Event</Text>
      </View>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity onPress={() => setOpenDate(true)}>
        <View style={styles.input}>
          <Text>{moment(date).format("D MMMM, YYYY - hh:mm A")}</Text>
        </View>
      </TouchableOpacity>
      <DatePicker
        modal
        open={openDate}
        date={date}
        mode="datetime"
        minimumDate={new Date()}
        maximumDate={new Date("2025-12-31")}
        onConfirm={(endDate) => {
          setOpenDate(false);
          setDate(endDate);
        }}
        onCancel={() => {
          setOpenDate(false);
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Event</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#FFFAF0", // Consistent background color
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
  input: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: Platform.OS === "android" ? 3 : 0,
  },
  createButton: {
    backgroundColor: "#f0b375",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
});

export default EditEvent;
