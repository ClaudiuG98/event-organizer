import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-native";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getJoinedEventsData, getCreatedEventsData } from "../hooks/joinedEvents";
import { getCurrentUserData } from "../hooks/currentUserData";
import { auth } from "../firebaseConfig"; // Firebase auth
import imageMapping from "../hooks/imageMapping";
import CountryFlag from "react-native-country-flag";
import moment from "moment";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import Ionicons from "@expo/vector-icons/Ionicons";

const ProfilePage = () => {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          navigate("/login");
          return;
        }
        setLoading(true);

        // Fetch user data and joined events
        const userData = await getCurrentUserData();
        const joinedEventsData = await getJoinedEventsData();
        const createdEventsData = await getCreatedEventsData();
        setUser(userData);
        setJoinedEvents(joinedEventsData);
        setCreatedEvents(createdEventsData);
      } catch (err) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const unsubscribeAuth = auth.onAuthStateChanged((authUser) => {
      if (!authUser) navigate("/login");
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
  }, [navigate]);

  const navigateToSettings = () => {
    setVisible(false);
    navigate("/settings", { state: { user } });
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#f0b375" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!user) return null; // Prevent rendering if user is not fetched

  return (
    <ScrollView style={styles.profileContainer}>
      <View style={styles.menuContainer}>
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity onPress={() => setVisible(true)}>
              <Ionicons name="ellipsis-horizontal-sharp" size={24} color="black" />
            </TouchableOpacity>
          }
          onRequestClose={() => setVisible(false)}
        >
          <MenuItem onPress={() => navigateToSettings()}>
            <View style={styles.menuItemContainer}>
              <Ionicons name="settings-sharp" size={22} color="black" style={styles.menuIcon} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
          </MenuItem>
          <MenuDivider />
        </Menu>
      </View>
      <View style={styles.header}>
        <Image
          source={{ uri: user.profilePicture != "" || "https://placehold.co/150x150/png" }}
          style={styles.profilePicture}
        />
        <View style={styles.profileInfo}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CountryFlag isoCode={user.country} size={25} style={{ marginRight: 5 }} />
            <Text style={styles.profileName}>{user.name}</Text>
          </View>
          <Text style={styles.profileBio}>{user.email}</Text>
        </View>
      </View>

      {/* Joined Events */}
      <EventSection
        title="Events"
        events={joinedEvents}
        fallbackText="No events joined."
        navigate={navigate}
      />

      {/* Created Events */}
      <EventSection
        title="Hosted"
        events={createdEvents}
        fallbackText="No events hosted."
        navigate={navigate}
      />
      <View style={styles.joinedDateContainer}>
        <Text style={styles.joinedDateText}>Joined:</Text>
        <Text style={styles.joinedDate}>
          {moment(user.createdAt.toDate()).format("DD MMMM YYYY")}
        </Text>
      </View>
      <TouchableOpacity style={styles.createButton} onPress={() => navigate("/create-event")}>
        <Text style={styles.createButtonText}>Create New Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const EventSection = ({ title, events, fallbackText, navigate }) => (
  <View style={styles.eventsSection}>
    <Text style={styles.eventsTitle}>{title}:</Text>
    {events.length > 0 ? (
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventCard} onPress={() => navigate(`/event/${item.id}`)}>
            <Image
              source={
                imageMapping[item.bannerLocation]
                  ? imageMapping[item.bannerLocation]
                  : { uri: "https://picsum.photos/250/150" }
              }
              style={styles.eventImage}
            />
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
        horizontal={true} // Scroll vertically
        showsVerticalScrollIndicator={false}
      />
    ) : (
      <Text style={styles.fallbackText}>{fallbackText}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFAF0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginRight: 20,
  },
  profileInfo: {
    flexDirection: "column",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileBio: {
    fontSize: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  joinedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  joinedDateText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#a56931", // Slightly lighter color
  },
  joinedDate: {
    marginLeft: 10,
  },
  eventsSection: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d4bfa6",
  },
  createButton: {
    backgroundColor: "#f0b375",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20, // Add margin top
    marginLeft: 25,
    marginRight: 25,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: "#a56931",
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center", // Center items vertically
  },
  eventImage: {
    width: 50, // Smaller image size
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  eventDetails: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 14, // Smaller text size
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: 12, // Smaller text size
    color: "#555",
  },
  fallbackText: {
    color: "#888",
    fontStyle: "italic",
  },
  menuContainer: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 1,
  },

  menuItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  menuIcon: {
    marginRight: 5,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default ProfilePage;
