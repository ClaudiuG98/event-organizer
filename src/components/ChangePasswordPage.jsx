import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native"; // Import Alert
import { reauthenticateWithCredential, updatePassword } from "firebase/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth, emailAuthProvider } from "../firebaseConfig"; // Import firebase
import { useNavigate } from "react-router-native";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null); // State for error messages

  const handleChangePassword = async () => {
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (!currentPassword || !newPassword) {
      // Basic validation
      setError("Please fill in all fields.");
      return;
    }

    try {
      const user = auth.currentUser;
      //console.log("user ==> ", user);

      if (!user) {
        setError("User not logged in. Please log in again."); // Clearer message
        // Consider navigating to login screen or showing a login prompt here
        return;
      }

      const credential = emailAuthProvider.credential(user.email, currentPassword);

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword).then(() => {
        Alert.alert("Success", "Password changed successfully!", [
          { text: "OK", onPress: () => navigate("/") },
        ]);
      });
    } catch (error) {
      console.error("Password change error:", error);

      // if (error.code === "auth/wrong-password") {
      //   setError("Incorrect current password."); // More user-friendly message
      // } else if (error.code === "auth/weak-password") {
      //   setError("Password should be at least 6 characters");
      // } else {
      //   setError("An error occurred. Please try again later.");
      // }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigate(-1)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8b4513" />
        </Pressable>
        <Text style={styles.title}>Change Password</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry={true}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="gray" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity style={styles.changeButton} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#FFFAF0",
    alignItems: "center", // Center content horizontally
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 10, // Adjust spacing as needed
  },
  input: {
    flex: 1, // Allow input to take remaining space
    height: "100%", // Input takes full height of the container
    padding: 0, // Remove default padding to avoid double padding with container
    fontSize: 16,
  },

  changeButton: {
    backgroundColor: "#f0b375",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30, // Increase horizontal padding
    marginTop: 20,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    // Style for error messages
    color: "red",
    marginBottom: 10,
  },
});

export default ChangePasswordPage;
