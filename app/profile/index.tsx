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
  const { colors, isDarkMode } = useTheme();
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
      style={[styles.playlistItem, { backgroundColor: colors.card }]} 
      onPress={() => router.push(`/playlist/${item.id}` as never)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)', borderless: false }}
    >
      <View style={[styles.playlistIcon, { backgroundColor: colors.primary }]}>
        <Ionicons name="musical-notes" size={48} color={colors.background} />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={[styles.playlistName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.playlistCount, { color: colors.subText }]}>{item.songs.length} songs</Text>
      </View>
    </Pressable>
  );

  const renderHeader = () => (
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
        <View style={styles.actionButtons}>
          <Pressable 
            style={[styles.editButton, { backgroundColor: '#FFFFFF' }]}
            onPress={() => router.push("/profile/edit")}
          >
            <Ionicons name="pencil" size={16} color="#000000" />
            <Text style={[styles.editButtonText, { color: '#000000' }]}>Edit</Text>
          </Pressable>
          <Pressable 
            style={[styles.settingsButton, { backgroundColor: colors.card }]}
            onPress={() => router.push("/settings/theme")}
          >
            <Ionicons name="settings-outline" size={16} color={colors.text} />
          </Pressable>
        </View>
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
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={isDarkMode ? ["#1DB954", "#000000"] : ["#1DB954", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0.3, 1]}
        style={styles.fullPageGradient}
      >
        <View style={styles.container}>
          <Pressable style={styles.backButton} onPress={() => router.push("/home")}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
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
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fullPageGradient: {
    flex: 1,
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
  header: {
    paddingTop: 120,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  listContent: {
    paddingBottom: 40,
    paddingTop: 0,
    paddingHorizontal: 0,
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
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInitial: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    fontSize: 40,
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
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
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
    paddingVertical: 16,
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
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
