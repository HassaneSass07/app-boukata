import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
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

// Données de recherche simulées
const allProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 1299.99,
    image: "https://images.pexels.com/photos/592750/pexels-photo-592750.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Électronique",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    price: 999.99,
    image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Électronique",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Pizza Margherita",
    price: 12.99,
    image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Alimentation",
    rating: 4.5,
  },
  {
    id: "4",
    name: "Burger Premium",
    price: 15.5,
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Alimentation",
    rating: 4.3,
  },
  {
    id: "5",
    name: "T-shirt Premium",
    price: 25.99,
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Mode",
    rating: 4.1,
  },
];

const recentSearches = [
  "iPhone",
  "Pizza",
  "Samsung",
  "T-shirt",
  "Burger",
];

const SearchScreen = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(true);

    if (query.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Simuler une recherche
    const results = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );

    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
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

  const ProductCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
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
        
        <Text style={styles.productPrice}>{item.price.toFixed(2)} FCFA</Text>
      </View>

      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <AntDesign 
            name={favorites.includes(item.id) ? "heart" : "hearto"} 
            size={16} 
            color={favorites.includes(item.id) ? COLORS.error : COLORS.gray} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <MaterialIcons name="add-shopping-cart" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const RecentSearchItem = ({ search }) => (
    <TouchableOpacity 
      style={styles.recentSearchItem}
      onPress={() => handleSearch(search)}
    >
      <MaterialIcons name="history" size={20} color={COLORS.gray} />
      <Text style={styles.recentSearchText}>{search}</Text>
      <MaterialIcons name="north-west" size={16} color={COLORS.gray} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <MaterialIcons name="clear" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        {searchQuery.length === 0 ? (
          // Écran de recherche vide
          <View style={styles.emptySearch}>
            <Text style={styles.sectionTitle}>Recherches récentes</Text>
            <FlatList
              data={recentSearches}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <RecentSearchItem search={item} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : isSearching ? (
          // État de chargement
          <View style={styles.loadingContainer}>
            <MaterialIcons name="search" size={60} color={COLORS.gray} />
            <Text style={styles.loadingText}>Recherche en cours...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          // Résultats de recherche
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              {searchResults.length} résultat{searchResults.length > 1 ? "s" : ""} pour "{searchQuery}"
            </Text>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ProductCard item={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          </View>
        ) : (
          // Aucun résultat
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="search-off" size={80} color={COLORS.gray} />
            <Text style={styles.noResultsTitle}>Aucun résultat</Text>
            <Text style={styles.noResultsSubtitle}>
              Aucun produit trouvé pour "{searchQuery}"
            </Text>
            <Text style={styles.suggestionText}>
              Essayez avec d'autres mots-clés
            </Text>
          </View>
        )}
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  emptySearch: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 15,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 8,
    ...SHADOWS.small,
  },
  recentSearchText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 15,
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 15,
  },
  resultsList: {
    paddingBottom: 20,
  },
  productCard: {
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
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  productActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  favoriteButton: {
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
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  noResultsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default SearchScreen;