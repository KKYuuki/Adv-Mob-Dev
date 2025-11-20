import React, { useReducer, useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

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

const SongItem = React.memo(({ song, onRemove, colors }: { song: Song; onRemove: (id: string) => void; colors: any }) => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.songItem, { backgroundColor: colors.card }]}>
    <Ionicons name="musical-notes" size={24} color={colors.primary} style={{ marginRight: 15 }} />
    <Text style={[styles.songName, { color: colors.text }]}>{song.name}</Text>
    <TouchableOpacity onPress={() => onRemove(song.id)}>
      <Ionicons name="close-circle" size={24} color={colors.subText} />
    </TouchableOpacity>
  </Animated.View>
));

const PlaylistScreen = () => {
  const [state, dispatch] = useReducer(playlistReducer, initialState);
  const [songName, setSongName] = useState('');
  const { colors } = useTheme();

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Playlist Builder</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.secondary, color: colors.text }]}
          placeholder="Enter song name"
          placeholderTextColor={colors.subText}
          value={songName}
          onChangeText={setSongName}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleAddSong}>
          <Text style={[styles.addButtonText, { color: colors.text }]}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card }, state.history.length === 0 && styles.disabledButton]}
          onPress={handleUndo}
          disabled={state.history.length === 0}
        >
          <Ionicons name="arrow-undo" size={20} color={colors.text} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.card }, state.future.length === 0 && styles.disabledButton]}
          onPress={handleRedo}
          disabled={state.future.length === 0}
        >
          <Ionicons name="arrow-redo" size={20} color={colors.text} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>Redo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]} onPress={handleClearPlaylist}>
          <Ionicons name="trash" size={20} color={colors.text} />
          <Text style={[styles.actionButtonText, { color: colors.text }]}>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={state.playlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SongItem song={item} onRemove={handleRemoveSong} colors={colors} />}
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.subText }]}>Your playlist is empty. Add some songs!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
  },
  addButton: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionButtonText: {
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
    borderRadius: 5,
    marginBottom: 10,
  },
  songName: {
    flex: 1,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default PlaylistScreen;
