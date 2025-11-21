import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeSettingsScreen() {
  const { mode, colors, isDarkMode, isLightMode, toggleThemeMode } = useTheme();
  const [selectedMode, setSelectedMode] = useState(mode);

  const handleThemeChange = (newMode: 'light' | 'dark') => {
    setSelectedMode(newMode);
    toggleThemeMode(newMode);
  };

  const goBack = () => {
    router.back();
  };

  const themeOptions = [
    {
      id: 'light',
      name: 'Light Mode',
      description: 'Bright and clean interface',
      icon: 'sunny-outline' as const,
      colors: {
        background: '#FFFFFF',
        card: '#F6F6F6',
        text: '#000000',
        subText: '#535353',
        primary: '#1DB954',
      }
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Easy on the eyes, perfect for night',
      icon: 'moon-outline' as const,
      colors: {
        background: '#000000',
        card: '#1E1E1E',
        text: '#FFFFFF',
        subText: '#B3B3B3',
        primary: '#1DB954',
      }
    }
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Theme Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Theme Display */}
        <View style={[styles.currentThemeCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.currentThemeLabel, { color: colors.subText }]}>Current Theme</Text>
          <View style={styles.currentThemeInfo}>
            <View style={[styles.themePreview, { backgroundColor: themeOptions.find(opt => opt.id === mode)?.colors.background }]}>
              <Ionicons 
                name={themeOptions.find(opt => opt.id === mode)?.icon} 
                size={32} 
                color={themeOptions.find(opt => opt.id === mode)?.colors.primary} 
              />
            </View>
            <View style={styles.currentThemeText}>
              <Text style={[styles.currentThemeName, { color: colors.text }]}>
                {themeOptions.find(opt => opt.id === mode)?.name}
              </Text>
              <Text style={[styles.currentThemeDescription, { color: colors.subText }]}>
                {themeOptions.find(opt => opt.id === mode)?.description}
              </Text>
            </View>
          </View>
        </View>

        {/* Theme Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Theme</Text>
          
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.themeOption,
                { backgroundColor: colors.card },
                selectedMode === option.id && { borderWidth: 2, borderColor: colors.primary }
              ]}
              onPress={() => handleThemeChange(option.id as 'light' | 'dark')}
            >
              <View style={styles.themeOptionContent}>
                <View style={[styles.themeIconContainer, { backgroundColor: option.colors.background }]}>
                  <Ionicons name={option.icon} size={24} color={option.colors.primary} />
                </View>
                <View style={styles.themeOptionText}>
                  <Text style={[styles.themeOptionName, { color: colors.text }]}>{option.name}</Text>
                  <Text style={[styles.themeOptionDescription, { color: colors.subText }]}>{option.description}</Text>
                </View>
                <View style={styles.radioButton}>
                  {selectedMode === option.id && (
                    <View style={[styles.radioButtonSelected, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Theme Preview Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preview</Text>
          <View style={[styles.previewCard, { backgroundColor: colors.card }]}>
            <View style={styles.previewHeader}>
              <View style={[styles.previewAvatar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.previewAvatarText, { color: colors.background }]}>A</Text>
              </View>
              <View style={styles.previewUserInfo}>
                <Text style={[styles.previewUserName, { color: colors.text }]}>Alex User</Text>
                <Text style={[styles.previewUserStatus, { color: colors.subText }]}>Premium Member</Text>
              </View>
            </View>
            <View style={styles.previewContent}>
              <View style={[styles.previewSongCard, { backgroundColor: colors.secondary }]}>
                <View style={[styles.previewSongImage, { backgroundColor: colors.primary }]} />
                <View style={styles.previewSongInfo}>
                  <Text style={[styles.previewSongTitle, { color: colors.text }]}>Sample Song</Text>
                  <Text style={[styles.previewSongArtist, { color: colors.subText }]}>Sample Artist</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Ionicons name="information-circle-outline" size={20} color={colors.subText} />
          <Text style={[styles.infoText, { color: colors.subText }]}>
            Your theme preference will be saved and applied across all devices.
          </Text>
        </View>
      </ScrollView>
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  currentThemeCard: {
    borderRadius: 16,
    padding: 20,
  },
  currentThemeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  currentThemeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  themePreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentThemeText: {
    flex: 1,
  },
  currentThemeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentThemeDescription: {
    fontSize: 14,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  themeOption: {
    borderRadius: 12,
    padding: 16,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeOptionText: {
    flex: 1,
  },
  themeOptionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  themeOptionDescription: {
    fontSize: 14,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  previewCard: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  previewUserInfo: {
    flex: 1,
  },
  previewUserName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewUserStatus: {
    fontSize: 14,
  },
  previewContent: {
    gap: 12,
  },
  previewSongCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  previewSongImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  previewSongInfo: {
    flex: 1,
  },
  previewSongTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  previewSongArtist: {
    fontSize: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
});
