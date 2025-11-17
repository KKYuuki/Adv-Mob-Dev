import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import TabBar from "../components/TabBar";

const benefits = [
  { id: "1", label: "Ad-free music listening", icon: "volume-high-outline" },
  { id: "2", label: "Download to listen offline", icon: "cloud-download-outline" },
  { id: "3", label: "Play songs in any order", icon: "shuffle-outline" },
  { id: "4", label: "High audio quality", icon: "musical-notes-outline" },
];

export default function PremiumScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={styles.kicker}>Go Premium</Text>
            <Text style={styles.title}>Experience Spotify without limits</Text>
            <Text style={styles.subtitle}>
              Upgrade for uninterrupted music, downloads, and the best possible sound quality.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.planLabel}>Individual</Text>
            <Text style={styles.price}>$9.99</Text>
            <Text style={styles.perMonth}>per month after trial</Text>
            <View style={styles.benefits}>
              {benefits.map((benefit) => (
                <View key={benefit.id} style={styles.benefitRow}>
                  <Ionicons name={benefit.icon as any} size={18} color="#1DB954" />
                  <Text style={styles.benefitText}>{benefit.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.primaryButton}>
              <Text style={styles.primaryLabel}>Start free trial</Text>
            </View>
            <Text style={styles.terms}>Terms and conditions apply. Cancel anytime.</Text>
          </View>
        </ScrollView>
        <TabBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#050505",
  },
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 24,
  },
  hero: {
    gap: 12,
    marginTop: 16,
  },
  kicker: {
    color: "#1DB954",
    fontWeight: "700",
    fontSize: 16,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#b3b3b3",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#181818",
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  planLabel: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  price: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "900",
  },
  perMonth: {
    color: "#b3b3b3",
  },
  benefits: {
    gap: 12,
    marginTop: 8,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitText: {
    color: "#fff",
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#1DB954",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryLabel: {
    fontWeight: "700",
    color: "#000",
    fontSize: 16,
  },
  terms: {
    color: "#9ca3af",
    fontSize: 12,
    textAlign: "center",
  },
});
