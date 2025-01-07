// FooterBar.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons"; // Or your preferred icon library
import { useNavigate } from "react-router-native";

const FooterBar = () => {
  const navigate = useNavigate();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.tab} onPress={() => navigate("/")}>
        <Ionicons name="calendar" size={24} color="black" />
        <Text style={styles.tabText}>Events</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigate("/joinedEvents")}>
        <Ionicons name="star-outline" size={24} color="black" />
        <Text style={styles.tabText}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigate("/profile")}>
        <Ionicons name="person" size={24} color="black" />
        <Text style={styles.tabText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around", // Distribute tabs evenly
    alignItems: "center", // Center vertically
    backgroundColor: "#f8e7af", // Light beige (adjust as needed)
    borderTopWidth: 1,
    borderTopColor: "#d4bfa6", // Add a top border
    // Add some vertical padding

    width: "100%",
    height: 70,
    position: "absolute",
    bottom: 15,
  },

  tab: {
    alignItems: "center", // Center icon and text vertically
    flex: 1, // Each tab takes equal width
  },

  tabText: {
    fontSize: 12,
    marginTop: 5, // Space between icon and text
    color: "black",
  },
});

export default FooterBar;
