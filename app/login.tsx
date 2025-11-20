import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTheme } from "../hooks/useTheme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();

  const handleLogin = () => {
    // Placeholder for auth integration
    console.log("Logging in", { email, password });
    router.replace({ pathname: "/home" });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
      <View>
        <Text style={[styles.kicker, { color: colors.primary }]}>Log in</Text>
        <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Enter your credentials to continue listening.
        </Text>
      </View>

      <View style={styles.form}>
        <View>
          <Text style={[styles.label, { color: colors.text }]}>Email address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="name@email.com"
            placeholderTextColor={colors.subText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View>
          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="Your password"
            placeholderTextColor={colors.subText}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Pressable style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleLogin}>
          <Text style={[styles.primaryLabel, { color: colors.background }]}>Log in</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push({ pathname: "/signup" })}
          style={styles.linkRow}
        >
          <Text style={[styles.footerText, { color: colors.subText }]}>Don’t have an account?</Text>
          <Text style={[styles.linkText, { color: colors.text }]}>Sign up free</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  kicker: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
  },
  form: {
    gap: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  primaryLabel: {
    fontWeight: "700",
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    marginRight: 6,
  },
  linkText: {
    fontWeight: "700",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  }
});
