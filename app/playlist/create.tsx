import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabBar from "../../components/TabBar";
import { useTheme } from "../../hooks/useTheme";

// Types
interface Song {
  id: string;
  name: string;
  artist: string;
  duration: string;
}

interface PlaylistState {
  songs: Song[];
  history: PlaylistState[];
  currentIndex: number;
}

// Action types
type PlaylistAction =
  | { type: "ADD_SONG"; payload: Song }
  | { type: "REMOVE_SONG"; payload: string }
  | { type: "CLEAR_PLAYLIST" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "LOAD_STATE"; payload: PlaylistState };

// Mock data for testing
const mockSongs: Omit<Song, "id">[] = [
  { name: "Blinding Lights", artist: "The Weeknd", duration: "3:20" },
  { name: "Shape of You", artist: "Ed Sheeran", duration: "3:53" },
  { name: "Dance Monkey", artist: "Tones and I", duration: "3:29" },
  { name: "Someone You Loved", artist: "Lewis Capaldi", duration: "3:02" },
  { name: "Circles", artist: "Post Malone", duration: "3:35" },
];

// Storage keys
const STORAGE_KEY = "playlist_state";
const HISTORY_KEY = "playlist_history";

// Reducer
const playlistReducer = (state: PlaylistState, action: PlaylistAction): PlaylistState => {
  switch (action.type) {
    case "ADD_SONG": {
      const newState = {
        ...state,
        songs: [...state.songs, action.payload],
        history: [...state.history.slice(0, state.currentIndex + 1), state],
        currentIndex: state.currentIndex + 1,
      };
      return newState;
    }
    case "REMOVE_SONG": {
      const newState = {
        ...state,
        songs: state.songs.filter(song => song.id !== action.payload),
        history: [...state.history.slice(0, state.currentIndex + 1), state],
        currentIndex: state.currentIndex + 1,
      };
      return newState;
    }
    case "CLEAR_PLAYLIST": {
      const newState = {
        ...state,
        songs: [],
        history: [...state.history.slice(0, state.currentIndex + 1), state],
        currentIndex: state.currentIndex + 1,
      };
      return newState;
    }
    case "UNDO": {
      if (state.currentIndex > 0) {
        const previousState = state.history[state.currentIndex - 1];
        return {
          ...previousState,
          currentIndex: state.currentIndex - 1,
        };
      }
      return state;
    }
    case "REDO": {
      if (state.currentIndex < state.history.length - 1) {
        const nextState = state.history[state.currentIndex + 1];
        return {
          ...nextState,
          currentIndex: state.currentIndex + 1,
        };
      }
      return state;
    }
    case "LOAD_STATE": {
      return action.payload;
    }
    default:
      return state;
  }
};

// Initial state
const initialState: PlaylistState = {
  songs: [],
  history: [],
  currentIndex: -1,
};

// Memoized Song Item Component
const SongItem = React.memo(({ song, onRemove, colors }: { song: Song; onRemove: (id: string) => void; colors: any }) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const handleRemove = useCallback(() => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(song.id);
    });
  }, [song.id, onRemove]);

  return (
    <Animated.View style={[styles.songItem, { opacity: animatedValue, transform: [{ scale: animatedValue }] }]}>
      <View style={styles.songInfo}>
        <Text style={[styles.songName, { color: colors.text }]}>{song.name}</Text>
        <Text style={[styles.songArtist, { color: colors.subText }]}>{song.artist} • {song.duration}</Text>
      </View>
      <Pressable onPress={handleRemove} style={[styles.removeButton, { backgroundColor: colors.card }]}>
        <Ionicons name="remove" size={20} color={colors.subText} />
      </Pressable>
    </Animated.View>
  );
});

SongItem.displayName = "SongItem";

