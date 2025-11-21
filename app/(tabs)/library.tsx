import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useMemo, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
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
  
  useEffect(() => {
    loadUserPlaylists();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserPlaylists(); // Refresh playlists when page comes into focus
    }, [])
  );

  const handleModalClose = () => {
    setShowCreateModal(false);
    loadUserPlaylists(); // Refresh playlists when modal closes
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
      { id: "1", name: "Artist A", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200" },
      { id: "2", name: "Artist B", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200" },
      { id: "3", name: "Artist C", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200" },
      { id: "4", name: "Artist D", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200" },
      { id: "5", name: "Artist E", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200" },
      { id: "6", name: "Artist F", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200" },
      { id: "7", name: "Artist G", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200" },
      { id: "8", name: "Artist H", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200" },
      { id: "9", name: "Artist I", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200" },
      { id: "10", name: "Artist J", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200" },
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
                style={styles.playlistRow}
                onPress={() => router.push(`/playlist/${playlist.id}` as never)}
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
                <View style={[styles.playlistIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name="person" size={20} color="#000000" />
                </View>
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
                    style={styles.playlistRow}
                    onPress={() => router.push(`/playlist/${playlist.id}` as never)}
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
                  <View style={[styles.playlistIcon, { backgroundColor: colors.primary }]}>
                    <Ionicons name="person" size={20} color="#000000" />
                  </View>
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
        onClose={handleModalClose}
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
  playlistIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  playlistInfo: {
    flex: 1,
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
