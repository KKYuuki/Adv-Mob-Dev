import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { BlurView } from "expo-blur";
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
    key: "map",
    label: "Map",
    path: "/map",
    icon: "map-outline",
    activeIcon: "map",
  },
  {
    key: "library",
    label: "Your Library",
    path: "/library",
    icon: "albums-outline",
    activeIcon: "albums",
  },
] as const satisfies readonly TabConfig[];

export default function TabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <BlurView intensity={40} tint="dark" style={styles.container}>
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
              size={28}
              color={isActive ? colors.primary : colors.subText}
            />

            <Text
              style={[
                styles.label,
                { color: isActive ? colors.text : colors.subText },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 18,

    position: "absolute",
    bottom: 0,
    width: "100%",

    backgroundColor: "rgba(0,0,0,0.3)", // adds slight transparency
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
  },
});