export default function CreatePlaylistScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [state, dispatch] = useReducer(playlistReducer, initialState);
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [duration, setDuration] = useState("");

  // Load state from AsyncStorage on mount
  useEffect(() => {
    loadPlaylistState();
  }, []);

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    savePlaylistState();
  }, [state]);

  const loadPlaylistState = async () => {
    try {
      const savedState = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: "LOAD_STATE", payload: parsedState });
      }
    } catch (error) {
      console.error("Error loading playlist state:", error);
    }
  };

  const savePlaylistState = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving playlist state:", error);
    }
  };

  const addSong = useCallback(() => {
    if (!songName.trim()) {
      Alert.alert("Error", "Please enter a song name");
      return;
    }

    const newSong: Song = {
      id: Date.now().toString(),
      name: songName.trim(),
      artist: artistName.trim() || "Unknown Artist",
      duration: duration.trim() || "0:00",
    };

    dispatch({ type: "ADD_SONG", payload: newSong });
    setSongName("");
    setArtistName("");
    setDuration("");
  }, [songName, artistName, duration]);

  const removeSong = useCallback((id: string) => {
    dispatch({ type: "REMOVE_SONG", payload: id });
  }, []);

  const clearPlaylist = useCallback(() => {
    Alert.alert(
      "Clear Playlist",
      "Are you sure you want to clear all songs?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", onPress: () => dispatch({ type: "CLEAR_PLAYLIST" }), style: "destructive" },
      ]
    );
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: "REDO" });
  }, []);

  const addMockSong = useCallback(() => {
    const randomSong = mockSongs[Math.floor(Math.random() * mockSongs.length)];
    const newSong: Song = {
      id: Date.now().toString(),
      ...randomSong,
    };
    dispatch({ type: "ADD_SONG", payload: newSong });
  }, []);

  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.history.length - 1;

  const renderSong = useCallback(({ item }: { item: Song }) => (
    <SongItem song={item} onRemove={removeSong} colors={colors} />
  ), [removeSong, colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={[styles.title, { color: colors.text }]}>Create Playlist</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Input Section */}
          <View style={[styles.inputSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Add Song</Text>
            
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
              placeholder="Song name"
              placeholderTextColor={colors.subText}
              value={songName}
              onChangeText={setSongName}
            />
            
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
              placeholder="Artist name"
              placeholderTextColor={colors.subText}
              value={artistName}
              onChangeText={setArtistName}
            />
            
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.secondary }]}
              placeholder="Duration (e.g., 3:30)"
              placeholderTextColor={colors.subText}
              value={duration}
              onChangeText={setDuration}
            />

            <View style={styles.buttonRow}>
              <Pressable onPress={addSong} style={[styles.button, { backgroundColor: colors.primary }]}>
                <Text style={[styles.buttonText, { color: colors.background }]}>Add Song</Text>
              </Pressable>
              
              <Pressable onPress={addMockSong} style={[styles.button, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.buttonText, { color: colors.text }]}>Add Mock Song</Text>
              </Pressable>
            </View>
          </View>

          {/* Actions Section */}
          <View style={styles.actionsSection}>
            <View style={styles.actionRow}>
              <Pressable 
                onPress={undo} 
                style={[styles.actionButton, { backgroundColor: canUndo ? colors.primary : colors.card, opacity: canUndo ? 1 : 0.5 }]}
                disabled={!canUndo}
              >
                <Ionicons name="arrow-undo" size={20} color={canUndo ? colors.background : colors.subText} />
                <Text style={[styles.actionButtonText, { color: canUndo ? colors.background : colors.subText }]}>Undo</Text>
              </Pressable>

              <Pressable 
                onPress={redo} 
                style={[styles.actionButton, { backgroundColor: canRedo ? colors.primary : colors.card, opacity: canRedo ? 1 : 0.5 }]}
                disabled={!canRedo}
              >
                <Ionicons name="arrow-redo" size={20} color={canRedo ? colors.background : colors.subText} />
                <Text style={[styles.actionButtonText, { color: canRedo ? colors.background : colors.subText }]}>Redo</Text>
              </Pressable>

              <Pressable 
                onPress={clearPlaylist} 
                style={[styles.actionButton, { backgroundColor: state.songs.length > 0 ? "#FF3B30" : colors.card, opacity: state.songs.length > 0 ? 1 : 0.5 }]}
                disabled={state.songs.length === 0}
              >
                <Ionicons name="trash" size={20} color={state.songs.length > 0 ? "#FFFFFF" : colors.subText} />
                <Text style={[styles.actionButtonText, { color: state.songs.length > 0 ? "#FFFFFF" : colors.subText }]}>Clear All</Text>
              </Pressable>
            </View>
          </View>

          {/* Playlist Section */}
          <View style={styles.playlistSection}>
            <View style={styles.playlistHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Playlist ({state.songs.length} songs)
              </Text>
            </View>

            {state.songs.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
                <Ionicons name="musical-notes" size={48} color={colors.subText} />
                <Text style={[styles.emptyText, { color: colors.subText }]}>No songs yet</Text>
                <Text style={[styles.emptySubtext, { color: colors.subText }]}>Add some songs to get started</Text>
              </View>
            ) : (
              <FlatList
                data={state.songs}
                keyExtractor={(item) => item.id}
                renderItem={renderSong}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            )}
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
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  placeholder: {
    width: 40,
  },
  inputSection: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionsSection: {
    gap: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  playlistSection: {
    gap: 16,
  },
  playlistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  songItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 16,
    fontWeight: "600",
  },
  songArtist: {
    fontSize: 14,
    marginTop: 4,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
});
