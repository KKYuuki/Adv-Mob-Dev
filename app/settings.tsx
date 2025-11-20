import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const PRESET_COLORS = ['#1DB954', '#007AFF', '#FF3B30', '#FFFFFF', '#000000']; // Spotify Green, Blue, Red, White, Black

const SettingsScreen = () => {
  const { mode, accentColor, colors, toggleThemeMode, setCustomAccentColor } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [explicitContent, setExplicitContent] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const [customHex, setCustomHex] = useState(accentColor);

  const handleApplyCustomColor = () => {
    // Basic validation for hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(customHex)) {
      setCustomAccentColor(customHex);
    } else {
      Alert.alert('Invalid Color', 'Please enter a valid hex color code (e.g., #1DB954).');
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', screen: 'profile' },
        { icon: 'card-outline', label: 'Subscription', screen: 'subscription' },
        { icon: 'receipt-outline', label: 'Order History', screen: 'orders' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Notifications',
          rightComponent: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.subText, true: colors.primary }}
              thumbColor={notificationsEnabled ? colors.text : colors.card}
            />
          ),
        },
        {
          icon: 'color-palette-outline',
          label: 'Theme Mode',
          rightComponent: (
            <View style={styles.themeModeContainer}>
              <TouchableOpacity
                style={[styles.themeModeButton, mode === 'light' && { backgroundColor: colors.primary }]}
                onPress={() => toggleThemeMode('light')}
              >
                <Text style={[styles.themeModeButtonText, mode === 'light' && { color: colors.text }]}>Light</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themeModeButton, mode === 'dark' && { backgroundColor: colors.primary }]}
                onPress={() => toggleThemeMode('dark')}
              >
                <Text style={[styles.themeModeButtonText, mode === 'dark' && { color: colors.text }]}>Dark</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.themeModeButton, mode === 'custom' && { backgroundColor: colors.primary }]}
                onPress={() => toggleThemeMode('custom')}
              >
                <Text style={[styles.themeModeButtonText, mode === 'custom' && { color: colors.text }]}>Custom</Text>
              </TouchableOpacity>
            </View>
          ),
        },
        {
          icon: 'color-fill-outline',
          label: 'Accent Color',
          rightComponent: (
            <View style={styles.accentColorSelection}>
              {PRESET_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.presetColorCircle,
                    { backgroundColor: color, borderColor: accentColor === color ? colors.text : 'transparent' },
                  ]}
                  onPress={() => setCustomAccentColor(color)}
                />
              ))}
              <TextInput
                style={[styles.customColorInput, { backgroundColor: colors.secondary, color: colors.text }]}
                value={customHex}
                onChangeText={setCustomHex}
                placeholder="Hex code"
                placeholderTextColor={colors.subText}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={[styles.applyColorButton, { backgroundColor: colors.primary }]} onPress={handleApplyCustomColor}>
                <Text style={[styles.applyColorButtonText, { color: colors.background }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          ),
        },
        {
          icon: 'warning-outline',
          label: 'Explicit Content',
          rightComponent: (
            <Switch
              value={explicitContent}
              onValueChange={setExplicitContent}
              trackColor={{ false: colors.subText, true: colors.primary }}
              thumbColor={explicitContent ? colors.text : colors.card}
            />
          ),
        },
        {
          icon: 'phone-portrait-outline',
          label: 'Data Saver',
          rightComponent: (
            <Switch
              value={dataSaver}
              onValueChange={setDataSaver}
              trackColor={{ false: colors.subText, true: colors.primary }}
              thumbColor={dataSaver ? colors.text : colors.card}
            />
          ),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', screen: 'help' },
        { icon: 'information-circle-outline', label: 'About', screen: 'about' },
        { icon: 'shield-checkmark-outline', label: 'Privacy Policy', screen: 'privacy' },
        { icon: 'document-text-outline', label: 'Terms of Service', screen: 'terms' },
      ],
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subText }]}>{section.title}</Text>
          <View style={[styles.sectionContent, { backgroundColor: colors.card }]}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity key={itemIndex} style={[styles.settingItem, { borderBottomColor: colors.secondary }]} onPress={() => item.screen && console.log(item.screen)}>
                <View style={styles.settingLeft}>
                  <Ionicons name={item.icon as any} size={22} color={colors.subText} />
                  <Text style={[styles.settingText, { color: colors.text }]}>{item.label}</Text>
                </View>
                {item.rightComponent || (
                  <Ionicons name="chevron-forward" size={20} color={colors.subText} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: colors.subText }]}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionContent: {
    borderRadius: 10,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
  },
  themeModeContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
  },
  themeModeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  themeModeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  accentColorSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1,
  },
  presetColorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    marginHorizontal: 5,
  },
  customColorInput: {
    width: 80,
    height: 35,
    borderRadius: 5,
    paddingHorizontal: 8,
    fontSize: 14,
    marginLeft: 10,
  },
  applyColorButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  applyColorButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  versionText: {
    fontSize: 14,
  },
});

export default SettingsScreen;
