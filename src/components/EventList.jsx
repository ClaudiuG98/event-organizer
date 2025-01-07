import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from "react-native";
import EventCard from "./EventCard";
import DateBar from "./DateBar";

const EventList = ({ events, startDate, endDate, setEndDate, setStartDate }) => {
  return events.length > 0 ? (
    <View style={styles.container}>
      <DateBar
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  ) : (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#f0b375" />
      <Text style={styles.loadingText}>Loading events...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF0",
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 85,
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
