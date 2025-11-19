
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, FadeIn, withSequence } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const GENRES = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop'];

const ProfilePreview = React.memo(({ username, email, genre }: { username: string; email: string; genre: string }) => {
  const imageUrl = `https://via.placeholder.com/100?text=${genre || 'Genre'}`;

  return (
    <Animated.View entering={FadeIn} style={styles.previewContainer}>
      <Image source={{ uri: imageUrl }} style={styles.profileImage} />
      <Text style={styles.previewText}>Username: {username}</Text>
      <Text style={styles.previewText}>Email: {email}</Text>
      <Text style={styles.previewText}>Genre: {genre}</Text>
    </Animated.View>
  );
});

const ProfileCreationScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [genre, setGenre] = useState('');

  const [errors, setErrors] = useState({ username: '', email: '', genre: '' });

  const usernameShake = useSharedValue(0);
  const emailShake = useSharedValue(0);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const formData = await AsyncStorage.getItem('profileFormData');
        if (formData) {
          const { username, email, genre } = JSON.parse(formData);
          setUsername(username || '');
          setEmail(email || '');
          setGenre(genre || '');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load cached form data.');
      }
    };
    loadFormData();
  }, []);

  useEffect(() => {
    const cacheFormData = async () => {
      try {
        await AsyncStorage.setItem('profileFormData', JSON.stringify({ username, email, genre }));
      } catch (error) {
        // Don't alert on every change
      }
    };
    cacheFormData();
  }, [username, email, genre]);

  const validateUsername = (name: string) => {
    if (name.length < 3 || name.length > 20) {
      setErrors((e) => ({ ...e, username: 'Username must be 3-20 characters long.' }));
      usernameShake.value = withSequence(withTiming(10, { duration: 50 }), withTiming(-10, { duration: 100 }), withTiming(0, { duration: 50 }));
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setErrors((e) => ({ ...e, username: 'Username can only contain letters, numbers, and underscores.' }));
      usernameShake.value = withSequence(withTiming(10, { duration: 50 }), withTiming(-10, { duration: 100 }), withTiming(0, { duration: 50 }));
      return false;
    }
    setErrors((e) => ({ ...e, username: '' }));
    return true;
  };

  const validateEmail = (email: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors((e) => ({ ...e, email: 'Please enter a valid email address.' }));
      emailShake.value = withSequence(withTiming(10, { duration: 50 }), withTiming(-10, { duration: 100 }), withTiming(0, { duration: 50 }));
      return false;
    }
    setErrors((e) => ({ ...e, email: '' }));
    return true;
  };

  const handleSubmit = async () => {
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isGenreValid = !!genre;

    if (!isGenreValid) {
      setErrors((e) => ({ ...e, genre: 'Please select a genre.' }));
    }

    if (isUsernameValid && isEmailValid && isGenreValid) {
      Alert.alert('Success', 'Profile created successfully!');
      await AsyncStorage.removeItem('profileFormData');
      setUsername('');
      setEmail('');
      setGenre('');
      setErrors({ username: '', email: '', genre: '' });
    }
  };

  const usernameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: usernameShake.value }],
  }));

  const emailAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: emailShake.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Profile</Text>

      <Animated.View style={usernameAnimatedStyle}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#b3b3b3"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            validateUsername(text);
          }}
        />
      </Animated.View>
      {errors.username ? <Animated.Text entering={FadeIn} style={styles.errorText}>{errors.username}</Animated.Text> : null}

      <Animated.View style={emailAnimatedStyle}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#b3b3b3"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          keyboardType="email-address"
        />
      </Animated.View>
      {errors.email ? <Animated.Text entering={FadeIn} style={styles.errorText}>{errors.email}</Animated.Text> : null}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={genre}
          onValueChange={(itemValue) => {
            setGenre(itemValue);
            if (itemValue) {
              setErrors((e) => ({ ...e, genre: '' }));
            }
          }}
          style={styles.picker}
          dropdownIconColor="#fff"
        >
          <Picker.Item label="Select a Genre" value="" color="#b3b3b3" />
          {GENRES.map((g) => (
            <Picker.Item key={g} label={g} value={g} color="#000" />
          ))}
        </Picker>
      </View>
      {errors.genre ? <Animated.Text entering={FadeIn} style={styles.errorText}>{errors.genre}</Animated.Text> : null}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create Profile</Text>
      </TouchableOpacity>

      {(username || email || genre) && (
        <ProfilePreview username={username} email={email} genre={genre} />
      )}
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
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#282828',
    borderRadius: 5,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: '#f44336',
    marginBottom: 10,
    marginLeft: 5,
  },
  pickerContainer: {
    backgroundColor: '#282828',
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  previewText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ProfileCreationScreen;
