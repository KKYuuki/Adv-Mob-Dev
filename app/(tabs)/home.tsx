import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TabBar from "../../components/TabBar";
import SideNavigation from "../../components/SideNavigation";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../contexts/AuthContext";

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
  const { colors } = useTheme();
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [sideNavVisible, setSideNavVisible] = useState(false);
  const slideAnimation = useState(new Animated.Value(-300))[0];

  const openSideNav = () => {
    setSideNavVisible(true);
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeSideNav = () => {
    Animated.timing(slideAnimation, {
      toValue: -300,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setSideNavVisible(false);
    });
  };

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
      <StatusBar barStyle={colors.text === '#000000' ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable onPress={openSideNav}>
              {user?.profilePicture ? (
                <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.avatarInitial, { color: colors.background }]}>
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </Text>
                </View>
              )}
            </Pressable>
            
            <View style={styles.filterRow}>
              {filters.map((filter) => {
                const isSelected = selectedFilter === filter;
                return (
                  <Pressable
                    key={filter}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                      },
                    ]}
                    onPress={() => setSelectedFilter(filter)}
                  >
                    <Text
                      style={[
                        styles.filterLabel,
                        {
                          color: isSelected ? "#000000" : colors.subText,
                        },
                      ]}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {selectedFilter === "All" && (
            <>
              <View style={styles.pinnedGrid}>
                {pinnedTiles.map((tile) => (
                  <Pressable
                    key={tile.id}
                    style={[styles.pinnedCard, { backgroundColor: colors.card }]}
                  >
                    <Image source={{ uri: tile.artwork }} style={styles.pinnedArt} />
                    <View style={styles.pinnedCopy}>
                      <Text
                        numberOfLines={1}
                        style={[styles.pinnedTitle, { color: colors.text }]}
                      >
                        {tile.title}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[styles.pinnedSubtitle, { color: colors.subText }]}
                      >
                        {tile.subtitle}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Pre-save upcoming releases
                </Text>
                <View style={styles.releaseGrid}>
                  {upcomingReleases.map((release) => (
                    <Pressable
                      key={release.id}
                      style={[styles.releaseCard, { backgroundColor: colors.card }]}
                      onPress={() => handleNavigate("/premium")}
                    >
                      <Image
                        source={{ uri: release.artwork }}
                        style={styles.releaseArt}
                      />
                      <Text style={[styles.releaseTitle, { color: colors.text }]}>
                        {release.title}
                      </Text>
                      <Text
                        style={[styles.releaseSubtitle, { color: colors.subText }]}
                      >
                        {release.subtitle}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Jump back in</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                >
                  {jumpBackIn.map((mix) => (
                    <Pressable
                      key={mix.id}
                      style={[styles.jumpCard, { backgroundColor: colors.card }]}
                      onPress={() => handleNavigate("/library")}
                    >
                      <Image source={{ uri: mix.artwork }} style={styles.jumpArt} />
                      <View style={styles.jumpCopy}>
                        <Text style={[styles.jumpTitle, { color: colors.text }]}>
                          {mix.title}
                        </Text>
                        <Text
                          style={[styles.jumpSubtitle, { color: colors.subText }]}
                        >
                          {mix.subtitle}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </>
          )}

          {selectedFilter === "Music" && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Music
              </Text>
              {/* Add your Music-only content here */}
            </View>
          )}

          {selectedFilter === "Podcasts" && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Podcasts
              </Text>
              {/* Add your Podcasts-only content here */}
            </View>
          )}
        </ScrollView>
        <TabBar />
      </View>
      
      <SideNavigation
        visible={sideNavVisible}
        onClose={closeSideNav}
        slideAnimation={slideAnimation}
      />
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
    paddingTop: 40,
    paddingBottom: 32,
    gap: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontWeight: "700",
    fontSize: 18,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginLeft: 16,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  filterLabel: {
    fontWeight: "600",
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
    fontWeight: "700",
    fontSize: 14,
  },
  pinnedSubtitle: {
    marginTop: 4,
    fontSize: 12,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
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
    fontSize: 18,
    fontWeight: "700",
  },
  releaseSubtitle: {
    fontSize: 14,
  },
  horizontalList: {
    gap: 16,
    paddingBottom: 4,
  },
  jumpCard: {
    width: 200,
    borderRadius: 18,
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
    fontSize: 16,
    fontWeight: "700",
  },
  jumpSubtitle: {
    fontSize: 13,
  },
});
