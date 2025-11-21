import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Login Failed", result.error || "An error occurred");
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Image
                source={require("../../assets/logo/Spotify Logo.png")}
                style={styles.logo}
              />
              <Text style={styles.title}>Spotify</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#b3b3b3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#b3b3b3"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#b3b3b3" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#b3b3b3"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <Pressable
                style={[styles.loginButton, isLoading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Text>
              </Pressable>
              
              <View style={styles.socialLoginContainer}>
                <Text style={styles.socialLoginText}>Or continue with</Text>
                <View style={styles.socialButtonsContainer}>
                  <Pressable style={styles.socialButton}>
                    <View style={styles.socialIconContainer}>
                      <Image
                        source={require("../../assets/logo/Facebook Logo.png")}
                        style={styles.socialIcon}
                      />
                    </View>
                  </Pressable>
                  <Pressable style={styles.socialButton}>
                    <View style={styles.socialIconContainer}>
                      <Image
                        source={require("../../assets/logo/Google Logo.png")}
                        style={styles.socialIcon}
                      />
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={styles.bottomSignupContainer}>
            <Pressable onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.signupLink}>
                Don&apos;t have an account? <Text style={styles.signupLinkText}>Sign Up</Text>
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#b3b3b3",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#1DB954",
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: "#666",
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSignupContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  signupLink: {
    textAlign: "center",
    color: "#b3b3b3",
    fontSize: 14,
  },
  signupLinkText: {
    color: "#1DB954",
    fontWeight: "600",
  },
  socialLoginContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  socialLoginText: {
    color: '#b3b3b3',
    fontSize: 14,
    marginBottom: 12,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
