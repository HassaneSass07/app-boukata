import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "./context/CartContext";

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
};

// Données simulées des favoris
const favoritesData = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 1299.99,
    image: "https://images.pexels.com/photos/592750/pexels-photo-592750.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Électronique",
    rating: 4.8,
    inStock: true,
  },
  {
    id: "3",
    name: "Pizza Margherita",
    price: 12.99,
    image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Alimentation",
    rating: 4.5,
    inStock: true,
  },
  {
    id: "5",
    name: "T-shirt Premium",
    price: 25.99,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Mode",
    rating: 4.1,
    inStock: false,
  },
];

const FavoritesScreen = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState(favoritesData);

  const handleAddToCart = (product) => {
    if (!product.inStock) {
      Alert.alert("Produit indisponible", "Ce produit n'est pas en stock");
      return;
    }
    
    addToCart(product);
    Alert.alert(
      "Produit ajouté",
      `${product.name} a été ajouté au panier`,
      [{ text: "OK" }]
    );
  };

  const removeFavorite = (productId) => {
    Alert.alert(
      "Supprimer des favoris",
      "Voulez-vous supprimer ce produit de vos favoris ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: () => {
            setFavorites(prev => prev.filter(item => item.id !== productId));
          },
        },
      ]
    );
  };

  const clearAllFavorites = () => {
    Alert.alert(
      "Vider les favoris",
      "Voulez-vous supprimer tous les produits de vos favoris ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Vider",
          onPress: () => setFavorites([]),
        },
      ]
    );
  };

  const FavoriteCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.favoriteCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.productCategory}>{item.category}</Text>
        
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>{item.price.toFixed(2)} FCFA</Text>
          <Text style={[
            styles.stockStatus,
            { color: item.inStock ? COLORS.success : COLORS.error }
          ]}>
            {item.inStock ? "En stock" : "Rupture"}
          </Text>
        </View>
      </View>

      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFavorite(item.id)}
        >
          <MaterialIcons name="favorite" size={20} color={COLORS.error} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.addButton,
            !item.inStock && styles.addButtonDisabled
          ]}
          onPress={() => handleAddToCart(item)}
          disabled={!item.inStock}
        >
          <MaterialIcons 
            name="add-shopping-cart" 
            size={16} 
            color={item.inStock ? COLORS.white : COLORS.gray} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={clearAllFavorites}>
            <Text style={styles.clearText}>Vider</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>

      {favorites.length > 0 ? (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.favoritesHeader}>
            <Text style={styles.favoritesCount}>
              {favorites.length} produit{favorites.length > 1 ? "s" : ""} en favoris
            </Text>
          </View>

          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FavoriteCard item={item} />}
            scrollEnabled={false}
            contentContainerStyle={styles.favoritesList}
          />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={80} color={COLORS.gray} />
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptySubtitle}>
            Ajoutez des produits à vos favoris pour les retrouver facilement
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.shopButtonText}>Découvrir des produits</Text>
          </TouchableOpacity>
        </View>
      )}
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
  clearText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  favoritesHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  favoritesCount: {
    fontSize: 14,
    color: COLORS.gray,
  },
  favoritesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  favoriteCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    ...SHADOWS.small,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  stockStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
  productActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  removeButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: COLORS.lightGray,
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

export default FavoritesScreen;