import { useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TabBar from "../../components/TabBar";
import SideNavigation from "../../components/SideNavigation";
import ThreeDotButton from "../../components/ThreeDotButton";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../contexts/AuthContext";
import { artists, Song } from "../../data/artists";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
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

  const getRandomSongs = (count: number): Song[] => {
    const allSongs: Song[] = [];
    artists.forEach(artist => {
      allSongs.push(...artist.songs);
    });
    
    const shuffled = [...allSongs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getSongsByArtist = (artistName: string): Song[] => {
    const artist = artists.find(a => a.name === artistName);
    return artist ? artist.songs.slice(0, 3) : [];
  };

  const startListeningSongs = useMemo(() => getRandomSongs(3), []);
  const weekndSongs = useMemo(() => getSongsByArtist("The Weeknd"), []);

  // Modal state
  const [showSongOptions, setShowSongOptions] = useState(false);
  const [selectedSongForOptions, setSelectedSongForOptions] = useState<Song | null>(null);

  // Helper function to get artist profile image
  const getArtistProfileImage = (artistName: string) => {
    const artist = artists.find(a => a.name === artistName);
    if (!artist) return null;
    
    // Map artist names to their local image paths
    const imageMap: { [key: string]: any } = {
      "The Weeknd": require("../../assets/artist/Weeknd.png"),
      "Dua Lipa": require("../../assets/artist/Dua.png"),
      "Olivia Rodrigo": require("../../assets/artist/Olivia.jpg"),
      "The Kid LAROI": require("../../assets/artist/LAROI.jpg"),
      "Justin Bieber": require("../../assets/artist/Justin.jpeg"),
      "Taylor Swift": require("../../assets/artist/Taylor.jpg"),
      "Drake": require("../../assets/artist/Drake.jpg"),
      "Billie Eilish": require("../../assets/artist/Billie.jpg"),
    };
    
    return imageMap[artist.name] || null;
  };

  // Modal handlers
  const handleSongOptions = (song: Song) => {
    setSelectedSongForOptions(song);
    setShowSongOptions(true);
  };

  const closeSongOptions = () => {
    setShowSongOptions(false);
    setSelectedSongForOptions(null);
  };

  const handleAddToPlaylist = async () => {
    if (!selectedSongForOptions) return;
    
    try {
      // Get existing playlists
      const existingPlaylists = await AsyncStorage.getItem("user_playlists");
      let playlists = existingPlaylists ? JSON.parse(existingPlaylists) : [];
      
      if (playlists.length === 0) {
        // Create a default playlist if none exist
        const defaultPlaylist = {
          id: Date.now().toString(),
          name: "My Playlist",
          createdAt: new Date().toISOString(),
          songs: [selectedSongForOptions],
          description: "Default playlist",
          isPrivate: false
        };
        playlists.push(defaultPlaylist);
        console.log(`Created default playlist and added "${selectedSongForOptions.title}"`);
      } else {
        // Add to the first playlist, avoiding duplicates
        const firstPlaylist = playlists[0];
        const existingSongIndex = firstPlaylist.songs.findIndex((s: any) => s.id === selectedSongForOptions.id);
        
        if (existingSongIndex === -1) {
          // Song doesn't exist, add to top
          firstPlaylist.songs.unshift(selectedSongForOptions);
          console.log(`Added "${selectedSongForOptions.title}" to playlist "${firstPlaylist.name}"`);
        } else {
          // Song already exists, move to top
          const song = firstPlaylist.songs.splice(existingSongIndex, 1)[0];
          firstPlaylist.songs.unshift(song);
          console.log(`Moved "${selectedSongForOptions.title}" to top of playlist "${firstPlaylist.name}"`);
        }
      }
      
      // Save to AsyncStorage
      await AsyncStorage.setItem("user_playlists", JSON.stringify(playlists));
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
    
    closeSongOptions();
  };

  const handleGoToArtist = () => {
    console.log('Go to artist:', selectedSongForOptions);
    // TODO: Navigate to artist page
    closeSongOptions();
  };

  const handleAddToQueue = () => {
    console.log('Add to queue:', selectedSongForOptions?.title);
    // TODO: Implement add to queue functionality
    closeSongOptions();
  };

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
              {/* Start listening section */}
              <View style={styles.section}>
                <Text style={[styles.sectionSubtitle, { color: colors.subText }]}>
                  Jump into a session based on your tastes
                </Text>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Start listening
                </Text>
                <View style={styles.horizontalSongList}>
                  {startListeningSongs.map((song) => {
                    const artist = artists.find(a => a.songs.some(s => s.id === song.id));
                    const profileImage = getArtistProfileImage(artist?.name || "");
                    return (
                      <View key={song.id} style={styles.horizontalSongCard}>
                        {profileImage && <Image source={profileImage} style={styles.songProfileImage} />}
                        <View style={styles.songInfo}>
                          <Text style={[styles.songTitle, { color: colors.text }]}>{song.title}</Text>
                          <Text style={[styles.songArtist, { color: colors.subText }]}>{artist?.name}</Text>
                        </View>
                        <View style={styles.songActions}>
                          <ThreeDotButton onPress={() => handleSongOptions(song)} />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* To get you started section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  To get you started
                </Text>
                <FlatList
                  data={getRandomSongs(6)}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const artist = artists.find(a => a.songs.some(s => s.id === item.id));
                    const profileImage = getArtistProfileImage(artist?.name || "");
                    return (
                      <Pressable style={[styles.recommendedSongCard, { backgroundColor: colors.card }]}>
                        {profileImage && <Image source={profileImage} style={styles.recommendedSongImage} />}
                        <Text style={styles.recommendedArtistName}>{artist?.name}</Text>
                      </Pressable>
                    );
                  }}
                  contentContainerStyle={styles.songListContainer}
                />
              </View>

              {/* More like Weeknd section */}
              <View style={styles.section}>
                <View style={styles.artistHeader}>
                  <Image source={require("../../assets/artist/Weeknd.png")} style={styles.artistProfileImageSmall} />
                  <View style={styles.artistTextContainer}>
                    <Text style={[styles.moreLikeText, { color: colors.subText }]}>More like</Text>
                    <Text style={[styles.artistName, { color: colors.text }]}>The Weeknd</Text>
                  </View>
                </View>
                <View style={styles.artistSongs}>
                  {weekndSongs.map((song) => (
                    <Pressable key={song.id} style={[styles.weekndSongCard, { backgroundColor: colors.card }]}>
                      <Image source={require("../../assets/artist/Weeknd.png")} style={styles.weekndSongImage} />
                      <Text style={styles.weekndSongTitle}>{song.title}</Text>
                    </Pressable>
                  ))}
                </View>
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

      {/* Song Options Modal */}
      <Modal
        visible={showSongOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSongOptions}
      >
        <Pressable style={styles.modalOverlay} onPress={closeSongOptions}>
          <View style={styles.songOptionsModal}>
            <View style={styles.songOptionsHeader}>
                <View style={styles.headerSpacer} />
              </View>
            
            {selectedSongForOptions && (
              <View style={styles.selectedSongInModal}>
                <Image source={getArtistProfileImage(artists.find(a => a.songs.some(s => s.id === selectedSongForOptions.id))?.name || "")} style={styles.songProfileImage} />
                <View style={styles.songInfo}>
                  <Text style={[styles.songTitle, { color: '#fff' }]}>{selectedSongForOptions.title}</Text>
                  <Text style={[styles.songArtist, { color: '#b3b3b3' }]}>{artists.find(a => a.songs.some(s => s.id === selectedSongForOptions.id))?.name}</Text>
                </View>
                <TouchableOpacity onPress={closeSongOptions}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.songOptionsList}>
              <TouchableOpacity style={styles.songOptionItem} onPress={handleAddToPlaylist}>
                <Ionicons name="add-circle-outline" size={24} color="#1DB954" />
                <Text style={styles.songOptionText}>Add to playlist</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.songOptionItem} onPress={handleGoToArtist}>
                <Ionicons name="person-outline" size={24} color="#fff" />
                <Text style={styles.songOptionText}>Go to artist</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.songOptionItem} onPress={handleAddToQueue}>
                <Ionicons name="add-circle-outline" size={24} color="#1DB954" />
                <Text style={styles.songOptionText}>Add to queue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
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
    paddingBottom: 150,
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
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 2,
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
  // New styles for song cards
  songListContainer: {
    paddingHorizontal: 0,
    gap: 12,
  },
  songCard: {
    width: 200,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
    gap: 4,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 14,
  },
  horizontalSongList: {
    flexDirection: 'column',
    gap: 8,
  },
  horizontalSongCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    gap: 10,
    backgroundColor: 'transparent',
  },
  songProfileImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  songActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  recommendedSongCard: {
    width: 140,
    borderRadius: 12,
    marginRight: 12,
    position: 'relative',
  },
  recommendedSongImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  recommendedArtistName: {
    fontSize: 14,
    fontWeight: '500',
    position: 'absolute',
    bottom: 8,
    left: 8,
    color: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  // Weeknd section styles
  artistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  artistProfileImageSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  artistTextContainer: {
    flex: 1,
  },
  moreLikeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  artistName: {
    fontSize: 20,
    fontWeight: '700',
  },
  artistSongs: {
    flexDirection: 'row',
    gap: 12,
  },
  weekndSongCard: {
    width: 140,
    borderRadius: 12,
    marginRight: 12,
    position: 'relative',
  },
  weekndSongImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  weekndSongTitle: {
    fontSize: 14,
    fontWeight: '500',
    position: 'absolute',
    bottom: -20,
    left: 0,
    color: '#b3b3b3',
  },
  // Artist section styles
  artistSection: {
    gap: 16,
  },
  artistProfileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  artistSongCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  artistSongImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  artistSongInfo: {
    flex: 1,
    gap: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  songOptionsModal: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 10,
  },
  songOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  songOptionsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  headerSpacer: {
    flex: 1,
  },
  selectedSongInModal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  songOptionsList: {
    paddingHorizontal: 20,
  },
  songOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  songOptionText: {
    color: '#fff',
    fontSize: 16,
  },
});
