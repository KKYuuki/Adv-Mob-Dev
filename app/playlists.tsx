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
import { useTheme } from "../hooks/useTheme";

export default function PlaylistsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleSelect = (playlistId: string) => {
    router.push({ pathname: "/playlist/[id]", params: { id: playlistId } } as never);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.kicker, { color: colors.subText }]}>Collections</Text>
            <Text style={[styles.title, { color: colors.text }]}>Your Playlists</Text>
          </View>
          <Pressable style={[styles.seeAllButton, { borderColor: colors.secondary }]} onPress={() => router.push("/library" as never)}>
            <Text style={[styles.seeAllText, { color: colors.text }]}>Library</Text>
          </Pressable>
        </View>

        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.secondary }]} />}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => handleSelect(item.id)}>
              <Image source={{ uri: item.artwork }} style={styles.coverArt} />
              <View style={styles.rowCopy}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.rowSubtitle, { color: colors.subText }]} numberOfLines={2}>
                  {item.description}
                </Text>
                <Text style={[styles.meta, { color: colors.subText }]}>{item.followers} followers • {item.mood}</Text>
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
    paddingBottom: 12,
  },
  kicker: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 4,
  },
  seeAllButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  seeAllText: {
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 96,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
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
    fontSize: 18,
    fontWeight: "700",
  },
  rowSubtitle: {
    fontSize: 14,
  },
  meta: {
    fontSize: 13,
  },
});
