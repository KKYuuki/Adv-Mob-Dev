import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
  const router = useRouter();

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.planBadge}>
          <Text style={styles.planText}>{user.plan}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={() => router.push(`/${item.screen}`)}
          >
            <Ionicons name={item.icon as any} size={24} color="#fff" />
            <Text style={styles.menuText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" style={styles.arrowIcon} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#282828',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    color: '#b3b3b3',
    fontSize: 16,
    marginBottom: 15,
  },
  planBadge: {
    backgroundColor: '#1DB954',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  planText: {
    color: '#fff',
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
    borderBottomColor: '#282828',
  },
  menuText: {
    color: '#fff',
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
    backgroundColor: '#282828',
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
