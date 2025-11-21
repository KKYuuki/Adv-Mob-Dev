import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../hooks/useTheme";

interface UserPlaylist {
  id: string;
  name: string;
  createdAt: string;
  songs: any[];
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  
  useEffect(() => {
    loadUserPlaylists();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserPlaylists();
    }, [])
  );

  const loadUserPlaylists = async () => {
    try {
      const existingPlaylists = await AsyncStorage.getItem("user_playlists");
      if (existingPlaylists) {
        const playlists = JSON.parse(existingPlaylists);
        setUserPlaylists(playlists.reverse());
      }
    } catch (error) {
      console.error("Error loading playlists:", error);
    }
  };

  const renderPlaylistItem = ({ item }: { item: UserPlaylist }) => (
    <Pressable 
      style={styles.playlistItem} 
      onPress={() => router.push(`/playlist/${item.id}` as never)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)', borderless: false }}
    >
      <View style={[styles.playlistIcon, { backgroundColor: colors.primary }]}>
        <Ionicons name="musical-notes" size={48} color="#000000" />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={[styles.playlistName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.playlistCount, { color: colors.subText }]}>{item.songs.length} songs</Text>
      </View>
    </Pressable>
  );

  const renderHeader = () => (
    <LinearGradient
      colors={["#1DB954", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0.3, 1]}
      style={styles.headerGradient}
    >
      <View style={styles.header}>
        <View style={styles.profileSection}>
          {user?.profilePicture ? (
            <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileInitial, { backgroundColor: colors.primary }]}>
              <Text style={[styles.initialText, { color: colors.background }]}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>{user?.name || "User"}</Text>
            <Text style={[styles.profileEmail, { color: colors.subText }]}>{user?.email || "user@example.com"}</Text>
          </View>
          <Pressable 
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/profile/edit")}
          >
            <Ionicons name="pencil" size={16} color="#000" />
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>
        
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>234</Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>45</Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{userPlaylists.length}</Text>
            <Text style={[styles.statLabel, { color: colors.subText }]}>Playlists</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.push("/home")}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <FlatList
          data={userPlaylists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.playlistList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  headerGradient: {
    paddingTop: 100,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 0,
  },
  playlistList: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInitial: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    fontSize: 32,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  editButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 8,
  },
  playlistIcon: {
    width: 128,
    height: 128,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  playlistCount: {
    fontSize: 14,
  },
});
