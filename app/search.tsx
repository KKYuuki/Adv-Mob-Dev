import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import TabBar from "../components/TabBar";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const genres = useMemo(
    () => [
      { id: "1", label: "Pop", color: "#f87171" },
      { id: "2", label: "Hip-Hop", color: "#38bdf8" },
      { id: "3", label: "Indie", color: "#a78bfa" },
      { id: "4", label: "Chill", color: "#34d399" },
      { id: "5", label: "Workout", color: "#fb923c" },
      { id: "6", label: "Mood", color: "#facc15" },
      { id: "7", label: "Party", color: "#f472b6" },
      { id: "8", label: "Focus", color: "#4ade80" },
    ],
    []
  );

  const trending = useMemo(
    () => [
      "BINI",
      "Reol",
      "Fred again..",
      "SZA",
      "Taylor Swift",
      "City Pop",
    ],
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View>
            <Text style={styles.heading}>Search</Text>
            <Text style={styles.subheading}>What do you want to listen to?</Text>
          </View>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9ca3af" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search artists, songs, or podcasts"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </Pressable>
            )}
          </View>

          <View>
            <Text style={styles.sectionTitle}>Browse all</Text>
            <FlatList
              data={genres}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.genreRow}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable style={[styles.genreTile, { backgroundColor: item.color }]}
                >
                  <Text style={styles.genreLabel}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>

          <View>
            <Text style={styles.sectionTitle}>Trending searches</Text>
            {trending.map((term) => (
              <Pressable key={term} style={styles.trendingRow}>
                <Ionicons name="time-outline" size={18} color="#9ca3af" />
                <Text style={styles.trendingText}>{term}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <TabBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
  },
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 24,
  },
  heading: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  subheading: {
    color: "#b3b3b3",
    marginTop: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#181818",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  genreRow: {
    justifyContent: "space-between",
    marginBottom: 14,
  },
  genreTile: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    minHeight: 100,
    justifyContent: "flex-end",
  },
  genreLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  trendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#1f1f1f",
  },
  trendingText: {
    color: "#fff",
    fontSize: 16,
  },
});
