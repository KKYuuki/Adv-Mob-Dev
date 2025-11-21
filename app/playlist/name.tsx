import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

export default function PlaylistNameScreen() {
  const router = useRouter();
  const [playlistName, setPlaylistName] = useState("");
  const [playlistCount, setPlaylistCount] = useState(1);

  useEffect(() => {
    loadPlaylistCount();
  }, []);

  const loadPlaylistCount = async () => {
    try {
      const count = await AsyncStorage.getItem("playlist_count");
      const currentCount = count ? parseInt(count) + 1 : 1;
      setPlaylistCount(currentCount);
      setPlaylistName(`My playlist #${currentCount}`);
    } catch (error) {
      console.error("Error loading playlist count:", error);
    }
  };

  const handleCreate = async () => {
    try {
      // Save the updated playlist count
      await AsyncStorage.setItem("playlist_count", playlistCount.toString());
      
      // Save the playlist (you can extend this to save more playlist data)
      const playlistData = {
        id: Date.now().toString(),
        name: playlistName,
        createdAt: new Date().toISOString(),
        songs: [],
      };
      
      const existingPlaylists = await AsyncStorage.getItem("user_playlists");
      const playlists = existingPlaylists ? JSON.parse(existingPlaylists) : [];
      playlists.push(playlistData);
      await AsyncStorage.setItem("user_playlists", JSON.stringify(playlists));
      
      // Navigate to the playlist page (replace to prevent back to naming page)
      router.replace(`/playlist/${playlistData.id}`);
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  const handleCancel = () => {
    router.replace("/(tabs)/library");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#4A4A4A", "#000000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={handleCancel} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Give your playlist a name</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={playlistName}
                onChangeText={setPlaylistName}
                placeholder="Playlist name"
                placeholderTextColor="#B3B3B3"
                autoFocus
                multiline={false}
                maxLength={100}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Pressable onPress={handleCancel} style={styles.cancelButton}>
                <BlurView intensity={100} tint="light" style={styles.blurButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </BlurView>
              </Pressable>

              <Pressable onPress={handleCreate} style={styles.createButton}>
                <Text style={styles.createText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 48,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 48,
  },
  input: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#B3B3B3",
    paddingBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
  },
  blurButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  createButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#1DB954",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  createText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
});
