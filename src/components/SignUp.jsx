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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-native";
import { doc, setDoc } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async () => {
    setError(null); // Clear any previous errors

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      // Create a new document in the 'users' collection with the UID as the ID
      await setDoc(doc(db, "users", uid), {
        email: email,
        joinedEvents: [],
        createdAt: new Date(),
        profilePicture: "",
        name: "",
        createdEvents: [],
      });

      navigate("/login"); // Redirect to the home page after successful sign-up
    } catch (error) {
      setError(error.message); // Display the error message
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/events/create-account.jpg")} style={styles.image} />
      <View style={styles.header}>
        <Pressable onPress={() => navigate("/login")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8b4513" />
        </Pressable>
        <Text style={styles.title}>Create Account</Text>
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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
  backButton: {
    position: "absolute", // Take the back button out of the flow
    left: 0, // Position it to the left edge of the header
  },
  image: {
    width: "100%",
    height: 250,
    marginBottom: 20,
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default SignUp;
