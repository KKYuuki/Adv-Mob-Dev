import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

type IoniconName = ComponentProps<typeof Ionicons>["name"];
interface TabConfig {
  key: string;
  label: string;
  path: string;
  icon: IoniconName;
  activeIcon: IoniconName;
}

const tabs = [
  { key: "home", label: "Home", path: "/home", icon: "home-outline", activeIcon: "home" },
  {
    key: "search",
    label: "Search",
    path: "/search",
    icon: "search-outline",
    activeIcon: "search",
  },
  {
    key: "library",
    label: "Your Library",
    path: "/library",
    icon: "albums-outline",
    activeIcon: "albums",
  },
  {
    key: "premium",
    label: "Premium",
    path: "/premium",
    icon: "card-outline",
    activeIcon: "card",
  },
] as const satisfies ReadonlyArray<TabConfig>;

export default function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.secondary }]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => {
              if (!isActive) {
                router.replace(tab.path as never);
              }
            }}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={isActive ? colors.primary : colors.subText}
            />
            <Text style={[styles.label, { color: isActive ? colors.text : colors.subText }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
