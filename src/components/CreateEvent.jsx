// CreateEvent.jsx
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from "react-native";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { useNavigate } from "react-router-native";
import { createEvent } from "../hooks/createEvent";
import Ionicons from "@expo/vector-icons/Ionicons";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [openDate, setOpenDate] = useState(false);

  const handleSubmit = async () => {
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      await createEvent({ title, description, date: formattedDate, location });
      navigate("/");
    } catch (error) {
      console.error("Error creating event:", error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate("/profile")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8b4513" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Event</Text>
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
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});

export default CreateEvent;
