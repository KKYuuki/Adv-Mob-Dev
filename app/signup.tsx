import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // Placeholder for auth integration
    console.log("Signing up", { name, email, password });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={32}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View>
              <Text style={styles.kicker}>Sign up</Text>
              <Text style={styles.title}>Create your account</Text>
              <Text style={styles.subtitle}>
                Join millions of listeners and stream instantly.
              </Text>
            </View>

            <View style={styles.form}>
              <View>
                <Text style={styles.label}>Full name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Jane Smith"
                  placeholderTextColor="#7a7a7a"
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                />
              </View>
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
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>
              <View>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 8 characters"
                  placeholderTextColor="#7a7a7a"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                />
              </View>
              <Pressable style={styles.primaryButton} onPress={handleSignup}>
                <Text style={styles.primaryLabel}>Sign up free</Text>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Pressable onPress={() => router.back()} style={styles.linkRow}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <Text style={styles.linkText}>Log in</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
    gap: 32,
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
    paddingBottom: 24,
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
  },
});
