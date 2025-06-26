import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";
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

const CheckoutScreen = () => {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("mobile");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");

  const deliveryFee = deliveryMethod === "delivery" ? 1000 : 0;
  const total = getCartTotal() + deliveryFee;

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      Alert.alert("Connexion requise", "Veuillez vous connecter pour passer commande");
      return;
    }

    if (deliveryMethod === "delivery" && !deliveryAddress.trim()) {
      Alert.alert("Adresse requise", "Veuillez saisir votre adresse de livraison");
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("Téléphone requis", "Veuillez saisir votre numéro de téléphone");
      return;
    }

    // Simuler le traitement de la commande
    Alert.alert(
      "Commande confirmée",
      "Votre commande a été passée avec succès !",
      [
        {
          text: "OK",
          onPress: () => {
            clearCart();
            router.push("/order-confirmation");
          },
        },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Commande</Text>
          <View style={{ width: 24 }} />
        </SafeAreaView>
        
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={80} color={COLORS.gray} />
          <Text style={styles.emptyTitle}>Panier vide</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez des produits à votre panier pour passer commande
          </Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.shopButtonText}>Continuer mes achats</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Finaliser la commande</Text>
        <View style={{ width: 24 }} />
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Résumé de la commande */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé de la commande</Text>
          <View style={styles.orderSummary}>
            {items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  {(item.price * item.quantity).toFixed(2)} FCFA
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mode de livraison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de livraison</Text>
          <View style={styles.deliveryOptions}>
            <TouchableOpacity
              style={[
                styles.deliveryOption,
                deliveryMethod === "delivery" && styles.deliveryOptionActive,
              ]}
              onPress={() => setDeliveryMethod("delivery")}
            >
              <MaterialIcons
                name="local-shipping"
                size={24}
                color={deliveryMethod === "delivery" ? COLORS.primary : COLORS.gray}
              />
              <View style={styles.deliveryOptionText}>
                <Text style={styles.deliveryOptionTitle}>Livraison à domicile</Text>
                <Text style={styles.deliveryOptionSubtitle}>1000 FCFA - 24-48h</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  deliveryMethod === "delivery" && styles.radioButtonActive,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deliveryOption,
                deliveryMethod === "pickup" && styles.deliveryOptionActive,
              ]}
              onPress={() => setDeliveryMethod("pickup")}
            >
              <MaterialIcons
                name="store"
                size={24}
                color={deliveryMethod === "pickup" ? COLORS.primary : COLORS.gray}
              />
              <View style={styles.deliveryOptionText}>
                <Text style={styles.deliveryOptionTitle}>Retrait en magasin</Text>
                <Text style={styles.deliveryOptionSubtitle}>Gratuit - Immédiat</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  deliveryMethod === "pickup" && styles.radioButtonActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Adresse de livraison */}
        {deliveryMethod === "delivery" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Adresse de livraison</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Entrez votre adresse complète"
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* Informations de contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de contact</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Numéro de téléphone"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Mode de paiement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mode de paiement</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "mobile" && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMethod("mobile")}
            >
              <FontAwesome5
                name="mobile-alt"
                size={24}
                color={paymentMethod === "mobile" ? COLORS.primary : COLORS.gray}
              />
              <Text style={styles.paymentOptionText}>Mobile Money</Text>
              <View
                style={[
                  styles.radioButton,
                  paymentMethod === "mobile" && styles.radioButtonActive,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "cash" && styles.paymentOptionActive,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <MaterialIcons
                name="payments"
                size={24}
                color={paymentMethod === "cash" ? COLORS.primary : COLORS.gray}
              />
              <Text style={styles.paymentOptionText}>Paiement à la livraison</Text>
              <View
                style={[
                  styles.radioButton,
                  paymentMethod === "cash" && styles.radioButtonActive,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (optionnel)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Instructions spéciales pour la livraison..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Récapitulatif des prix */}
        <View style={styles.section}>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Sous-total</Text>
              <Text style={styles.priceValue}>{getCartTotal().toFixed(2)} FCFA</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Livraison</Text>
              <Text style={styles.priceValue}>
                {deliveryFee === 0 ? "Gratuit" : `${deliveryFee} FCFA`}
              </Text>
            </View>
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)} FCFA</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bouton de commande */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
          <Text style={styles.orderButtonText}>
            Passer la commande - {total.toFixed(2)} FCFA
          </Text>
        </TouchableOpacity>
      </View>
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
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 15,
  },
  orderSummary: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 15,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  itemQuantity: {
    fontSize: 14,
    color: COLORS.gray,
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  deliveryOptions: {
    gap: 15,
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
  },
  deliveryOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(1,0,128,0.05)",
  },
  deliveryOptionText: {
    flex: 1,
    marginLeft: 15,
  },
  deliveryOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  deliveryOptionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  radioButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
    textAlignVertical: "top",
  },
  paymentOptions: {
    gap: 15,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
  },
  paymentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(1,0,128,0.05)",
  },
  paymentOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginLeft: 15,
  },
  priceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 15,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 15,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  orderButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  orderButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CheckoutScreen;