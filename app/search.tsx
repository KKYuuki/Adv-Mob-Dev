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
import { useTheme } from "../hooks/useTheme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const { colors } = useTheme();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View>
            <Text style={[styles.heading, { color: colors.text }]}>Search</Text>
            <Text style={[styles.subheading, { color: colors.subText }]}>What do you want to listen to?</Text>
          </View>
          <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
            <Ionicons name="search" size={20} color={colors.subText} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search artists, songs, or podcasts"
              placeholderTextColor={colors.subText}
              style={[styles.input, { color: colors.text }]}
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={20} color={colors.subText} />
              </Pressable>
            )}
          </View>

          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Browse all</Text>
            <FlatList
              data={genres}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.genreRow}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <Pressable style={[styles.genreTile, { backgroundColor: item.color }]}
                >
                  <Text style={[styles.genreLabel, { color: colors.text }]}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>

          <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending searches</Text>
            {trending.map((term) => (
              <Pressable key={term} style={[styles.trendingRow, { borderBottomColor: colors.secondary }]}>
                <Ionicons name="time-outline" size={18} color={colors.subText} />
                <Text style={[styles.trendingText, { color: colors.text }]}>{term}</Text>
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
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
  },
  subheading: {
    marginTop: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  sectionTitle: {
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
    fontSize: 18,
    fontWeight: "700",
  },
  trendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  trendingText: {
    fontSize: 16,
  },
});
