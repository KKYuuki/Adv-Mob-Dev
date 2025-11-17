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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Placeholder for auth integration
    console.log("Logging in", { email, password });
    router.replace({ pathname: "/home" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View>
        <Text style={styles.kicker}>Log in</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Enter your credentials to continue listening.
        </Text>
      </View>

      <View style={styles.form}>
        <View>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@email.com"
            placeholderTextColor="#7a7a7a"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Your password"
            placeholderTextColor="#7a7a7a"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryLabel}>Log in</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push({ pathname: "/signup" })}
          style={styles.linkRow}
        >
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <Text style={styles.linkText}>Sign up free</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    justifyContent: "space-between",
  },
  kicker: {
    color: "#1DB954",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: "#b3b3b3",
    marginTop: 8,
    fontSize: 16,
  },
  form: {
    gap: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#1DB954",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  primaryLabel: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    color: "#b3b3b3",
    marginRight: 6,
  },
  linkText: {
    color: "#fff",
    fontWeight: "700",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  }
});
