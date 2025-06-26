import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
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
};

const SHADOWS = {
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
};

const OrderConfirmationScreen = () => {
  const router = useRouter();

  const orderNumber = "BT" + Date.now().toString().slice(-6);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.successContainer}>
            <LinearGradient
              colors={[COLORS.success, "#45A049"]}
              style={styles.successIcon}
            >
              <MaterialIcons name="check" size={60} color={COLORS.white} />
            </LinearGradient>
            
            <Text style={styles.successTitle}>Commande confirmée !</Text>
            <Text style={styles.successSubtitle}>
              Votre commande a été passée avec succès
            </Text>
          </View>

          <View style={styles.orderDetails}>
            <View style={styles.orderCard}>
              <Text style={styles.orderCardTitle}>Détails de la commande</Text>
              
              <View style={styles.orderInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Numéro de commande:</Text>
                  <Text style={styles.infoValue}>{orderNumber}</Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date:</Text>
                  <Text style={styles.infoValue}>
                    {new Date().toLocaleDateString('fr-FR')}
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Statut:</Text>
                  <Text style={[styles.infoValue, { color: COLORS.success }]}>
                    En préparation
                  </Text>
                </View>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Livraison estimée:</Text>
                  <Text style={styles.infoValue}>24-48h</Text>
                </View>
              </View>
            </View>

            <View style={styles.nextSteps}>
              <Text style={styles.nextStepsTitle}>Prochaines étapes</Text>
              
              <View style={styles.stepsList}>
                <View style={styles.step}>
                  <View style={styles.stepIcon}>
                    <MaterialIcons name="inventory" size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Préparation</Text>
                    <Text style={styles.stepDescription}>
                      Votre commande est en cours de préparation
                    </Text>
                  </View>
                </View>
                
                <View style={styles.step}>
                  <View style={styles.stepIcon}>
                    <MaterialIcons name="local-shipping" size={20} color={COLORS.gray} />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Expédition</Text>
                    <Text style={styles.stepDescription}>
                      Votre commande sera expédiée sous peu
                    </Text>
                  </View>
                </View>
                
                <View style={styles.step}>
                  <View style={styles.stepIcon}>
                    <MaterialIcons name="home" size={20} color={COLORS.gray} />
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Livraison</Text>
                    <Text style={styles.stepDescription}>
                      Réception de votre commande
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Besoin d'aide ?</Text>
              <Text style={styles.contactText}>
                Contactez notre service client au +227 90 00 00 00 ou par email à support@boukata-ta.com
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.trackButton}
            onPress={() => router.push("/orders")}
          >
            <MaterialIcons name="track-changes" size={20} color={COLORS.white} />
            <Text style={styles.trackButtonText}>Suivre ma commande</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.continueButtonText}>Continuer mes achats</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 24,
  },
  orderDetails: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  orderCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  orderInfo: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  nextSteps: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  stepsList: {
    gap: 15,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
  contactInfo: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  actionButtons: {
    gap: 15,
    paddingVertical: 20,
  },
  trackButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 25,
  },
  trackButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  continueButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OrderConfirmationScreen;