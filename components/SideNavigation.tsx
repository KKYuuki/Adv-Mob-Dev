import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../contexts/AuthContext";

interface SideNavigationProps {
  visible: boolean;
  onClose: () => void;
  slideAnimation: Animated.Value;
}

export default function SideNavigation({ visible, onClose, slideAnimation }: SideNavigationProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  const handleOverlayPress = () => {
    onClose();
  };

  const handleProfilePress = () => {
    onClose();
    router.push("/profile");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            await logout();
            onClose();
            router.replace("/(auth)/login");
          }
        },
      ]
    );
  };

  return (
    <>
      {/* Side Navigation Overlay */}
      {visible && (
        <Pressable style={styles.overlay} onPress={handleOverlayPress}>
          <BlurView intensity={80} tint="dark" style={styles.blurOverlay} />
        </Pressable>
      )}
      
      {/* Side Navigation Panel */}
      <Animated.View 
        style={[
          styles.sideNav, 
          { 
            backgroundColor: colors.background,
            transform: [{ translateX: slideAnimation }]
          }
        ]}
      >
        <View style={styles.sideNavHeader}>
          <View style={styles.profileSection}>
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.profileAvatar} />
            ) : (
              <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.profileAvatarText, { color: colors.background }]}>
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>
                {user?.name || "User"}
              </Text>
              <Pressable style={styles.viewProfileButton} onPress={handleProfilePress}>
                <Text style={[styles.viewProfileText, { color: colors.primary }]}>View profile</Text>
              </Pressable>
            </View>
          </View>
        </View>
        
        <ScrollView style={styles.sideNavContent} showsVerticalScrollIndicator={false}>
          <View style={styles.navSection}>
            <Text style={[styles.navSectionTitle, { color: colors.subText }]}>Browse</Text>
            <Pressable style={styles.navItem}>
              <Ionicons name="home" size={24} color={colors.text} />
              <Text style={[styles.navItemText, { color: colors.text }]}>Home</Text>
            </Pressable>
            <Pressable style={styles.navItem}>
              <Ionicons name="search" size={24} color={colors.text} />
              <Text style={[styles.navItemText, { color: colors.text }]}>Search</Text>
            </Pressable>
            <Pressable style={styles.navItem}>
              <Ionicons name="library" size={24} color={colors.text} />
              <Text style={[styles.navItemText, { color: colors.text }]}>Your Library</Text>
            </Pressable>
          </View>
          
          <View style={styles.navSection}>
            <Text style={[styles.navSectionTitle, { color: colors.subText }]}>Your Content</Text>
            <Pressable style={styles.navItem}>
              <Ionicons name="heart" size={24} color={colors.text} />
              <Text style={[styles.navItemText, { color: colors.text }]}>Liked Songs</Text>
            </Pressable>
            <Pressable style={styles.navItem}>
              <Ionicons name="musical-notes" size={24} color={colors.text} />
              <Text style={[styles.navItemText, { color: colors.text }]}>Made for You</Text>
            </Pressable>
            <Pressable style={styles.navItem}>
              <Ionicons name="download" size={24} color={colors.text} />
              <Text style={[styles.navItemText, { color: colors.text }]}>Downloaded</Text>
            </Pressable>
          </View>
          
          <View style={styles.navSection}>
            <Text style={[styles.navSectionTitle, { color: colors.subText }]}>Settings</Text>
            <Pressable style={styles.navItem}>
              <Ionicons name="settings" size={24} color={colors.text} />
              <Text style={[styles.navItemText, { color: colors.text }]}>Settings</Text>
            </Pressable>
            <Pressable style={styles.navItem}>
              <Ionicons name="person" size={24} color={colors.text} />
              <Text style={[styles.navItemText, { color: colors.text }]}>Account</Text>
            </Pressable>
            <Pressable style={styles.navItem}>
              <Ionicons name="help-circle" size={24} color={colors.text} />
              <Text style={[styles.navItemText, { color: colors.text }]}>Help</Text>
            </Pressable>
            <Pressable style={styles.navItem} onPress={handleLogout}>
              <Ionicons name="log-out" size={24} color="#FF3B30" />
              <Text style={[styles.navItemText, { color: "#FF3B30" }]}>Logout</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  blurOverlay: {
    flex: 1,
  },
  sideNav: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    paddingTop: 18,
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sideNavHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarText: {
    fontSize: 20,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  viewProfileButton: {
    alignSelf: "flex-start",
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  sideNavContent: {
    flex: 1,
    padding: 20,
  },
  navSection: {
    marginBottom: 32,
  },
  navSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 16,
    letterSpacing: 1,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 16,
  },
  navItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
