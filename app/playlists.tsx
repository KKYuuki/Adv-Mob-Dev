import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TabBar from "../components/TabBar";
import { playlists } from "../data/playlists";

export default function PlaylistsScreen() {
  const router = useRouter();

  const handleSelect = (playlistId: string) => {
    router.push({ pathname: "/playlist/[id]", params: { id: playlistId } } as never);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Collections</Text>
            <Text style={styles.title}>Your Playlists</Text>
          </View>
          <Pressable style={styles.seeAllButton} onPress={() => router.push("/library" as never)}>
            <Text style={styles.seeAllText}>Library</Text>
          </Pressable>
        </View>

        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => handleSelect(item.id)}>
              <Image source={{ uri: item.artwork }} style={styles.coverArt} />
              <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={styles.meta}>{item.followers} followers • {item.mood}</Text>
              </View>
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
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
    paddingBottom: 12,
  },
  kicker: {
    color: "#9ca3af",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 4,
  },
  seeAllButton: {
    borderWidth: 1,
    borderColor: "#262626",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  seeAllText: {
    color: "#fff",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 96,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#1f1f1f",
  },
  row: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  coverArt: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  rowCopy: {
    flex: 1,
    gap: 6,
  },
  rowTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  rowSubtitle: {
    color: "#d4d4d4",
    fontSize: 14,
  },
  meta: {
    color: "#9ca3af",
    fontSize: 13,
  },
});
