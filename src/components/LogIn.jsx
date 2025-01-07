import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailPasswordSignIn = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email/Password Sign-In successful:", result.user);
      navigate("/");
    } catch (error) {
      console.error("Email/Password Sign-In error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/events/log-in.jpg")} style={styles.image} />
      <View style={styles.header}>
        <Pressable onPress={() => navigate("/")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8b4513" />
        </Pressable>
        <Text style={styles.title}>Log In!</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleEmailPasswordSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigate("/signup")}>
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Beige background
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5dc", // Beige
  },
  header: {
    // Style the header container
    width: "90%", // Take full width
    flexDirection: "row", // Arrange back button and title horizontally
    alignItems: "center", // Vertically center items
    justifyContent: "center", // Center the Title
    marginBottom: 20, // Add margin below the header
  },
  title: {
    // Center the title horizontally
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffa500", // Orange
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
  backButton: {
    position: "absolute", // Take the back button out of the flow
    left: 0, // Position it to the left edge of the header
  },
  backButtonText: {
    color: "#8b4513", // Brownish color
    alignItems: "center",
  },
  input: {
    // Update input styles
    height: 45,
    borderColor: "#d2b48c", // Tan border
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    width: "90%",
    backgroundColor: "#ffffe0", // Light yellow background
    color: "#8b4513", // Saddle brown text
  },

  button: {
    // Orange button
    backgroundColor: "#ffa500", // Orange
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "90%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    // White text on button
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  signupText: {
    // Style for "Don't have an account?"
    color: "#8b4513", // Brownish color
    marginTop: 10,
  },
  signupLink: {
    // Style for "Sign Up" link
    color: "#ffa500", // Orange
    fontWeight: "bold",
  },
});

export default LogIn;
