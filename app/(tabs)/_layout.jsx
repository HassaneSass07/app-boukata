import React from "react";
import { Platform, View, StyleSheet, Pressable } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import HomeScreen from "./screens/HomeScreen";
import MarcherScreen from "./screens/MarcherScreen";
import VendeurScreen from "./screens/VendeurScreen";
import FavorisScreen from "./screens/FavorisScreen";
import CompteScreen from "./screens/CompteScreen";

const COLORS = {
  primary: "#E7BA06",
  secondary: "#010080", 
  background: "#FFFFFF",
  card: "rgba(255, 255, 255, 0.8)",
  text: "#010080",
  border: "rgba(1, 0, 128, 0.1)",
  notification: "#E7BA06",
  inactive: "rgba(1, 0, 128, 0.5)",
};

const Tab = createBottomTabNavigator();

const CustomTab = ({ children, onPress, accessibilityState }) => {
  const focused = accessibilityState?.selected || false;

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(focused ? 1 : 0) }],
      opacity: withSpring(focused ? 1 : 0),
    };
  });

  return (
    <Pressable
      onPress={onPress}
      style={styles.tabContainer}
      android_ripple={{ color: COLORS.border, borderless: true }}
    >
      <Animated.View style={[styles.tabIndicator, animatedStyles]} />
      <View style={styles.tab}>{children}</View>
    </Pressable>
  );
};

const CenterTab = ({ children, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={styles.centerTabContainer}
      android_ripple={{
        color: COLORS.secondary,
        borderless: false,
        radius: 28,
      }}
    >
      {children}
    </Pressable>
  );
};

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 4,
        },
        tabBarStyle: {
          position: "absolute",
          height: 90,
          borderTopWidth: 0,
          elevation: 0,
          ...Platform.select({
            ios: {
              shadowColor: COLORS.secondary,
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            },
            android: {
              elevation: 8,
            },
          }),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 10,
        },
        tabBarButton: (props) => <CustomTab {...props} />,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              tint="light"
              intensity={80}
              style={StyleSheet.absoluteFill}
            >
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "rgba(255,255,255,0.7)" },
                ]}
              />
            </BlurView>
          ) : null,
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Achat"
        component={MarcherScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "storefront" : "storefront-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Vendeur"
        component={VendeurScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.centerIconContainer}>
              <FontAwesome5
                name="user-tie"
                size={24}
                color={COLORS.background}
              />
            </View>
          ),
          tabBarButton: (props) => (
            <CenterTab onPress={props.onPress}>{props.children}</CenterTab>
          ),
        }}
      />
      <Tab.Screen
        name="Panier"
        component={FavorisScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Compte"
        component={CompteScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIndicator: {
    position: "absolute",
    top: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  centerTabContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});