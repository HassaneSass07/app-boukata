import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#010080",
  secondary: "#FFD700",
  white: "#FFFFFF",
  background: "#FAFAFA",
  error: "#F44336",
  success: "#4CAF50",
  darkGray: "#757575",
};

const SHADOWS = {
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
};

const productsData = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 1299.99,
    discount: 15,
    image: "https://images.pexels.com/photos/592750/pexels-photo-592750.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "promo",
    isPromo: true,
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    price: 999.99,
    discount: 20,
    image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "promo",
    isPromo: true,
  },
  {
    id: "3",
    name: "Pizza Margherita",
    price: 12.99,
    image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "alimentation",
  },
  {
    id: "4",
    name: "Burger Premium",
    price: 15.5,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "alimentation",
  },
  {
    id: "5",
    name: "Salade César",
    price: 9.99,
    image: "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "alimentation",
  },
  {
    id: "6",
    name: "Collier Perles",
    price: 89.99,
    image: "https://images.pexels.com/photos/599643/pexels-photo-599643.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "bijoux",
  },
  {
    id: "7",
    name: "Boucles d'oreilles Or",
    price: 125.0,
    image: "https://images.pexels.com/photos/535632/pexels-photo-535632.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "bijoux",
  },
  {
    id: "8",
    name: "Bracelet Argent",
    price: 65.99,
    image: "https://images.pexels.com/photos/611652/pexels-photo-611652.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "bijoux",
  },
  {
    id: "9",
    name: "Montre Connectée",
    price: 299.99,
    discount: 10,
    image: "https://images.pexels.com/photos/523275/pexels-photo-523275.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "promo",
    isPromo: true,
  },
  {
    id: "10",
    name: "Casque Audio",
    price: 150.0,
    image: "https://images.pexels.com/photos/505740/pexels-photo-505740.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "promo",
    isPromo: true,
  },
];

const TAGS_CONFIG = [
  {
    id: "promo",
    title: "EN PROMO",
    icon: "local-offer",
    category: "promo",
  },
  {
    id: "alimentation",
    title: "TOP ALIMENTATION",
    icon: "fastfood",
    category: "alimentation",
  },
  {
    id: "bijoux",
    title: "BIJOUX DU QUOTIDIEN",
    icon: "local-mall",
    category: "bijoux",
  },
];

const Products = () => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);

  const getProductsByCategory = (category) => {
    return productsData.filter((product) => product.category === category);
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

  const TagButton = ({ tag }) => (
    <View style={styles.tagContainer}>
      <View style={styles.tagButton}>
        <MaterialIcons name={tag.icon} size={16} color={COLORS.primary} />
        <Text style={styles.tagText}>{tag.title}</Text>
      </View>
    </View>
  );

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

  const ProductSection = ({ tag }) => {
    const products = getProductsByCategory(tag.category);

    return (
      <View style={styles.section}>
        <TagButton tag={tag} />

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsScrollContainer}
        >
          {products.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nos Produits</Text>
      </View>

      <View style={styles.content}>
        {TAGS_CONFIG.map((tag) => (
          <ProductSection key={tag.id} tag={tag} />
        ))}
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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  tagContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tagButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "flex-start",
    width: "100%",
    ...SHADOWS.medium,
  },
  tagText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  productsScrollContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  productCard: {
    width: (width - 48) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
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
    backgroundColor: COLORS.secondary,
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
    color: "#333",
    marginBottom: 4,
    lineHeight: 16,
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
});

export default Products;