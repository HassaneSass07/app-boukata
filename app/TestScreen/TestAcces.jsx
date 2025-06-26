import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const COLORS = {
  primary: "#8B5CF6",
  secondary: "#1E3A8A",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  yellow: "#FCD34D",
  background: "#F8FAFC",
};

const services = [
  {
    id: "1",
    name: "RESTAURANTS",
    icon: "hamburger",
    iconFamily: "MaterialCommunityIcons",
    color: COLORS.primary,
  },
  {
    id: "2",
    name: "ALIMENTATION",
    icon: "shopping-basket",
    iconFamily: "FontAwesome5",
    color: COLORS.primary,
  },
  {
    id: "3",
    name: "SHOPPING",
    icon: "shopping-bag",
    iconFamily: "FontAwesome5",
    color: COLORS.primary,
  },
  {
    id: "4",
    name: "COURSIERS",
    icon: "motorcycle",
    iconFamily: "FontAwesome5",
    color: COLORS.primary,
  },
];

const Test = () => {
  const renderServiceIcon = (iconName, iconFamily) => {
    switch (iconFamily) {
      case "FontAwesome5":
        return <FontAwesome5 name={iconName} size={28} color={COLORS.yellow} />;
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={iconName}
            size={32}
            color={COLORS.yellow}
          />
        );
      case "MaterialIcons":
        return (
          <MaterialIcons name={iconName} size={32} color={COLORS.yellow} />
        );
      default:
        return <FontAwesome5 name={iconName} size={32} color={COLORS.yellow} />;
    }
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity style={styles.serviceItem}>
      <View style={styles.serviceIconContainer}>
        {renderServiceIcon(item.icon, item.iconFamily)}
      </View>
      <Text style={styles.serviceName} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Accès Rapide</Text>
      </View>

      <View style={styles.servicesSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderServiceItem}
          contentContainerStyle={styles.servicesList}
          ItemSeparatorComponent={() => (
            <View style={styles.serviceSeparator} />
          )}
        />
      </View>

      <View style={styles.pharmacySection}>
        <TouchableOpacity style={styles.pharmacyContainer}>
          <LinearGradient
            colors={['#479045', '#61a65e', '#3a7a3a']}
            style={styles.pharmacyContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.pharmacyTextContainer}>
              <Text style={styles.pharmacyTitle}>PHARMACIES</Text>
              <Text style={styles.pharmacySubtitle}>DE GARDE</Text>
            </View>
            <View style={styles.pharmacyIconContainer}>
              <View style={styles.pharmacyIconCircle}>
                <MaterialIcons
                  name="local-pharmacy"
                  size={40}
                  color={COLORS.white}
                />
              </View>
            </View>
            <View style={styles.consultezContainer}>
              <Text style={styles.consultezText}>CONSULTEZ</Text>
              <Text style={styles.gratuitementText}>GRATUITEMENT</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.secondary,
    textAlign: "left",
    letterSpacing: 0.5,
  },
  servicesSection: {
    marginBottom: 30,
  },
  servicesList: {
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceSeparator: {
    width: 15,
  },
  serviceItem: {
    alignItems: "center",
    width: 85,
  },
  serviceIconContainer: {
    width: 75,
    height: 75,
    backgroundColor: "#010080",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  serviceName: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.secondary,
    textAlign: "center",
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  pharmacySection: {
    paddingHorizontal: 20,
  },
  pharmacyContainer: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  pharmacyContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 25,
    minHeight: 90,
  },
  pharmacyTextContainer: {
    flex: 1,
  },
  pharmacyTitle: {
    lineHeight: 25,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 1.2,
  },
  pharmacySubtitle: {
    lineHeight: 25,
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: 1.2,
    marginTop: -2,
  },
  pharmacyIconContainer: {
    marginHorizontal: 20,
  },
  pharmacyIconCircle: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  consultezContainer: {
    alignItems: "flex-end",
  },
  consultezText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.8,
  },
  gratuitementText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.yellow,
    letterSpacing: 0.8,
    marginTop: -1,
  },
});

export default Test;