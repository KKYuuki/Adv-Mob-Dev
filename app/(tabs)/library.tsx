import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Animated,
} from "react-native";
import TabBar from "../../components/TabBar";
import PlaylistCreationModal from "../../components/PlaylistCreationModal";
import { useTheme } from "../../hooks/useTheme";

interface UserPlaylist {
  id: string;
  name: string;
  createdAt: string;
  songs: any[];
}

export default function LibraryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<UserPlaylist | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [pressedPlaylistId, setPressedPlaylistId] = useState<string | null>(null);
  const modalAnimation = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    loadUserPlaylists();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserPlaylists(); // Refresh playlists when page comes into focus
    }, [])
  );

  const handlePlaylistLongPress = (playlist: UserPlaylist) => {
    setSelectedPlaylist(playlist);
    setShowPlaylistModal(true);
    setPressedPlaylistId(null); // Clear pressed state when modal opens
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePlaylistModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowPlaylistModal(false);
      setSelectedPlaylist(null);
      setPressedPlaylistId(null); // Clear pressed state when modal closes
    });
  };

  const handleDeletePlaylist = async () => {
    if (!selectedPlaylist) return;
    
    try {
      const existingPlaylists = await AsyncStorage.getItem("user_playlists");
      if (existingPlaylists) {
        const playlists = JSON.parse(existingPlaylists);
        const updatedPlaylists = playlists.filter((p: UserPlaylist) => p.id !== selectedPlaylist.id);
        await AsyncStorage.setItem("user_playlists", JSON.stringify(updatedPlaylists));
        setUserPlaylists(updatedPlaylists.reverse());
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
    closePlaylistModal();
  };

  const handlePinPlaylist = async () => {
    if (!selectedPlaylist) return;
    // Implement pin functionality here
    console.log("Pin playlist:", selectedPlaylist.name);
    closePlaylistModal();
  };

  const loadUserPlaylists = async () => {
    try {
      const existingPlaylists = await AsyncStorage.getItem("user_playlists");
      if (existingPlaylists) {
        const playlists = JSON.parse(existingPlaylists);
        setUserPlaylists(playlists.reverse()); // Show newest first
      }
    } catch (error) {
      console.error("Error loading playlists:", error);
    }
  };
  
  const filters = useMemo(() => ["All", "Playlists", "Artists"], []);
  
  const artists = useMemo(
    () => [
      { id: "1", name: "The Weeknd", profileImage: require("../../assets/artist/Weeknd.png") },
      { id: "2", name: "Dua Lipa", profileImage: require("../../assets/artist/Dua.png") },
      { id: "3", name: "Olivia Rodrigo", profileImage: require("../../assets/artist/Olivia.jpg") },
      { id: "4", name: "The Kid LAROI", profileImage: require("../../assets/artist/LAROI.jpg") },
      { id: "5", name: "Justin Bieber", profileImage: require("../../assets/artist/Justin.jpeg") },
      { id: "6", name: "Taylor Swift", profileImage: require("../../assets/artist/Taylor.jpg") },
      { id: "7", name: "Drake", profileImage: require("../../assets/artist/Drake.jpg") },
      { id: "8", name: "Billie Eilish", profileImage: require("../../assets/artist/Billie.jpg") },
    ],
    []
  );

  const renderContent = () => {
    if (selectedFilter === "Playlists") {
      return (
        <View style={styles.userPlaylistsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Playlists</Text>
          <View style={styles.playlistsList}>
            {userPlaylists.map((playlist) => (
              <Pressable
                key={playlist.id}
                style={[
                  styles.playlistRow,
                  pressedPlaylistId === playlist.id && styles.playlistRowPressed
                ]}
                onPress={() => router.push(`/playlist/${playlist.id}` as never)}
                onLongPress={() => handlePlaylistLongPress(playlist)}
                delayLongPress={500}
                onPressIn={() => setPressedPlaylistId(playlist.id)}
                onPressOut={() => setPressedPlaylistId(null)}
              >
                <View style={[styles.playlistIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name="musical-notes" size={20} color="#000000" />
                </View>
                <View style={styles.playlistInfo}>
                  <Text style={[styles.playlistName, { color: colors.text }]}>{playlist.name}</Text>
                  <Text style={[styles.playlistSubtitle, { color: colors.subText }]}>
                    {playlist.songs.length} songs • Created by you
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      );
    } else if (selectedFilter === "Artists") {
      return (
        <View style={styles.userPlaylistsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Artists</Text>
          <View style={styles.playlistsList}>
            {artists.map((artist) => (
              <Pressable key={artist.id} style={styles.playlistRow}>
                <Image source={artist.profileImage} style={styles.artistProfileImage} />
                <View style={styles.playlistInfo}>
                  <Text style={[styles.playlistName, { color: colors.text }]}>{artist.name}</Text>
                  <Text style={[styles.playlistSubtitle, { color: colors.subText }]}>Artist</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      );
    } else {
      // All - show both playlists and artists
      return (
        <View>
          {userPlaylists.length > 0 && (
            <View style={styles.userPlaylistsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Playlists</Text>
              <View style={styles.playlistsList}>
                {userPlaylists.map((playlist) => (
                  <Pressable
                    key={playlist.id}
                    style={[
                      styles.playlistRow,
                      pressedPlaylistId === playlist.id && styles.playlistRowPressed
                    ]}
                    onPress={() => router.push(`/playlist/${playlist.id}` as never)}
                    onLongPress={() => handlePlaylistLongPress(playlist)}
                    delayLongPress={500}
                    onPressIn={() => setPressedPlaylistId(playlist.id)}
                    onPressOut={() => setPressedPlaylistId(null)}
                  >
                    <View style={[styles.playlistIcon, { backgroundColor: colors.primary }]}>
                      <Ionicons name="musical-notes" size={20} color="#000000" />
                    </View>
                    <View style={styles.playlistInfo}>
                      <Text style={[styles.playlistName, { color: colors.text }]}>{playlist.name}</Text>
                      <Text style={[styles.playlistSubtitle, { color: colors.subText }]}>
                        {playlist.songs.length} songs • Created by you
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          <View style={styles.userPlaylistsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Artists</Text>
            <View style={styles.playlistsList}>
              {artists.map((artist) => (
                <Pressable key={artist.id} style={styles.playlistRow}>
                  <Image source={artist.profileImage} style={styles.artistProfileImage} />
                  <View style={styles.playlistInfo}>
                    <Text style={[styles.playlistName, { color: colors.text }]}>{artist.name}</Text>
                    <Text style={[styles.playlistSubtitle, { color: colors.subText }]}>Artist</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Your Library</Text>
          <View style={styles.headerActions}>
            <Pressable style={[styles.iconButton, { backgroundColor: colors.card }]}>
              <Ionicons name="search" size={20} color={colors.text} />
            </Pressable>
            <Pressable 
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowCreateModal(true)}
            >
              <Ionicons name="add" size={22} color={colors.background} />
            </Pressable>
          </View>
        </View>
        
        {/* Filter Buttons */}
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
        
        {/* Content based on selected filter */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
        <TabBar />
      </View>
      
      <PlaylistCreationModal
        visible={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          loadUserPlaylists();
        }}
      />
      
      <Modal
        visible={showPlaylistModal}
        transparent={true}
        animationType="none"
        onRequestClose={closePlaylistModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closePlaylistModal}>
          <Animated.View 
            style={[
              styles.playlistModal,
              {
                transform: [
                  {
                    translateY: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={[styles.modalPlaylistIcon, { backgroundColor: colors.primary }]}>
                <Ionicons name="musical-notes" size={32} color="#000000" />
              </View>
              <Text style={[styles.modalPlaylistTitle, { color: colors.text }]}>
                {selectedPlaylist?.name}
              </Text>
            </View>
            
            <View style={styles.modalOptions}>
              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="share-outline" size={24} color={colors.text} />
                <Text style={[styles.modalOptionText, { color: colors.text }]}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="download-outline" size={24} color={colors.text} />
                <Text style={[styles.modalOptionText, { color: colors.text }]}>Download</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOption} onPress={handlePinPlaylist}>
                <Ionicons name="push-outline" size={24} color={colors.text} />
                <Text style={[styles.modalOptionText, { color: colors.text }]}>Pin Playlist</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOption} onPress={handleDeletePlaylist}>
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                <Text style={[styles.modalOptionText, { color: "#FF3B30" }]}>Delete Playlist</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalOption}>
                <Ionicons name="qr-code-outline" size={24} color={colors.text} />
                <Text style={[styles.modalOptionText, { color: colors.text }]}>Show Spotify Code</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
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
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  filterLabel: {
    fontWeight: "600",
  },
  userPlaylistsSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  playlistsList: {
    gap: 8,
  },
  playlistRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 16,
  },
  playlistRowPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: -20,
    paddingHorizontal: 24,
  },
  playlistIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  artistProfileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  playlistModal: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalPlaylistIcon: {
    width: 80,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalPlaylistTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalOptions: {
    paddingHorizontal: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 16,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "700",
  },
  playlistSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  artistsSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
    artistsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  artistCard: {
    width: "48%",
    alignItems: "center",
  },
  artistImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  artistName: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
