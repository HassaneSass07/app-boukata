import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Platform,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";

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
  purple: "#8E44AD",
  // abassa
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

// --- HOISTED COMPONENTS START HERE ---

// BenefitsTab component
const BenefitsTab = ({ benefits }) => (
  <View style={styles.tabContent}>
    <Text style={styles.sectionTitle}>Pourquoi vendre sur Boukata-Ta ?</Text>
    <View style={styles.benefitsGrid}>
      {benefits.map((benefit) => (
        <View key={benefit.id} style={styles.benefitCard}>
          <View style={[styles.benefitIcon, { backgroundColor: benefit.color }]}>
            <MaterialIcons name={benefit.icon} size={30} color={COLORS.white} />
          </View>
          <Text style={styles.benefitTitle}>{benefit.title}</Text>
          <Text style={styles.benefitDescription}>{benefit.description}</Text>
        </View>
      ))}
    </View>
  </View>
);

// FeaturesTab component
const FeaturesTab = ({ features }) => (
  <View style={styles.tabContent}>
    <Text style={styles.sectionTitle}>Fonctionnalités incluses</Text>
    <View style={styles.featuresList}>
      {features.map((feature) => (
        <View key={feature.id} style={styles.featureItem}>
          <View style={styles.featureIconContainer}>
            <MaterialIcons name={feature.icon} size={24} color={COLORS.primary} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);     

// StepsTab component
const StepsTab = ({ steps }) => (
  <View style={styles.tabContent}>
    <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
    <View style={styles.stepsList}>
      {steps.map((step, index) => (
        <View key={step.id} style={styles.stepItem}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
          <MaterialIcons name={step.icon} size={24} color={COLORS.secondary} />
        </View>
      ))}
    </View>
  </View>
);

// CreateStoreForm component
const CreateStoreForm = ({ storeData, setStoreData, handleCreateStore, setShowCreateStoreForm }) => (
  <View style={styles.formContainer}>
    <View style={styles.formHeader}>
      <Text style={styles.formTitle}>Créer ma boutique</Text>
      <TouchableOpacity onPress={() => setShowCreateStoreForm(false)}>
        <MaterialIcons name="close" size={24} color={COLORS.gray} />
      </TouchableOpacity>
    </View>

    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nom de la boutique *</Text>
        <TextInput
          style={styles.textInput}
          value={storeData.name}
          onChangeText={(text) => setStoreData({ ...storeData, name: text })}
          placeholder="Ex: Ma Super Boutique"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Description *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={storeData.description}
          onChangeText={(text) => setStoreData({ ...storeData, description: text })}
          placeholder="Décrivez votre boutique et vos produits..."
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Catégorie *</Text>
        <View style={styles.categoryGrid}>
          {["Alimentation", "Mode", "Électronique", "Beauté", "Maison", "Autre"].map(
            (category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  storeData.category === category && styles.categoryButtonActive,
                ]}
                onPress={() => setStoreData({ ...storeData, category })}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    storeData.category === category && styles.categoryButtonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Téléphone</Text>
        <TextInput
          style={styles.textInput}
          value={storeData.phone}
          onChangeText={(text) => setStoreData({ ...storeData, phone: text })}
          placeholder="+227 90 00 00 00"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Adresse</Text>
        <TextInput
          style={styles.textInput}
          value={storeData.address}
          onChangeText={(text) => setStoreData({ ...storeData, address: text })}
          placeholder="Votre adresse complète"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email de contact</Text>
        <TextInput
          style={styles.textInput}
          value={storeData.email}
          onChangeText={(text) => setStoreData({ ...storeData, email: text })}
          placeholder="contact@maboutique.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleCreateStore}>
        <Text style={styles.submitButtonText}>CRÉER MA BOUTIQUE</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

// --- HOISTED COMPONENTS END HERE ---


const VendeurScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateStoreForm, setShowCreateStoreForm] = useState(false);
  const [activeTab, setActiveTab] = useState("benefits");

  const { isAuthenticated } = useAuth();

  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    category: "",
    phone: "",
    address: "",
    email: "",
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const benefits = [
    {
      id: "1",
      title: "Zéro commission",
      description: "Gardez 100% de vos revenus",
      icon: "money-off",
      color: COLORS.success,
    },
    {
      id: "2",
      title: "Visibilité maximale",
      description: "Touchez des milliers de clients",
      icon: "visibility",
      color: COLORS.primary,
    },
    {
      id: "3",
      title: "Outils gratuits",
      description: "Gestion complète de votre boutique",
      icon: "build",
      color: COLORS.secondary,
    },
    {
      id: "4",
      title: "Support 24/7",
      description: "Assistance technique permanente",
      icon: "support-agent",
      color: COLORS.purple,
    },
  ];

  const features = [
    {
      id: "1",
      title: "Catalogue produits",
      description: "Ajoutez et gérez vos produits facilement",
      icon: "inventory",
    },
    {
      id: "2",
      title: "Gestion des commandes",
      description: "Suivez vos ventes en temps réel",
      icon: "shopping-cart",
    },
    {
      id: "3",
      title: "Paiements sécurisés",
      description: "Recevez vos paiements rapidement",
      icon: "payment",
    },
    {
      id: "4",
      title: "Analytics",
      description: "Analysez vos performances",
      icon: "analytics",
    },
  ];

  const steps = [
    {
      id: "1",
      title: "Inscription",
      description: "Créez votre compte vendeur gratuitement",
      icon: "person-add",
    },
    {
      id: "2",
      title: "Configuration",
      description: "Configurez votre boutique et ajoutez vos produits",
      icon: "settings",
    },
    {
      id: "3",
      title: "Validation",
      description: "Notre équipe valide votre boutique",
      icon: "verified",
    },
    {
      id: "4",
      title: "Vente",
      description: "Commencez à vendre et générer des revenus",
      icon: "trending-up",
    },
  ];

  const handleCreateStore = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour créer une boutique. Rendez-vous dans l'onglet Compte.",
        [{ text: "OK" }]
      );
      return;
    }

    if (!storeData.name || !storeData.description || !storeData.category) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    Alert.alert(
      "Demande envoyée",
      "Votre demande de création de boutique a été envoyée. Notre équipe vous contactera sous 24h.",
      [
        {
          text: "OK",
          onPress: () => {
            setShowCreateStoreForm(false);
            setStoreData({
              name: "",
              description: "",
              category: "",
              phone: "",
              address: "",
              email: "",
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Devenir Vendeur" showSearch={false} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {showCreateStoreForm ? (
          <CreateStoreForm
            storeData={storeData}
            setStoreData={setStoreData}
            handleCreateStore={handleCreateStore}
            setShowCreateStoreForm={setShowCreateStoreForm}
          />
        ) : (
          <>
            <LinearGradient
              colors={[COLORS.primary, "#000066"]}
              style={styles.heroSection}
            >
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Devenez Vendeur</Text>
                <Text style={styles.heroSubtitle}>
                  Créez votre boutique en ligne et vendez vos produits à des milliers de clients
                </Text>
                <TouchableOpacity
                  style={styles.heroButton}
                  onPress={() => setShowCreateStoreForm(true)}
                >
                  <Text style={styles.heroButtonText}>Commencer maintenant</Text>
                  <MaterialIcons name="arrow-forward" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.heroImageContainer}>
                <MaterialIcons name="store" size={80} color="rgba(255,255,255,0.3)" />
              </View>
            </LinearGradient>

            <View style={styles.statsSection}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1000+</Text>
                <Text style={styles.statLabel}>Vendeurs actifs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50K+</Text>
                <Text style={styles.statLabel}>Commandes/mois</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0%</Text>
                <Text style={styles.statLabel}>Commission</Text>
              </View>
            </View>

            <View style={styles.tabsContainer}>
              <View style={styles.tabsHeader}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === "benefits" && styles.activeTab]}
                  onPress={() => setActiveTab("benefits")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "benefits" && styles.activeTabText,
                    ]}
                  >
                    Avantages
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === "features" && styles.activeTab]}
                  onPress={() => setActiveTab("features")}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "features" && styles.activeTabText,
                    ]}
                  >
                    Fonctionnalités
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, activeTab === "steps" && styles.activeTab]}
                  onPress={() => setActiveTab("steps")}
                >
                  <Text
                    style={[styles.tabText, activeTab === "steps" && styles.activeTabText]}
                  >
                    Comment ça marche
                  </Text>
                </TouchableOpacity>
              </View>

              {activeTab === "benefits" && <BenefitsTab benefits={benefits} />}
              {activeTab === "features" && <FeaturesTab features={features} />}
              {activeTab === "steps" && <StepsTab steps={steps} />}
            </View>

            <View style={styles.ctaSection}>
              <LinearGradient
                colors={[COLORS.secondary, "#FFB000"]}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaTitle}>Prêt à commencer ?</Text>
                <Text style={styles.ctaSubtitle}>
                  Rejoignez des milliers de vendeurs qui font confiance à Boukata-Ta
                </Text>
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => setShowCreateStoreForm(true)}
                >
                  <Text style={styles.ctaButtonText}>CRÉER MA BOUTIQUE</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </>
        )}

        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
  },
  heroContent: {
    flex: 1,
    paddingRight: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 24,
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  heroImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 30,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    ...SHADOWS.medium,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "center",
  },
  tabsContainer: {
    margin: 20,
  },
  tabsHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  tabText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  tabContent: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    ...SHADOWS.small,
  },
  benefitIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 5,
    textAlign: "center",
  },
  benefitDescription: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 16,
  },
  featuresList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(1,0,128,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 3,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
  stepsList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  stepNumberText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 3,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
  ctaSection: {
    margin: 20,
    borderRadius: 15,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  ctaGradient: {
    padding: 30,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  formContainer: {
    backgroundColor: COLORS.white,
    margin: 20,
    borderRadius: 15,
    padding: 20,
    ...SHADOWS.medium,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top", // Ensures text starts from the top for multiline
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryButton: {
    width: "48%", // Roughly half-width, adjust as needed for spacing
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: "center",
    marginBottom: 10,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryButtonTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10, // Add some space above the button
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VendeurScreen;