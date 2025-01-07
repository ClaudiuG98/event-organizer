import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import DatePicker from "react-native-date-picker";
import { useNavigate } from "react-router-native";
import { auth } from "../firebaseConfig";

const DateBar = ({ startDate, endDate, setEndDate, setStartDate }) => {
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const navigate = useNavigate();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleStartDateChange = (startDate) => {
    setStartDate(startDate);
    if (endDate < startDate) {
      setEndDate(startDate);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#f8e7af",
        borderBottomWidth: 1,
        borderBottomColor: "#d4bfa6",
      }}
    >
      <View style={styles.dateBarContainer}>
        <View style={styles.dateContainer}>
          <TouchableOpacity style={styles.circularButton} onPress={() => setOpenStartDate(true)}>
            <View style={styles.dateContent}>
              <Text style={styles.buttonText}>{startDate.getDate()}</Text>
              <Text style={styles.monthText}>{monthNames[startDate.getMonth()]}</Text>
            </View>
          </TouchableOpacity>
          <DatePicker
            modal
            open={openStartDate}
            date={startDate}
            mode="date"
            minimumDate={new Date()}
            maximumDate={new Date("2025-12-31")}
            onConfirm={(startDate) => {
              handleStartDateChange(startDate);
              setOpenStartDate(false);
            }}
            onCancel={() => {
              setOpenStartDate(false);
            }}
          />
        </View>
        <Pressable style={styles.textContainer} onPress={() => navigate("/login")}>
          <Text style={styles.title}>UPCOMING</Text>
          <Text style={styles.title}>EVENTS</Text>
        </Pressable>

        <View style={styles.dateContainer}>
          <TouchableOpacity style={styles.circularButton} onPress={() => setOpenEndDate(true)}>
            <View style={styles.dateContent}>
              <Text style={styles.buttonText}>{endDate.getDate()}</Text>
              <Text style={styles.monthText}>{monthNames[endDate.getMonth()]}</Text>
            </View>
          </TouchableOpacity>
          <DatePicker
            modal
            open={openEndDate}
            date={endDate}
            mode="date"
            minimumDate={startDate}
            maximumDate={new Date("2025-12-31")}
            onConfirm={(endDate) => {
              setOpenEndDate(false);
              setEndDate(endDate);
            }}
            onCancel={() => {
              setOpenEndDate(false);
            }}
          />
        </View>
      </View>
      {!auth.currentUser && (
        <View style={styles.authButtonContainer}>
          <Pressable onPress={() => navigate("/login")} style={styles.authButton}>
            <Text style={styles.authButtonText}>Log In/Sign Up</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Align items vertically
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f8e7af", // Light beige background
  },
  dateContainer: {
    flexDirection: "column",
  },
  dateContent: {
    alignItems: "center",
  },
  monthText: {
    //Style for the month text
    fontSize: 18, // Smaller than the day
    color: "black",
    marginTop: -7,
    fontWeight: "500", // Semi-bold
    paddingBottom: 5,
  },
  authButtonContainer: {
    marginTop: 0,
    margin: 20,
  },
  authButton: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f0b375", // Orange button
  },
  authButtonText: {
    color: "black",
    textAlign: "center",
    fontSize: 32,
    letterSpacing: 2,
  },
  circularButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0b375", // Orange button
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginRight: 8,
    elevation: 5,
  },
  textContainer: {
    alignItems: "center",
  },
  buttonText: {
    fontSize: 32,
    color: "black",
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#a56931", // Darker brown text
  },
});

export default DateBar;
