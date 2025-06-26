import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  Platform,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/Header";
import { useCart } from "../../context/CartContext";
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

const FavorisScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  } = useCart();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      Alert.alert(
        "Supprimer l'article",
        "Voulez-vous supprimer cet article du panier ?",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Supprimer", onPress: () => removeFromCart(productId) },
        ]
      );
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      "Vider le panier",
      "Voulez-vous supprimer tous les articles du panier ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Vider", onPress: clearCart },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert("Panier vide", "Ajoutez des articles avant de passer commande.");
      return;
    }
    
    Alert.alert(
      "Passer commande",
      `Total: ${getCartTotal().toFixed(2)} FCFA\n\nVoulez-vous procéder au paiement ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Continuer", onPress: () => console.log("Redirection vers le paiement") },
      ]
    );
  };

  const CartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>{item.price.toFixed(2)} FCFA</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
          >
            <MaterialIcons name="remove" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
          >
            <MaterialIcons name="add" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          {(item.price * item.quantity).toFixed(2)} FCFA
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <MaterialIcons name="delete" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="shopping-cart" size={80} color={COLORS.gray} />
      <Text style={styles.emptyTitle}>Votre panier est vide</Text>
      <Text style={styles.emptySubtitle}>
        Découvrez nos produits et ajoutez-les à votre panier
      </Text>
      <TouchableOpacity style={styles.shopButton}>
        <Text style={styles.shopButtonText}>Commencer mes achats</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Mon Panier" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>Mon Panier ({items.length})</Text>
              <TouchableOpacity onPress={handleClearCart}>
                <Text style={styles.clearText}>Vider</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cartList}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </View>

            <View style={styles.summaryContainer}>
              <LinearGradient
                colors={[COLORS.primary, "#000066"]}
                style={styles.summaryGradient}
              >
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Sous-total:</Text>
                  <Text style={styles.summaryValue}>
                    {getCartTotal().toFixed(2)} FCFA
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Livraison:</Text>
                  <Text style={styles.summaryValue}>Gratuite</Text>
                </View>
                
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>
                    {getCartTotal().toFixed(2)} FCFA
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={handleCheckout}
                >
                  <Text style={styles.checkoutButtonText}>
                    Passer la commande
                  </Text>
                  <MaterialIcons
                    name="arrow-forward"
                    size={20}
                    color={COLORS.primary}
                  />
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
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  clearText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: "600",
  },
  cartList: {
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    ...SHADOWS.small,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  removeButton: {
    padding: 5,
  },
  summaryContainer: {
    margin: 20,
    borderRadius: 15,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    color: COLORS.white,
    fontSize: 16,
  },
  summaryValue: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.3)",
    paddingTop: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  totalLabel: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 10,
  },
  checkoutButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 100,
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

export default FavorisScreen;