import React, { useReducer, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

type Song = {
  id: string;
  name: string;
};

type State = {
  playlist: Song[];
  history: State[];
  future: State[];
};

type Action =
  | { type: 'ADD_SONG'; payload: Song }
  | { type: 'REMOVE_SONG'; payload: string }
  | { type: 'CLEAR_PLAYLIST' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_STATE'; payload: State };

const initialState: State = {
  playlist: [],
  history: [],
  future: [],
};

const playlistReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_SONG':
      return {
        ...state,
        playlist: [...state.playlist, action.payload],
        history: [...state.history, state],
        future: [],
      };
    case 'REMOVE_SONG':
      return {
        ...state,
        playlist: state.playlist.filter((song) => song.id !== action.payload),
        history: [...state.history, state],
        future: [],
      };
    case 'CLEAR_PLAYLIST':
      return {
        ...state,
        playlist: [],
        history: [...state.history, state],
        future: [],
      };
    case 'UNDO': {
      if (state.history.length === 0) return state;
      const previousState = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, state.history.length - 1);
      return {
        ...previousState,
        history: newHistory,
        future: [state, ...state.future],
      };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const nextState = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        ...nextState,
        history: [...state.history, state],
        future: newFuture,
      };
    }
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
};

const SongItem = React.memo(({ song, onRemove }: { song: Song; onRemove: (id: string) => void }) => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.songItem}>
    <Ionicons name="musical-notes" size={24} color="#1DB954" style={{ marginRight: 15 }} />
    <Text style={styles.songName}>{song.name}</Text>
    <TouchableOpacity onPress={() => onRemove(song.id)}>
      <Ionicons name="close-circle" size={24} color="#b3b3b3" />
    </TouchableOpacity>
  </Animated.View>
));

const PlaylistScreen = () => {
  const [state, dispatch] = useReducer(playlistReducer, initialState);
  const [songName, setSongName] = useState('');

  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('playlistState');
        if (savedState) {
          dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedState) });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load playlist from storage.');
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('playlistState', JSON.stringify(state));
      } catch (error) {
        Alert.alert('Error', 'Failed to save playlist to storage.');
      }
    };
    saveState();
  }, [state]);

  const handleAddSong = () => {
    if (songName.trim()) {
      const newSong: Song = {
        id: Date.now().toString(),
        name: songName.trim(),
      };
      dispatch({ type: 'ADD_SONG', payload: newSong });
      setSongName('');
    }
  };

  const handleRemoveSong = useCallback(
    (id: string) => {
      dispatch({ type: 'REMOVE_SONG', payload: id });
    },
    [dispatch]
  );

  const handleClearPlaylist = () => {
    dispatch({ type: 'CLEAR_PLAYLIST' });
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playlist Builder</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter song name"
          placeholderTextColor="#b3b3b3"
          value={songName}
          onChangeText={setSongName}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddSong}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, state.history.length === 0 && styles.disabledButton]}
          onPress={handleUndo}
          disabled={state.history.length === 0}
        >
          <Ionicons name="arrow-undo" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, state.future.length === 0 && styles.disabledButton]}
          onPress={handleRedo}
          disabled={state.future.length === 0}
        >
          <Ionicons name="arrow-redo" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Redo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleClearPlaylist}>
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={state.playlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SongItem song={item} onRemove={handleRemoveSong} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Your playlist is empty. Add some songs!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#282828',
    borderRadius: 5,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
    marginBottom: 10,
  },
  songName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#b3b3b3',
    marginTop: 50,
    fontSize: 16,
  },
});

export default PlaylistScreen;
