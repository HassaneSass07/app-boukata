//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import {
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
// App Theme Constants
const COLORS = {
  primary: "#F57C00",
  secondary: "#1E3A8A",
  white: "#FFFFFF",
  darkGray: "#757575",
};
const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
};

const Commitments = () => {
  const Wrapper = Platform.OS === "android" ? SafeAreaView : View;
  const commitments = [
    {
      id: "c1",
      title: "Paiement Sécurisé",
      description: "Votre sécurité est notre priorité.",
      icon: "lock",
      iconFamily: "FontAwesome5",
    },
    {
      id: "c2",
      title: "Livraison Rapide",
      description: "Des livraisons express à votre porte.",
      icon: "truck",
      iconFamily: "FontAwesome5",
    },
    {
      id: "c3",
      title: "Support Client",
      description: "Toujours là pour vous aider, 24/7.",
      icon: "headset",
      iconFamily: "FontAwesome5",
    },
  ];

  const renderIcon = (iconName, iconFamily) => {
    switch (iconFamily) {
      case "FontAwesome5":
        return (
          <FontAwesome5 name={iconName} size={24} color={COLORS.primary} />
        );
      case "MaterialIcons":
        return (
          <MaterialIcons name={iconName} size={24} color={COLORS.primary} />
        );
      default:
        return (
          <MaterialIcons name={iconName} size={24} color={COLORS.primary} />
        );
    }
  };

  return (
    <Wrapper>
      <View style={styles.commitmentsSection}>
        <Text style={styles.sectionTitle}>Nos Engagements</Text>

        <View style={styles.commitmentsContainer}>
          {commitments.map((item) => (
            <View key={item.id} style={styles.commitmentCard}>
              <View style={styles.commitmentIconContainer}>
                {renderIcon(item.icon, item.iconFamily)}
              </View>
              <Text style={styles.commitmentTitle}>{item.title}</Text>
              <Text style={styles.commitmentDesc}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </Wrapper>
  );
};

export default Commitments;
const styles = StyleSheet.create({
  // Commitments Section styles
  commitmentsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.secondary,
  },
  commitmentsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  commitmentCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
    ...SHADOWS.small,
  },
  commitmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(245,124,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  commitmentTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.secondary,
    marginBottom: 4,
    textAlign: "center",
  },
  commitmentDesc: {
    fontSize: 10,
    color: COLORS.darkGray,
    textAlign: "center",
    lineHeight: 14,
  },
});
