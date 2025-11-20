import { useRouter } from "expo-router";
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../hooks/useTheme";

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
      <View style={styles.logoRow}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
          <Text style={[styles.logoSymbol, { color: colors.background }]}>♪</Text>
        </View>
        <Text style={[styles.logoText, { color: colors.text }]}>Spotify</Text>
      </View>

      <View style={styles.heroCopy}>
        <Text style={[styles.headline, { color: colors.text }]}>Millions of songs.</Text>
        <Text style={[styles.headline, { color: colors.text }]}>Free on Spotify.</Text>
        <Text style={[styles.subhead, { color: colors.subText }]}>
          Listen to the music you love and discover your next favorite track.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push({ pathname: "/signup" })}
        >
          <Text style={[styles.primaryLabel, { color: colors.background }]}>Sign up free</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton, { borderColor: colors.text }]}
          onPress={() => router.push({ pathname: "/login" })}
        >
          <Text style={[styles.secondaryLabel, { color: colors.text }]}>Log in</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: "center",
    justifyContent: "center",
  },
  logoSymbol: {
    fontSize: 20,
    fontWeight: "700",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  heroCopy: {
    marginTop: 80,
    gap: 8,
  },
  headline: {
    fontSize: 36,
    fontWeight: "800",
  },
  subhead: {
    fontSize: 16,
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
  },
  primaryLabel: {
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  secondaryLabel: {
    fontWeight: "600",
    fontSize: 16,
  },
});
