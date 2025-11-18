import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [explicitContent, setExplicitContent] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);

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
              trackColor={{ false: '#767577', true: '#1DB954' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          ),
        },
        {
          icon: 'moon-outline',
          label: 'Dark Mode',
          rightComponent: (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#1DB954' }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
            />
          ),
        },
        {
          icon: 'warning-outline',
          label: 'Explicit Content',
          rightComponent: (
            <Switch
              value={explicitContent}
              onValueChange={setExplicitContent}
              trackColor={{ false: '#767577', true: '#1DB954' }}
              thumbColor={explicitContent ? '#fff' : '#f4f3f4'}
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
              trackColor={{ false: '#767577', true: '#1DB954' }}
              thumbColor={dataSaver ? '#fff' : '#f4f3f4'}
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Ionicons name={item.icon as any} size={22} color="#b3b3b3" />
                  <Text style={styles.settingText}>{item.label}</Text>
                </View>
                {item.rightComponent || (
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionContent: {
    backgroundColor: '#282828',
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
    borderBottomColor: '#383838',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  versionText: {
    color: '#666',
    fontSize: 14,
  },
});

export default SettingsScreen;
