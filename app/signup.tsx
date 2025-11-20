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
import { useTheme } from "../hooks/useTheme";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();

  const handleSignup = () => {
    // Placeholder for auth integration
    console.log("Signing up", { name, email, password });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
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
              <Text style={[styles.kicker, { color: colors.primary }]}>Sign up</Text>
              <Text style={[styles.title, { color: colors.text }]}>Create your account</Text>
              <Text style={[styles.subtitle, { color: colors.subText }]}>
                Join millions of listeners and stream instantly.
              </Text>
            </View>

            <View style={styles.form}>
              <View>
                <Text style={[styles.label, { color: colors.text }]}>Full name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                  placeholder="Jane Smith"
                  placeholderTextColor={colors.subText}
                  value={name}
                  onChangeText={setName}
                  returnKeyType="next"
                />
              </View>
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
                  autoComplete="email"
                  returnKeyType="next"
                />
              </View>
              <View>
                <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                  placeholder="Minimum 8 characters"
                  placeholderTextColor={colors.subText}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                />
              </View>
              <Pressable style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={handleSignup}>
                <Text style={[styles.primaryLabel, { color: colors.background }]}>Sign up free</Text>
              </Pressable>
            </View>

            <View style={styles.footer}>
              <Pressable onPress={() => router.back()} style={styles.linkRow}>
                <Text style={[styles.footerText, { color: colors.subText }]}>Already have an account?</Text>
                <Text style={[styles.linkText, { color: colors.text }]}>Log in</Text>
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
    paddingBottom: 24,
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
  },
});
