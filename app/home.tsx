import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
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
import TabBar from "../components/TabBar";

interface PlaylistCard {
  id: string;
  title: string;
  subtitle: string;
  artwork: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const handleNavigate = (path: string) => router.push(path as never);
  const filters = useMemo(() => ["All", "Music", "Podcasts"], []);

  const pinnedTiles: PlaylistCard[] = useMemo(
    () => [
      {
        id: "pin-1",
        title: "2020s Mix",
        subtitle: "Playlist",
        artwork: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
      },
      {
        id: "pin-2",
        title: "Liked Songs",
        subtitle: "248 songs",
        artwork: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=200",
      },
      {
        id: "pin-3",
        title: "umamusume brainrot",
        subtitle: "Playlist",
        artwork: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200",
      },
      {
        id: "pin-4",
        title: "Daily",
        subtitle: "Playlist",
        artwork: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200",
      },
      {
        id: "pin-5",
        title: "Daily Mix 4",
        subtitle: "Mixed for you",
        artwork: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
      },
      {
        id: "pin-6",
        title: "Daily Mix 2",
        subtitle: "Mixed for you",
        artwork: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200",
      },
    ],
    []
  );

  const upcomingReleases: PlaylistCard[] = useMemo(
    () => [
      {
        id: "release-1",
        title: "FLAMES",
        subtitle: "BINI",
        artwork: "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600",
      },
      {
        id: "release-2",
        title: "美辞学",
        subtitle: "Reol",
        artwork: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
      },
    ],
    []
  );

  const jumpBackIn: PlaylistCard[] = useMemo(
    () => [
      {
        id: "jump-1",
        title: "HUNTRX Mix",
        subtitle: "Pop Demo",
        artwork: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=400",
      },
      {
        id: "jump-2",
        title: "Sakura Vibes",
        subtitle: "City Pop",
        artwork: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=400",
      },
      {
        id: "jump-3",
        title: "Lo-Fi Focus",
        subtitle: "Instrumental",
        artwork: "https://images.unsplash.com/photo-1500336624523-d727130c3328?w=400",
      },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>A</Text>
            </View>
            <View style={styles.headerActions}>
              <Pressable style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={20} color="#fff" />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Ionicons name="timer-outline" size={20} color="#fff" />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Ionicons name="settings-outline" size={20} color="#fff" />
              </Pressable>
            </View>
          </View>

          <View style={styles.filterRow}>
            {filters.map((filter, index) => (
              <Pressable
                key={filter}
              style={[
                styles.filterChip,
                index === 0 && styles.filterChipActive,
              ]}
              onPress={() => {
                if (index > 0) {
                  handleNavigate("/search");
                }
              }}
            >
              <Text
                style={[
                  styles.filterLabel,
                  index === 0 && styles.filterLabelActive,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.pinnedGrid}>
          {pinnedTiles.map((tile) => (
            <Pressable key={tile.id} style={styles.pinnedCard}>
              <Image source={{ uri: tile.artwork }} style={styles.pinnedArt} />
              <View style={styles.pinnedCopy}>
                <Text numberOfLines={1} style={styles.pinnedTitle}>
                  {tile.title}
                </Text>
                <Text numberOfLines={1} style={styles.pinnedSubtitle}>
                  {tile.subtitle}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pre-save upcoming releases</Text>
          <View style={styles.releaseGrid}>
            {upcomingReleases.map((release) => (
              <Pressable
                key={release.id}
                style={styles.releaseCard}
                onPress={() => handleNavigate("/premium")}
              >
                <Image
                  source={{ uri: release.artwork }}
                  style={styles.releaseArt}
                />
                <Text style={styles.releaseTitle}>{release.title}</Text>
                <Text style={styles.releaseSubtitle}>{release.subtitle}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jump back in</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {jumpBackIn.map((mix) => (
              <Pressable
                key={mix.id}
                style={styles.jumpCard}
                onPress={() => handleNavigate("/library")}
              >
                <Image source={{ uri: mix.artwork }} style={styles.jumpArt} />
                <View style={styles.jumpCopy}>
                  <Text style={styles.jumpTitle}>{mix.title}</Text>
                  <Text style={styles.jumpSubtitle}>{mix.subtitle}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
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
    gap: 28,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    color: "#000",
    fontWeight: "700",
    fontSize: 18,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1c1c1c",
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#1c1c1c",
  },
  filterChipActive: {
    backgroundColor: "#1DB954",
  },
  filterLabel: {
    color: "#d4d4d4",
    fontWeight: "600",
  },
  filterLabelActive: {
    color: "#000",
  },
  pinnedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  pinnedCard: {
    width: "48%",
    borderRadius: 12,
    backgroundColor: "#181818",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  pinnedArt: {
    width: 52,
    height: 52,
    borderRadius: 8,
  },
  pinnedCopy: {
    flex: 1,
  },
  pinnedTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  pinnedSubtitle: {
    color: "#9ca3af",
    marginTop: 4,
    fontSize: 12,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  releaseGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  releaseCard: {
    flex: 1,
    backgroundColor: "#181818",
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  releaseArt: {
    width: "100%",
    height: 160,
    borderRadius: 12,
  },
  releaseTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  releaseSubtitle: {
    color: "#b3b3b3",
    fontSize: 14,
  },
  horizontalList: {
    gap: 16,
    paddingBottom: 4,
  },
  jumpCard: {
    width: 200,
    borderRadius: 18,
    backgroundColor: "#181818",
    overflow: "hidden",
  },
  jumpArt: {
    width: "100%",
    height: 140,
  },
  jumpCopy: {
    padding: 14,
    gap: 4,
  },
  jumpTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  jumpSubtitle: {
    color: "#b3b3b3",
    fontSize: 13,
  },
});
