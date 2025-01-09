import { View, StyleSheet, FlatList, ActivityIndicator, Text } from "react-native";
import EventCard from "./EventCard";
import DateBar from "./DateBar";

const EventList = ({ events, startDate, endDate, setEndDate, setStartDate }) => {
  const renderItem = ({ item }) => <EventCard key={item.id} event={item} />;

  return events.length > 0 ? (
    <View style={styles.container}>
      <DateBar
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
      />
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
        numColumns={2} // Display 2 columns
        columnWrapperStyle={styles.columnWrapper} // Add spacing between columns
      />
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
  flatListContent: {
    paddingHorizontal: 10, // Reduced horizontal padding
    paddingTop: 10, // Reduced top padding
    paddingBottom: 85,
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
