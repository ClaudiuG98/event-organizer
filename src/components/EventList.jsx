import { View, StyleSheet, FlatList, ActivityIndicator, Text, Dimensions } from "react-native";
import EventCard from "./EventCard";
import DateBar from "./DateBar";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const EventList = ({ events, startDate, endDate, setEndDate, setStartDate }) => {
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const flatListRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    const upcoming = events.filter((event) => event.date.toDate() > now);
    const past = events.filter((event) => event.date.toDate() <= now);

    setUpcomingEvents(upcoming);
    setPastEvents(past);
  }, [events]);

  useFocusEffect(
    // Use useFocusEffect
    React.useCallback(() => {
      // useCallback is important here
      if (flatListRef.current && upcomingEvents.length > 0) {
        flatListRef.current.scrollToIndex({
          index: 1,
          animated: false,
          viewPosition: 0,
        });
      }
    }, [upcomingEvents, pastEvents]) // Include dependencies
  );

  const renderPastEvents = () => {
    return (
      <View style={styles.eventGrid}>
        {pastEvents.map((event) => (
          <View style={styles.eventItemContainer} key={event.id}>
            <EventCard event={event} past={true} />
          </View>
        ))}
      </View>
    );
  };

  const renderUpcomingEvents = () => {
    return (
      <>
        {upcomingEvents.length <= 0 && <Text style={styles.sectionHeader}>No Upcoming Events</Text>}
        <View style={styles.eventGrid}>
          {upcomingEvents.map((event) => (
            <View style={styles.eventItemContainer} key={event.id}>
              <EventCard event={event} past={false} />
            </View>
          ))}
        </View>
      </>
    );
  };

  const renderItem = ({ item, index }) => (
    <EventCard
      key={item.id}
      event={item}
      past={pastEvents.some((pastEvent) => pastEvent.id === item.id)}
    />
  );

  if (events.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f0b375" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DateBar
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
      />
      <FlatList
        ref={flatListRef}
        data={[{ key: "past" }, { key: "upcoming" }]} // Dummy data for sections
        renderItem={({ item }) =>
          item.key === "upcoming" ? renderUpcomingEvents() : renderPastEvents()
        }
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.flatListContent} // Main content container style
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF0",
  },
  sectionHeader: {
    // Style for section headers
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10, // Or adjust as needed
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 85,
  },
  eventGrid: {
    // Style for two-column grid within header/footer
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  eventItemContainer: {
    width: (width - 36) / 2, // Calculate width with margins (adjust 30 as needed)
    marginBottom: 10, // Vertical spacing between rows
  },
  columnWrapper: {
    justifyContent: "space-between", // Space evenly between columns
    marginBottom: 10, // Vertical spacing between rows
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

export default EventList;
