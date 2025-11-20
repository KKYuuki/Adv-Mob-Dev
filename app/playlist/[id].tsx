import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getPlaylistById } from "../../data/playlists";
import { useTheme } from '../hooks/useTheme';

export default function PlaylistDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const playlist = typeof id === "string" ? getPlaylistById(id) : undefined;

  if (!playlist) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>Playlist not found.</Text>
          <Pressable style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryLabel}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={() => router.push("/playlists" as never)}>
            <Ionicons name="list" size={20} color="#fff" />
          </Pressable>
        </View>

        <Image source={{ uri: playlist.artwork }} style={styles.heroArt} />

        <View style={styles.metaBlock}>
          <Text style={styles.title}>{playlist.title}</Text>
          <Text style={styles.subtitle}>{playlist.description}</Text>
          <Text style={styles.meta}>
            {playlist.followers} followers · {playlist.mood}
          </Text>
        </View>

        <View style={styles.trackHeader}>
          <Text style={styles.trackHeaderLabel}>Tracks</Text>
          <Text style={styles.trackCount}>{playlist.tracks.length} songs</Text>
        </View>

        <View style={styles.trackList}>
          {playlist.tracks.map((track, index) => (
            <View key={track.id} style={styles.trackRow}>
              <View style={styles.trackIndexCircle}>
                <Text style={styles.trackIndexText}>{index + 1}</Text>
              </View>
              <View style={styles.trackCopy}>
                <Text style={styles.trackTitle}>{track.title}</Text>
                <Text style={styles.trackArtist}>{track.artist}</Text>
              </View>
              <Text style={styles.trackDuration}>{track.duration}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
  },
  heroArt: {
    width: 240,
    height: 240,
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 24,
  },
  metaBlock: {
    paddingHorizontal: 20,
    gap: 8,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: "#d4d4d4",
    fontSize: 16,
    lineHeight: 22,
  },
  meta: {
    color: "#9ca3af",
    fontSize: 14,
  },
  trackHeader: {
    marginTop: 32,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackHeaderLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  trackCount: {
    color: "#9ca3af",
  },
  trackList: {
    marginTop: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },
  trackIndexCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    alignItems: "center",
    justifyContent: "center",
  },
  trackIndexText: {
    color: "#fff",
    fontWeight: "700",
  },
  trackCopy: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  trackArtist: {
    color: "#b3b3b3",
    fontSize: 14,
  },
  trackDuration: {
    color: "#9ca3af",
    fontVariant: ["tabular-nums"],
  },
  fallbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  fallbackText: {
    color: "#fff",
    fontSize: 18,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#262626",
  },
  retryLabel: {
    color: "#fff",
    fontWeight: "700",
  },
});
