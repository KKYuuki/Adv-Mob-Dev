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
import { useTheme } from "../hooks/useTheme";

export default function LibraryScreen() {
  const { colors } = useTheme();
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Your Library</Text>
          <Pressable style={[styles.addButton, { backgroundColor: colors.primary }]}>
            <Ionicons name="add" size={22} color={colors.background} />
          </Pressable>
        </View>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.secondary }]} />}
          renderItem={({ item }) => (
            <Pressable style={styles.listRow}>
              <View style={[styles.iconCircle, { backgroundColor: colors.card }]}>
                <Ionicons name={item.icon as any} size={20} color={colors.text} />
              </View>
              <View style={styles.rowCopy}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.rowSubtitle, { color: colors.subText }]}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.subText} />
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
  },
  container: {
    flex: 1,
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
    fontSize: 28,
    fontWeight: "800",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
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
    alignItems: "center",
    justifyContent: "center",
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  rowSubtitle: {
    marginTop: 4,
  },
});
