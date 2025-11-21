import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../hooks/useTheme";

interface PlaylistCreationModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PlaylistCreationModal({ visible, onClose }: PlaylistCreationModalProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePlaylistPress = () => {
    onClose();
    router.push("/playlist/name");
  };

  const handleClose = () => {
    onClose();
    router.replace("/(tabs)/library");
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
          <View style={[styles.modalContent, { backgroundColor: "rgba(30, 30, 30, 0.95)" }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>Create</Text>
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.optionsContainer}>
              <Pressable style={[styles.option, { backgroundColor: colors.card }]} onPress={handlePlaylistPress}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                  <Ionicons name="musical-notes" size={24} color="#000000" />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Playlist</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.subText }]}>Enjoy your own collection</Text>
                </View>
              </Pressable>

              <Pressable style={[styles.option, { backgroundColor: colors.card, opacity: 0.6 }]} disabled>
                <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="people" size={24} color={colors.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Collaborative Playlist</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.subText }]}>Create with friends</Text>
                </View>
              </Pressable>

              <Pressable style={[styles.option, { backgroundColor: colors.card, opacity: 0.6 }]} disabled>
                <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="git-compare" size={24} color={colors.text} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>Blend</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.subText }]}>Mix tastes with friends</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  blurContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  modalContent: {
    width: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    gap: 8,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  optionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});
