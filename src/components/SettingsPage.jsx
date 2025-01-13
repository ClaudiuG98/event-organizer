import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { useNavigate, useLocation } from "react-router-native";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const user = state.user;
  //console.log("user ==> ", user);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Navigate to login after logout
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error (e.g., display an error message)
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password"); // Navigate to the change password screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigate(-1)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8b4513" />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>
      <View style={styles.identificationSection}>
        <Text style={styles.sectionTitle}>Identification</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{user.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
        <Text style={styles.buttonTextChangePassword}>Change Password</Text>
        <Ionicons name="chevron-forward-sharp" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    backgroundColor: "#FFFAF0", // Or any other background color
  },
  logoutButton: {
    width: "80%",
    backgroundColor: "#f0b375", // Example button color
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffa500",
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  identificationSection: {
    width: "100%", // or a specific width if you prefer
    paddingHorizontal: 20, // Add horizontal padding
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#a56931", // Your color palette
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "column",
    justifyContent: "space-between", // Align items to the edges
    marginBottom: 8, // Add spacing between rows
    borderBottomWidth: 1, // Add a separator line
    borderBottomColor: "#d4bfa6", // Light brown separator
    paddingBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600", // Slightly bolder
    color: "#555", // Darker color for labels
  },
  infoValue: {
    fontSize: 16,
    color: "#333", // Main text color
  },
  changePasswordButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
    color: "black",
    marginBottom: 15, // Add some spacing
  },
  buttonTextChangePassword: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonText: {
    // Common button text style
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SettingsPage;
