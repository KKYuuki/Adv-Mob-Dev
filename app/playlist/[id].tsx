import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import ThreeDotButton from "../../components/ThreeDotButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { getPlaylistById } from "../../data/playlists";
import { artists, Song, Artist } from "../../data/artists";
import { useTheme } from "../../hooks/useTheme";

interface UserPlaylist {
  id: string;
  name: string;
  createdAt: string;
  songs: any[];
  description?: string;
  isPrivate?: boolean;
}

export default function PlaylistDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors, isDarkMode } = useTheme();
  const [userPlaylist, setUserPlaylist] = useState<UserPlaylist | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(0));
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const openEditModal = () => {
    if (userPlaylist) {
      setPlaylistTitle(userPlaylist.name);
      setPlaylistDescription(userPlaylist.description || '');
      setIsPrivate(userPlaylist.isPrivate || false);
      setShowEditModal(true);
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeEditModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowEditModal(false);
    });
  };

  const handleSaveChanges = async () => {
    if (!userPlaylist || !playlistTitle.trim()) return;
    
    try {
      const existingPlaylists = await AsyncStorage.getItem("user_playlists");
      if (existingPlaylists) {
        const playlists = JSON.parse(existingPlaylists);
        const updatedPlaylists = playlists.map((p: UserPlaylist) => 
          p.id === userPlaylist.id ? { 
            ...p, 
            name: playlistTitle.trim(),
            description: playlistDescription.trim(),
            isPrivate
          } : p
        );
        await AsyncStorage.setItem("user_playlists", JSON.stringify(updatedPlaylists));
        setUserPlaylist({ 
          ...userPlaylist, 
          name: playlistTitle.trim(),
          description: playlistDescription.trim(),
          isPrivate
        });
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
    closeEditModal();
  };

  const handleAddSong = async (song: { id: string; title: string; artist: string; duration: string; profileImage: any }) => {
    if (!userPlaylist) return;
    
    try {
      // Check if song already exists in playlist
      const existingSongIndex = userPlaylist.songs.findIndex(s => s.id === song.id);
      
      let updatedSongs;
      if (existingSongIndex !== -1) {
        // Song exists, move it to the top
        updatedSongs = [
          song,
          ...userPlaylist.songs.filter((s, index) => index !== existingSongIndex)
        ];
        console.log(`Moved "${song.title}" to top of playlist "${userPlaylist.name}"`);
      } else {
        // Song doesn't exist, add to top
        updatedSongs = [song, ...userPlaylist.songs];
        console.log(`Added "${song.title}" to playlist "${userPlaylist.name}"`);
      }
      
      // Update the playlist
      const updatedPlaylist = {
        ...userPlaylist,
        songs: updatedSongs
      };
      
      // Update AsyncStorage
      const existingPlaylists = await AsyncStorage.getItem("user_playlists");
      if (existingPlaylists) {
        const playlists = JSON.parse(existingPlaylists);
        const updatedPlaylists = playlists.map((p: UserPlaylist) => 
          p.id === userPlaylist.id ? updatedPlaylist : p
        );
        await AsyncStorage.setItem("user_playlists", JSON.stringify(updatedPlaylists));
        
        // Update local state
        setUserPlaylist(updatedPlaylist);
      }
      
      // Show selected song in main area
      setSelectedSong(song);
      
      console.log(existingSongIndex !== -1 
        ? `Moved "${song.title}" to top of playlist "${userPlaylist.name}"`
        : `Added "${song.title}" to playlist "${userPlaylist.name}"`
      );
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  const handleSongOptions = (song: { id: string; title: string; artist: string; duration: string; profileImage: any }) => {
    setSelectedSongForOptions(song);
    setShowSongOptions(true);
  };

  const closeSongOptions = () => {
    setShowSongOptions(false);
    setSelectedSongForOptions(null);
  };

  const handleRemoveFromPlaylist = async () => {
    if (!userPlaylist || !selectedSongForOptions) return;
    
    try {
      const updatedSongs = userPlaylist.songs.filter(song => song.id !== selectedSongForOptions.id);
      const updatedPlaylist = {
        ...userPlaylist,
        songs: updatedSongs
      };
      
      const existingPlaylists = await AsyncStorage.getItem("user_playlists");
      if (existingPlaylists) {
        const playlists = JSON.parse(existingPlaylists);
        const updatedPlaylists = playlists.map((p: UserPlaylist) => 
          p.id === userPlaylist.id ? updatedPlaylist : p
        );
        await AsyncStorage.setItem("user_playlists", JSON.stringify(updatedPlaylists));
        setUserPlaylist(updatedPlaylist);
      }
      
      console.log(`Removed "${selectedSongForOptions.title}" from playlist "${userPlaylist.name}"`);
    } catch (error) {
      console.error("Error removing song from playlist:", error);
    }
    
    closeSongOptions();
  };

  const handleAddToOtherPlaylist = async () => {
    // This would open a playlist selection modal
    console.log(`Add "${selectedSongForOptions?.title}" to other playlist`);
    closeSongOptions();
  };

  const handleGoToAlbum = () => {
    console.log(`Go to album for "${selectedSongForOptions?.title}"`);
    closeSongOptions();
  };

  const handleGoToArtist = () => {
    console.log(`Go to artist "${selectedSongForOptions?.artist}"`);
    closeSongOptions();
  };

  const handleDeletePlaylist = async () => {
    if (!userPlaylist) return;
    
    try {
      const existingPlaylists = await AsyncStorage.getItem("user_playlists");
      if (existingPlaylists) {
        const playlists = JSON.parse(existingPlaylists);
        const updatedPlaylists = playlists.filter((p: UserPlaylist) => p.id !== userPlaylist.id);
        await AsyncStorage.setItem("user_playlists", JSON.stringify(updatedPlaylists));
      }
      
      // Navigate back to library
      router.replace("/(tabs)/library");
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
    closeEditModal();
  };

  // Generate random recommended songs from random artists
  const generateRandomSongs = useCallback(() => {
    const allSongs: (Song & { artist: string; profileImage: string })[] = [];
    
    // Collect all songs from all artists
    if (artists && Array.isArray(artists)) {
      artists.forEach((artist: Artist) => {
        if (artist && artist.songs && Array.isArray(artist.songs)) {
          artist.songs.forEach((song: Song) => {
            allSongs.push({
              ...song,
              artist: artist.name,
              profileImage: getArtistProfileImage(artist.name)
            });
          });
        }
      });
    }

    // If no songs found, return fallback songs
    if (allSongs.length === 0) {
      return [
        { id: 'fallback1', title: 'Blinding Lights', artist: 'The Weeknd', duration: '3:20', profileImage: require("../../assets/artist/Weeknd.png") },
        { id: 'fallback2', title: 'Levitating', artist: 'Dua Lipa', duration: '3:23', profileImage: require("../../assets/artist/Dua.png") },
        { id: 'fallback3', title: 'Save Your Tears', artist: 'The Weeknd', duration: '3:35', profileImage: require("../../assets/artist/Weeknd.png") },
        { id: 'fallback4', title: 'Good 4 U', artist: 'Olivia Rodrigo', duration: '2:58', profileImage: require("../../assets/artist/Olivia.jpg") },
        { id: 'fallback5', title: 'Stay', artist: 'The Kid LAROI', duration: '2:21', profileImage: require("../../assets/artist/LAROI.jpg") },
      ];
    }

    // Shuffle and take 5 random songs
    const shuffled = allSongs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, []);

  // Helper function to get artist profile image
  const getArtistProfileImage = (artistName: string) => {
    const imageMap: { [key: string]: any } = {
      'The Weeknd': require("../../assets/artist/Weeknd.png"),
      'Dua Lipa': require("../../assets/artist/Dua.png"),
      'Olivia Rodrigo': require("../../assets/artist/Olivia.jpg"),
      'The Kid LAROI': require("../../assets/artist/LAROI.jpg"),
      'Justin Bieber': require("../../assets/artist/Justin.jpeg"),
      'Taylor Swift': require("../../assets/artist/Taylor.jpg"),
      'Drake': require("../../assets/artist/Drake.jpg"),
      'Billie Eilish': require("../../assets/artist/Billie.jpg"),
    };
    return imageMap[artistName] || require("../../assets/artist/Weeknd.png"); // fallback
  };

  const recommendedSongs = generateRandomSongs();
  const [selectedSong, setSelectedSong] = useState<{ id: string; title: string; artist: string; duration: string; profileImage: any } | null>(null);
  const [showSongOptions, setShowSongOptions] = useState(false);
  const [selectedSongForOptions, setSelectedSongForOptions] = useState<{ id: string; title: string; artist: string; duration: string; profileImage: any } | null>(null);

  const loadUserPlaylist = useCallback(async () => {
    try {
      if (!id) return;
      
      // First try to get from user playlists (newly created ones)
      const existingPlaylists = await AsyncStorage.getItem("user_playlists");
      if (existingPlaylists) {
        const playlists = JSON.parse(existingPlaylists);
        const foundPlaylist = playlists.find((p: UserPlaylist) => p.id === id);
        if (foundPlaylist) {
          setUserPlaylist(foundPlaylist);
          setPlaylistTitle(foundPlaylist.name);
          setLoading(false);
          return;
        }
      }
      
      // Fallback to existing data
      setLoading(false);
    } catch (error) {
      console.error("Error loading playlist:", error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadUserPlaylist();
  }, [loadUserPlaylist]);

  const playlist = typeof id === "string" ? getPlaylistById(id) : undefined;

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (userPlaylist) {
    // Show newly created playlist (blank for now)
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <LinearGradient
          colors={[colors.card, colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientContainer}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable style={[styles.iconButton, { backgroundColor: colors.card }]} onPress={() => router.replace("/(tabs)/library")}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </Pressable>
          </View>

          <View style={[styles.heroArt, { backgroundColor: colors.secondary }]}>
            <Ionicons name="musical-notes" size={120} color={colors.primary} />
          </View>

          <View style={styles.metaBlock}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, styles.underlineTitle, { color: colors.text }]}>{userPlaylist.name}</Text>
              <Pressable style={[styles.changeButton, { backgroundColor: colors.primary }]} onPress={openEditModal}>
                <Text style={styles.changeButtonText}>Change</Text>
              </Pressable>
            </View>
            <Text style={[styles.subtitle, { color: colors.subText }]}>Your personal playlist</Text>
            <Text style={[styles.meta, { color: colors.subText }]}>
              {userPlaylist.songs.length} songs · Created by you
            </Text>
          </View>

          <View style={styles.addButtonContainer}>
            {selectedSong ? (
              <View style={[styles.selectedSongContainer, { backgroundColor: colors.card }]}>
                <Image source={selectedSong.profileImage} style={styles.selectedSongImage} />
                <View style={styles.selectedSongInfo}>
                  <Text style={[styles.selectedSongTitle, { color: colors.text }]}>{selectedSong.title}</Text>
                  <Text style={[styles.selectedSongArtist, { color: colors.subText }]}>{selectedSong.artist}</Text>
                </View>
              </View>
            ) : (
              <Pressable style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={() => {}}>
                <Text style={styles.addButtonText}>Add to this playlist</Text>
              </Pressable>
            )}
          </View>

          {userPlaylist.songs.length > 0 && (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Playlist songs</Text>
            </View>
          )}

          <View style={styles.artistFoldersContainer}>
            {userPlaylist.songs.map((song, index) => (
              <View key={song.id} style={[styles.playlistSongItem, { backgroundColor: colors.card }]}>
                <Image source={song.profileImage} style={styles.playlistSongImage} />
                <View style={styles.playlistSongInfo}>
                  <Text style={[styles.playlistSongTitle, { color: colors.text }]}>{song.title}</Text>
                  <Text style={[styles.playlistSongArtist, { color: colors.subText }]}>{song.artist}</Text>
                </View>
                <ThreeDotButton onPress={() => handleSongOptions(song)} />
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended songs</Text>
          </View>

          <View style={styles.artistFoldersContainer}>
            {recommendedSongs.map((song) => (
              <View key={song.id} style={[styles.artistFolder, { backgroundColor: colors.card }]}>
                <View style={styles.artistInfo}>
                  <Image source={song.profileImage} style={styles.artistImage} />
                  <View style={styles.artistDetails}>
                    <Text style={[styles.songName, { color: colors.text }]}>{song.title}</Text>
                    <Text style={[styles.artistName, { color: colors.subText }]}>{song.artist}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[styles.addSongButton, { backgroundColor: colors.secondary }]} onPress={() => handleAddSong(song)}>
                  <Ionicons name="add" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        <Modal
          visible={showEditModal}
          transparent={true}
          animationType="none"
          onRequestClose={closeEditModal}
        >
          <Pressable style={styles.modalOverlay} onPress={closeEditModal}>
            <Animated.View 
              style={[
                styles.editModal,
                {
                  transform: [
                    {
                      translateY: modalAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeEditModal}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Name & Details</Text>
                <TouchableOpacity onPress={handleSaveChanges}>
                  <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalContent}>
                <View style={styles.playlistIconContainer}>
                  <View style={[styles.modalPlaylistIcon, { backgroundColor: '#1a1a1a' }]}>
                    <Ionicons name="musical-notes" size={48} color="#1DB954" />
                  </View>
                  <TouchableOpacity style={styles.changeIconButton}>
                    <Ionicons name="camera" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                
                <TextInput
                  style={styles.modalTitleInput}
                  value={playlistTitle}
                  onChangeText={setPlaylistTitle}
                  placeholder="Playlist name"
                  placeholderTextColor="#666"
                  multiline={false}
                />
                
                <TextInput
                  style={styles.modalDescriptionInput}
                  value={playlistDescription}
                  onChangeText={setPlaylistDescription}
                  placeholder="Add an optional description"
                  placeholderTextColor="#666"
                  multiline
                  numberOfLines={3}
                />
                
                <View style={styles.privacySection}>
                  <TouchableOpacity 
                    style={styles.privacyOption}
                    onPress={() => setIsPrivate(!isPrivate)}
                  >
                    <View style={[styles.checkbox, isPrivate && styles.checkboxChecked]}>
                      {isPrivate && <Ionicons name="checkmark" size={16} color="#fff" />}
                    </View>
                    <Text style={styles.privacyText}>Make private</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity style={styles.deleteOption} onPress={handleDeletePlaylist}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                  <Text style={styles.deleteText}>Delete playlist</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </Modal>

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
                  <Image source={selectedSongForOptions.profileImage} style={styles.playlistSongImage} />
                  <View style={styles.playlistSongInfo}>
                    <Text style={styles.playlistSongTitle}>{selectedSongForOptions.title}</Text>
                    <Text style={styles.playlistSongArtist}>{selectedSongForOptions.artist}</Text>
                  </View>
                  <TouchableOpacity onPress={closeSongOptions}>
                    <Ionicons name="close" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.songOptionsList}>
                <TouchableOpacity style={styles.songOptionItem} onPress={handleAddToOtherPlaylist}>
                  <Ionicons name="add-circle-outline" size={24} color="#1DB954" />
                  <Text style={styles.songOptionText}>Add to other playlist</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.songOptionItem} onPress={handleRemoveFromPlaylist}>
                  <Ionicons name="remove-circle-outline" size={24} color="#FF3B30" />
                  <Text style={styles.songOptionText}>Remove from this playlist</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.songOptionItem} onPress={handleGoToAlbum}>
                  <Ionicons name="albums-outline" size={24} color="#fff" />
                  <Text style={styles.songOptionText}>Go to album</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.songOptionItem} onPress={handleGoToArtist}>
                  <Ionicons name="person-outline" size={24} color="#fff" />
                  <Text style={styles.songOptionText}>Go to artist</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!playlist) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[styles.fallbackContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.fallbackText, { color: colors.text }]}>Playlist not found.</Text>
          <Pressable style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => router.back()}>
            <Text style={styles.retryLabel}>Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable style={[styles.iconButton, { backgroundColor: colors.card }]} onPress={() => router.replace("/(tabs)/library")}>
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <Pressable style={[styles.iconButton, { backgroundColor: colors.card }]} onPress={() => router.push("/playlists" as never)}>
            <Ionicons name="list" size={20} color={colors.text} />
          </Pressable>
        </View>

        <Image source={{ uri: playlist.artwork }} style={styles.heroArt} />

        <View style={styles.metaBlock}>
          <Text style={[styles.title, { color: colors.text }]}>{playlist.title}</Text>
          <Text style={[styles.subtitle, { color: colors.subText }]}>{playlist.description}</Text>
          <Text style={[styles.meta, { color: colors.subText }]}>
            {playlist.followers} followers · {playlist.mood}
          </Text>
        </View>

        <View style={styles.trackHeader}>
          <Text style={[styles.trackHeaderLabel, { color: colors.text }]}>Tracks</Text>
          <Text style={[styles.trackCount, { color: colors.subText }]}>{playlist.tracks.length} songs</Text>
        </View>

        <View style={[styles.trackList, { backgroundColor: colors.background }]}>
          {playlist.tracks.map((track, index) => (
            <View key={track.id} style={[styles.trackRow, { backgroundColor: colors.card }]}>
              <View style={[styles.trackIndexCircle, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.trackIndexText, { color: colors.text }]}>{index + 1}</Text>
              </View>
              <View style={styles.trackCopy}>
                <Text style={[styles.trackTitle, { color: colors.text }]}>{track.title}</Text>
                <Text style={[styles.trackArtist, { color: colors.subText }]}>{track.artist}</Text>
              </View>
              <Text style={[styles.trackDuration, { color: colors.subText }]}>{track.duration}</Text>
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
    paddingTop: 60,
  },
  gradientContainer: {
    flex: 1,
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
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF3B30",
    alignItems: "center",
    justifyContent: "center",
  },
  heroArt: {
    width: 280,
    height: 280,
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
  },
  titleInput: {
    borderBottomWidth: 2,
    borderBottomColor: "#1DB954",
  },
  underlineTitle: {
    textDecorationLine: "underline",
    textDecorationColor: "#1DB954",
  },
  changeButton: {
    backgroundColor: "#1DB954",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  changeButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionHeader: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  addButtonContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  addButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  artistFoldersContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  artistFolder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  artistImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistDetails: {
    gap: 2,
  },
  artistName: {
    color: '#b3b3b3',
    fontSize: 16,
    fontWeight: 'normal',
  },
  songName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  songDuration: {
    color: '#666',
    fontSize: 14,
  },
  songNumber: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  songNumberText: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '500',
  },
  playlistSongItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 16,
  },
  playlistSongImage: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  playlistSongInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  playlistSongTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  playlistSongArtist: {
    color: '#b3b3b3',
    fontSize: 16,
    marginTop: 2,
  },
  songOptionsModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    marginBottom: 20,
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
  addSongButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedConfirmation: {
    width: 60,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedText: {
    color: '#1DB954',
    fontSize: 12,
    fontWeight: '600',
  },
  addedConfirmationMain: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedTextMain: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedSongContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedSongImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  selectedSongInfo: {
    flex: 1,
    marginLeft: 16,
  },
  selectedSongTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedSongArtist: {
    color: '#b3b3b3',
    fontSize: 14,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  editModal: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  cancelButton: {
    color: '#fff',
    fontSize: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    color: '#1DB954',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },
  playlistIconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  modalPlaylistIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  changeIconButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#1DB954',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#282828',
  },
  modalTitleInput: {
    backgroundColor: '#404040',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    borderRadius: 8,
  },
  modalDescriptionInput: {
    backgroundColor: '#404040',
    color: '#fff',
    fontSize: 14,
    padding: 16,
    borderRadius: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  privacySection: {
    gap: 16,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1DB954',
    borderColor: '#1DB954',
  },
  privacyText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  metaBlock: {
    paddingHorizontal: 20,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    gap: 16,
  },
  emptyText: {
    color: "#b3b3b3",
    fontSize: 18,
    textAlign: "center",
  },
});
