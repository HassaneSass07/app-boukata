import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const COLORS = {
  primary: "#010080",
  secondary: "#E7BA06",
  white: "#FFFFFF",
  background: "#FAFAFA",
  gray: "#8A8A8A",
  lightGray: "#F5F5F5",
  text: "#333333",
  success: "#4CAF50",
  error: "#F44336",
  pharmacyGreen: "#2E7D32",
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
};

const pharmaciesData = [
  {
    id: "1",
    name: "Pharmacie Centrale",
    address: "Avenue de la République, Niamey",
    phone: "+227 20 73 25 41",
    hours: "24h/24",
    distance: "1.2 km",
    isOpen: true,
    services: ["Urgences", "Garde de nuit", "Conseil pharmaceutique"],
  },
  {
    id: "2",
    name: "Pharmacie du Plateau",
    address: "Plateau, près du marché central",
    phone: "+227 20 73 18 92",
    hours: "20h - 08h",
    distance: "2.5 km",
    isOpen: true,
    services: ["Garde de nuit", "Médicaments génériques"],
  },
  {
    id: "3",
    name: "Pharmacie Moderne",
    address: "Quartier Terminus, Niamey",
    phone: "+227 20 74 12 33",
    hours: "19h - 07h",
    distance: "3.1 km",
    isOpen: false,
    services: ["Garde de nuit", "Matériel médical"],
  },
  {
    id: "4",
    name: "Pharmacie de la Paix",
    address: "Rue de la Paix, Centre-ville",
    phone: "+227 20 73 45 67",
    hours: "24h/24",
    distance: "0.8 km",
    isOpen: true,
    services: ["Urgences", "Garde de nuit", "Livraison"],
  },
];

const emergencyNumbers = [
  {
    id: "1",
    name: "SAMU",
    number: "15",
    description: "Service d'Aide Médicale Urgente",
    icon: "local-hospital",
  },
  {
    id: "2",
    name: "Pompiers",
    number: "18",
    description: "Service de secours et d'incendie",
    icon: "local-fire-department",
  },
  {
    id: "3",
    name: "Police",
    number: "17",
    description: "Police Nationale",
    icon: "local-police",
  },
  {
    id: "4",
    name: "Centre Anti-Poison",
    number: "+227 20 75 24 24",
    description: "Centre d'information toxicologique",
    icon: "warning",
  },
];

const PharmaciesGardeScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleCall = (phoneNumber) => {
    Alert.alert(
      "Appeler",
      `Voulez-vous appeler le ${phoneNumber} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Appeler",
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
          },
        },
      ]
    );
  };

  const handleDirections = (pharmacyName, address) => {
    Alert.alert(
      "Itinéraire",
      `Ouvrir l'itinéraire vers ${pharmacyName} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Ouvrir",
          onPress: () => {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            Linking.openURL(url);
          },
        },
      ]
    );
  };

  const filteredPharmacies = pharmaciesData.filter((pharmacy) => {
    if (selectedFilter === "open") return pharmacy.isOpen;
    if (selectedFilter === "24h") return pharmacy.hours === "24h/24";
    return true;
  });

  const PharmacyCard = ({ pharmacy }) => (
    <View style={styles.pharmacyCard}>
      <View style={styles.pharmacyHeader}>
        <View style={styles.pharmacyTitleContainer}>
          <MaterialIcons name="local-pharmacy" size={24} color={COLORS.pharmacyGreen} />
          <View style={styles.pharmacyTitleText}>
            <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusDot,
                { backgroundColor: pharmacy.isOpen ? COLORS.success : COLORS.error }
              ]} />
              <Text style={[
                styles.statusText,
                { color: pharmacy.isOpen ? COLORS.success : COLORS.error }
              ]}>
                {pharmacy.isOpen ? "Ouvert" : "Fermé"}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.distance}>{pharmacy.distance}</Text>
      </View>

      <View style={styles.pharmacyInfo}>
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>{pharmacy.address}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={16} color={COLORS.gray} />
          <Text style={styles.infoText}>Garde: {pharmacy.hours}</Text>
        </View>

        <View style={styles.servicesContainer}>
          {pharmacy.services.map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.pharmacyActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleCall(pharmacy.phone)}
        >
          <MaterialIcons name="phone" size={20} color={COLORS.white} />
          <Text style={styles.actionButtonText}>Appeler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.directionsButton]}
          onPress={() => handleDirections(pharmacy.name, pharmacy.address)}
        >
          <MaterialIcons name="directions" size={20} color={COLORS.primary} />
          <Text style={[styles.actionButtonText, styles.directionsButtonText]}>
            Itinéraire
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmergencyCard = ({ emergency }) => (
    <TouchableOpacity
      style={styles.emergencyCard}
      onPress={() => handleCall(emergency.number)}
    >
      <View style={styles.emergencyIcon}>
        <MaterialIcons name={emergency.icon} size={24} color={COLORS.white} />
      </View>
      <View style={styles.emergencyInfo}>
        <Text style={styles.emergencyName}>{emergency.name}</Text>
        <Text style={styles.emergencyNumber}>{emergency.number}</Text>
        <Text style={styles.emergencyDescription}>{emergency.description}</Text>
      </View>
      <MaterialIcons name="phone" size={20} color={COLORS.success} />
    </TouchableOpacity>
  );

  const FilterButtons = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === "all" && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter("all")}
      >
        <Text style={[
          styles.filterButtonText,
          selectedFilter === "all" && styles.filterButtonTextActive,
        ]}>
          Toutes
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === "open" && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter("open")}
      >
        <Text style={[
          styles.filterButtonText,
          selectedFilter === "open" && styles.filterButtonTextActive,
        ]}>
          Ouvertes
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === "24h" && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedFilter("24h")}
      >
        <Text style={[
          styles.filterButtonText,
          selectedFilter === "24h" && styles.filterButtonTextActive,
        ]}>
          24h/24
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pharmacies de Garde</Text>
        <View style={{ width: 24 }} />
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Info */}
        <LinearGradient
          colors={[COLORS.pharmacyGreen, "#1B5E20"]}
          style={styles.headerInfo}
        >
          <MaterialIcons name="local-pharmacy" size={40} color={COLORS.white} />
          <Text style={styles.headerInfoTitle}>Pharmacies de Garde</Text>
          <Text style={styles.headerInfoSubtitle}>
            Trouvez une pharmacie ouverte près de chez vous
          </Text>
        </LinearGradient>

        {/* Numéros d'urgence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Numéros d'urgence</Text>
          <FlatList
            data={emergencyNumbers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <EmergencyCard emergency={item} />}
            scrollEnabled={false}
          />
        </View>

        {/* Filtres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pharmacies disponibles</Text>
          <FilterButtons />
        </View>

        {/* Liste des pharmacies */}
        <View style={styles.section}>
          <FlatList
            data={filteredPharmacies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <PharmacyCard pharmacy={item} />}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="local-pharmacy" size={60} color={COLORS.gray} />
                <Text style={styles.emptyText}>
                  Aucune pharmacie trouvée avec ces critères
                </Text>
              </View>
            )}
          />
        </View>

        {/* Informations utiles */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <MaterialIcons name="info" size={24} color={COLORS.primary} />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>Informations utiles</Text>
              <Text style={styles.infoCardText}>
                • Les pharmacies de garde assurent un service continu{"\n"}
                • Certaines pharmacies appliquent des tarifs majorés la nuit{"\n"}
                • En cas d'urgence, contactez le SAMU au 15{"\n"}
                • Gardez toujours votre ordonnance avec vous
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  headerInfo: {
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  headerInfoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 10,
    marginBottom: 5,
  },
  headerInfoSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
  },
  emergencyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    ...SHADOWS.small,
  },
  emergencyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  emergencyInfo: {
    flex: 1,
  },
  emergencyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 2,
  },
  emergencyNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.error,
    marginBottom: 2,
  },
  emergencyDescription: {
    fontSize: 12,
    color: COLORS.gray,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 5,
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  filterButtonActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  pharmacyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    ...SHADOWS.medium,
  },
  pharmacyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  pharmacyTitleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  pharmacyTitleText: {
    marginLeft: 10,
    flex: 1,
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  distance: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  pharmacyInfo: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
    flex: 1,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  serviceTag: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  serviceText: {
    fontSize: 10,
    color: COLORS.text,
    fontWeight: "500",
  },
  pharmacyActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    borderRadius: 8,
  },
  directionsButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  directionsButtonText: {
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginTop: 10,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    ...SHADOWS.small,
  },
  infoCardContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});

export default PharmaciesGardeScreen;