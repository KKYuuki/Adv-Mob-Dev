import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import TabBar from "../../components/TabBar";
import { useTheme } from "../../hooks/useTheme";

const benefits = [
  { id: "1", label: "Ad-free music listening", icon: "volume-high-outline" },
  { id: "2", label: "Download to listen offline", icon: "cloud-download-outline" },
  { id: "3", label: "Play songs in any order", icon: "shuffle-outline" },
  { id: "4", label: "High audio quality", icon: "musical-notes-outline" },
];

export default function PremiumScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={[styles.kicker, { color: colors.primary }]}>Go Premium</Text>
            <Text style={[styles.title, { color: colors.text }]}>Experience Spotify without limits</Text>
            <Text style={[styles.subtitle, { color: colors.subText }]}>
              Upgrade for uninterrupted music, downloads, and the best possible sound quality.
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.planLabel, { color: colors.text }]}>Individual</Text>
            <Text style={[styles.price, { color: colors.text }]}>$9.99</Text>
            <Text style={[styles.perMonth, { color: colors.subText }]}>per month after trial</Text>
            <View style={styles.benefits}>
              {benefits.map((benefit) => (
                <View key={benefit.id} style={styles.benefitRow}>
                  <Ionicons name={benefit.icon as any} size={18} color={colors.primary} />
                  <Text style={[styles.benefitText, { color: colors.text }]}>{benefit.label}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
              <Text style={[styles.primaryLabel, { color: colors.background }]}>Start free trial</Text>
            </View>
            <Text style={[styles.terms, { color: colors.subText }]}>Terms and conditions apply. Cancel anytime.</Text>
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
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 32,
    gap: 24,
  },
  hero: {
    gap: 12,
    marginTop: 16,
  },
  kicker: {
    fontWeight: "700",
    fontSize: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    lineHeight: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  planLabel: {
    fontSize: 20,
    fontWeight: "700",
  },
  price: {
    fontSize: 40,
    fontWeight: "900",
  },
  perMonth: {
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
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryLabel: {
    fontWeight: "700",
    fontSize: 16,
  },
  terms: {
    fontSize: 12,
    textAlign: "center",
  },
});
