import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const ProfileScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'Premium',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', screen: 'edit-profile' },
    { icon: 'notifications-outline', label: 'Notifications', screen: 'notifications' },
    { icon: 'lock-closed-outline', label: 'Privacy', screen: 'privacy' },
    { icon: 'help-circle-outline', label: 'Help', screen: 'help' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.secondary }]}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        <Text style={[styles.email, { color: colors.subText }]}>{user.email}</Text>
        <View style={[styles.planBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.planText, { color: colors.background }]}>{user.plan}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.menuItem, { borderBottomColor: colors.secondary }]}
            onPress={() => router.push(`/${item.screen}`)}
          >
            <Ionicons name={item.icon as any} size={24} color={colors.text} />
            <Text style={[styles.menuText, { color: colors.text }]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.subText} style={styles.arrowIcon} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.card }]}>
        <Text style={[styles.logoutText, { color: colors.text }]}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    marginBottom: 15,
  },
  planBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  planText: {
    fontWeight: '600',
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
