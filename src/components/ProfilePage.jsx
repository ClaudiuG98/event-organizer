import React from "react";
import { useNavigate } from "react-router-native";
import { View, Text, Image, StyleSheet } from "react-native"; // Import necessary components

const ProfilePage = () => {
  const navigate = useNavigate();
  const isLoggedIn = true;

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  const user = {
    name: "John Doe",
    bio: "A short bio about myself.",
    profilePicture: "https://via.placeholder.com/150",
  };

  return (
    <View style={styles.profileContainer}>
      <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
      <Text style={styles.profileName}>{user.name}</Text>
      <Text style={styles.profileBio}>{user.bio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f0f0", // Light gray background
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75, // Make it circular
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileBio: {
    fontSize: 16,
    textAlign: "center", // Center the bio text
  },
});

export default ProfilePage;
