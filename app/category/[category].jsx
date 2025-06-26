import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCart } from "../context/CartContext";

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

// Données de produits par catégorie
const categoryProducts = {
  "alimentation": [
    {
      id: "3",
      name: "Pizza Margherita",
      price: 12.99,
      image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "alimentation",
      rating: 4.5,
    },
    {
      id: "4",
      name: "Burger Premium",
      price: 15.5,
      image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "alimentation",
      rating: 4.3,
    },
    {
      id: "5",
      name: "Salade César",
      price: 9.99,
      image: "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "alimentation",
      rating: 4.2,
    },
  ],
  "electronique": [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      price: 1299.99,
      discount: 15,
      image: "https://images.pexels.com/photos/592750/pexels-photo-592750.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "electronique",
      isPromo: true,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Samsung Galaxy S24",
      price: 999.99,
      discount: 20,
      image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "electronique",
      isPromo: true,
      rating: 4.6,
    },
  ],
  "mode": [
    {
      id: "6",
      name: "T-shirt Premium",
      price: 25.99,
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "mode",
      rating: 4.1,
    },
    {
      id: "7",
      name: "Jeans Slim",
      price: 45.99,
      image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400",
      category: "mode",
      rating: 4.4,
    },
  ],
};

const CategoryScreen = () => {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState("default");
  const [favorites, setFavorites] = useState([]);

  const products = categoryProducts[category.toLowerCase()] || [];

  const getCategoryTitle = (cat) => {
    switch (cat.toLowerCase()) {
      case "alimentation":
        return "Alimentation";
      case "electronique":
        return "Électronique";
      case "mode":
        return "Mode & Vêtements";
      default:
        return cat;
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert(
      "Produit ajouté",
      `${product.name} a été ajouté au panier`,
      [{ text: "OK" }]
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const sortProducts = (products) => {
    switch (sortBy) {
      case "price_low":
        return [...products].sort((a, b) => a.price - b.price);
      case "price_high":
        return [...products].sort((a, b) => b.price - a.price);
      case "rating":
        return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "name":
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return products;
    }
  };

  const ProductCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />

        {item.isPromo && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeText}>-{item.discount}%</Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <AntDesign 
            name={favorites.includes(item.id) ? "heart" : "hearto"} 
            size={14} 
            color={favorites.includes(item.id) ? COLORS.error : COLORS.primary} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        {item.rating && (
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        )}
        
        <Text style={styles.productPrice}>{item.price.toFixed(2)} FCFA</Text>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <MaterialIcons
            name="add-shopping-cart"
            size={14}
            color={COLORS.white}
          />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const SortModal = () => (
    <View style={styles.sortContainer}>
      <Text style={styles.sortTitle}>Trier par:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: "default", label: "Par défaut" },
          { key: "price_low", label: "Prix croissant" },
          { key: "price_high", label: "Prix décroissant" },
          { key: "rating", label: "Note" },
          { key: "name", label: "Nom" },
        ].map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.sortOption,
              sortBy === option.key && styles.sortOptionActive,
            ]}
            onPress={() => setSortBy(option.key)}
          >
            <Text
              style={[
                styles.sortOptionText,
                sortBy === option.key && styles.sortOptionTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getCategoryTitle(category)}</Text>
        <TouchableOpacity>
          <MaterialIcons name="search" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <SortModal />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.productsHeader}>
          <Text style={styles.productsCount}>
            {products.length} produit{products.length > 1 ? "s" : ""} trouvé{products.length > 1 ? "s" : ""}
          </Text>
        </View>

        {products.length > 0 ? (
          <FlatList
            data={sortProducts(products)}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <ProductCard item={item} />}
            contentContainerStyle={styles.productsGrid}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inventory" size={80} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>Aucun produit</Text>
            <Text style={styles.emptySubtitle}>
              Aucun produit trouvé dans cette catégorie
            </Text>
          </View>
        )}
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
  sortContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sortTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },
  sortOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 10,
  },
  sortOptionActive: {
    backgroundColor: COLORS.primary,
  },
  sortOptionText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "500",
  },
  sortOptionTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  productsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  productsCount: {
    fontSize: 14,
    color: COLORS.gray,
  },
  productsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  productCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    ...SHADOWS.small,
  },
  imageContainer: {
    position: "relative",
    height: 120,
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  promoBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: COLORS.error,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  promoBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: COLORS.white,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.small,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 16,
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
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
});

export default CategoryScreen;