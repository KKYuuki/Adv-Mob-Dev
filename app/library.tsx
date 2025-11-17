import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TabBar from "../components/TabBar";

export default function LibraryScreen() {
  const items = useMemo(
    () => [
      { id: "1", title: "Liked Songs", subtitle: "248 songs", icon: "heart" },
      { id: "2", title: "Morning Commute", subtitle: "Playlist", icon: "bus" },
      { id: "3", title: "Downloaded", subtitle: "12 playlists", icon: "download" },
      { id: "4", title: "Podcasts", subtitle: "8 shows", icon: "mic" },
      { id: "5", title: "New Episodes", subtitle: "3 ready", icon: "radio" },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Library</Text>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={22} color="#000" />
          </Pressable>
        </View>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Pressable style={styles.listRow}>
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={20} color="#fff" />
              </View>
              <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </Pressable>
          )}
        />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#1f1f1f",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  rowSubtitle: {
    color: "#9ca3af",
    marginTop: 4,
  },
});
