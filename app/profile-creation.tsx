
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, FadeIn, withSequence } from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

const GENRES = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop'];

const ProfilePreview = React.memo(({ username, email, genre, colors }: { username: string; email: string; genre: string; colors: any }) => {
  const imageUrl = `https://via.placeholder.com/100?text=${genre || 'Genre'}`;

  return (
    <Animated.View entering={FadeIn} style={[styles.previewContainer, { backgroundColor: colors.card }]}>
      <Image source={{ uri: imageUrl }} style={[styles.profileImage, { borderColor: colors.primary }]} />
      <Text style={[styles.previewText, { color: colors.text }]}>Username: {username}</Text>
      <Text style={[styles.previewText, { color: colors.text }]}>Email: {email}</Text>
      <Text style={[styles.previewText, { color: colors.text }]}>Genre: {genre}</Text>
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
  const { colors } = useTheme();

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Create Your Profile</Text>

      <Animated.View style={usernameAnimatedStyle}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Username"
          placeholderTextColor={colors.subText}
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            validateUsername(text);
          }}
        />
      </Animated.View>
      {errors.username ? <Animated.Text entering={FadeIn} style={[styles.errorText, { color: colors.error }]}>{errors.username}</Animated.Text> : null}

      <Animated.View style={emailAnimatedStyle}>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Email"
          placeholderTextColor={colors.subText}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text);
          }}
          keyboardType="email-address"
        />
      </Animated.View>
      {errors.email ? <Animated.Text entering={FadeIn} style={[styles.errorText, { color: colors.error }]}>{errors.email}</Animated.Text> : null}

      <View style={[styles.pickerContainer, { backgroundColor: colors.card }]}>
        <Picker
          selectedValue={genre}
          onValueChange={(itemValue) => {
            setGenre(itemValue);
            if (itemValue) {
              setErrors((e) => ({ ...e, genre: '' }));
            }
          }}
          style={[styles.picker, { color: colors.text }]}
          dropdownIconColor={colors.text}
        >
          <Picker.Item label="Select a Genre" value="" color={colors.subText} />
          {GENRES.map((g) => (
            <Picker.Item key={g} label={g} value={g} color={colors.text} />
          ))}
        </Picker>
      </View>
      {errors.genre ? <Animated.Text entering={FadeIn} style={[styles.errorText, { color: colors.error }]}>{errors.genre}</Animated.Text> : null}

      <TouchableOpacity style={[styles.submitButton, { backgroundColor: colors.primary }]} onPress={handleSubmit}>
        <Text style={[styles.submitButtonText, { color: colors.text }]}>Create Profile</Text>
      </TouchableOpacity>

      {(username || email || genre) && (
        <ProfilePreview username={username} email={email} genre={genre} colors={colors} />
      )}
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
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    marginBottom: 10,
    marginLeft: 5,
  },
  pickerContainer: {
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
  },
  submitButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 30,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
  },
  previewText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ProfileCreationScreen;
