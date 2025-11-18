import "react-native-gesture-handler";

import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import type { ComponentProps } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type DrawerIconProps = {
  color?: string;
  size?: number;
};

const drawerScreens = [
  { name: "home", title: "Home", icon: "home-outline" },
  { name: "search", title: "Search", icon: "search-outline" },
  { name: "library", title: "Your Library", icon: "albums-outline" },
  { name: "playlists", title: "Playlists", icon: "musical-notes-outline" },
  { name: "premium", title: "Premium", icon: "card-outline" },
  { name: "profile", title: "Profile", icon: "person-outline" },
  { name: "settings", title: "Settings", icon: "settings-outline" },
] as const satisfies ReadonlyArray<{
  name: string;
  title: string;
  icon: IoniconName;
}>;

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerType: "slide",
          swipeEnabled: true,
          swipeEdgeWidth: 70,
          swipeMinDistance: 20,
          drawerActiveTintColor: "#1DB954",
          drawerInactiveTintColor: "#d4d4d4",
          overlayColor: "rgba(0,0,0,0.45)",
          drawerStyle: {
            backgroundColor: "#181818",
            width: 260,
          },
          sceneContainerStyle: {
            backgroundColor: "#000",
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />

        {drawerScreens.map(({ name, title, icon }) => (
          <Drawer.Screen
            key={name}
            name={name}
            options={{
              title,
              drawerLabel: title,
              drawerIcon: ({ color, size }: DrawerIconProps) => (
                <Ionicons name={icon} size={size ?? 20} color={color ?? "#fff"} />
              ),
            }}
          />
        ))}

        <Drawer.Screen
          name="login"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="signup"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="playlist/[id]"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
