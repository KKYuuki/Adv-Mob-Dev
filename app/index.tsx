import { useRouter } from "expo-router";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoRow}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoSymbol}>♪</Text>
        </View>
        <Text style={styles.logoText}>Spotify</Text>
      </View>

      <View style={styles.heroCopy}>
        <Text style={styles.headline}>Millions of songs.</Text>
        <Text style={styles.headline}>Free on Spotify.</Text>
        <Text style={styles.subhead}>
          Listen to the music you love and discover your next favorite track.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.primaryButton]}
          onPress={() => router.push({ pathname: "/signup" })}
        >
          <Text style={styles.primaryLabel}>Sign up free</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.push({ pathname: "/login" })}
        >
          <Text style={styles.secondaryLabel}>Log in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: "space-between",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1DB954",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSymbol: {
    fontSize: 20,
    color: "#000",
    fontWeight: "700",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  heroCopy: {
    marginTop: 80,
    gap: 8,
  },
  headline: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
  },
  subhead: {
    fontSize: 16,
    color: "#b3b3b3",
    marginTop: 12,
  },
  actions: {
    gap: 16,
  },
  button: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#1DB954",
  },
  primaryLabel: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#fff",
  },
  secondaryLabel: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
