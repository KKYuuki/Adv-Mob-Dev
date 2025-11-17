import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

  return (
    <View style={styles.container}>
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
              color={isActive ? "#1DB954" : "#d4d4d4"}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
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
    backgroundColor: "#0c0c0c",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#1f1f1f",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  label: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
  },
  labelActive: {
    color: "#fff",
  },
});
