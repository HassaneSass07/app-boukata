import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
};

// Données simulées des boutiques
const storesData = {
  "1": {
    id: "1",
    name: "Fashion Factory",
    image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverImage: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.8,
    reviews: 156,
    category: "Mode",
    description: "Boutique de mode tendance avec les dernières collections pour hommes et femmes.",
    address: "Centre commercial Niamey Plaza, Niamey",
    phone: "+227 90 12 34 56",
    hours: "9h00 - 20h00",
    deliveryTime: "30-45 min",
    deliveryFee: "500 FCFA",
    isOpen: true,
    products: [
      {
        id: "p1",
        name: "T-shirt Premium",
        price: 25.99,
        image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.2,
      },
      {
        id: "p2",
        name: "Jeans Slim",
        price: 45.99,
        image: "https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.5,
      },
      {
        id: "p3",
        name: "Robe d'été",
        price: 35.99,
        image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.3,
      },
      {
        id: "p4",
        name: "Chemise classique",
        price: 29.99,
        image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.1,
      },
    ]
  },
  "2": {
    id: "2",
    name: "Restaurant Le Sahel",
    image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400",
    coverImage: "https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.6,
    reviews: 89,
    category: "Restaurant",
    description: "Restaurant traditionnel nigérien avec des plats authentiques et savoureux.",
    address: "Quartier Plateau, Niamey",
    phone: "+227 90 98 76 54",
    hours: "11h00 - 23h00",
    deliveryTime: "25-35 min",
    deliveryFee: "Gratuit",
    isOpen: true,
    products: [
      {
        id: "p5",
        name: "Riz au gras",
        price: 8.99,
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.7,
      },
      {
        id: "p6",
        name: "Poulet braisé",
        price: 12.99,
        image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400",
        rating: 4.8,
      },
    ]
  }
};

const StoreDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("products");

  const store = storesData[id] || storesData["1"];

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

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        
        <Text style={styles.productPrice}>{item.price.toFixed(2)} FCFA</Text>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <MaterialIcons name="add-shopping-cart" size={14} color={COLORS.white} />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{store.name}</Text>
        <TouchableOpacity>
          <MaterialIcons name="share" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <View style={styles.coverSection}>
          <Image source={{ uri: store.coverImage }} style={styles.coverImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.coverOverlay}
          />
        </View>

        {/* Store Info */}
        <View style={styles.storeInfo}>
          <View style={styles.storeHeader}>
            <Image source={{ uri: store.image }} style={styles.storeAvatar} />
            <View style={styles.storeDetails}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeCategory}>{store.category}</Text>
              
              <View style={styles.ratingRow}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <AntDesign
                      key={star}
                      name="star"
                      size={14}
                      color={star <= Math.floor(store.rating) ? "#FFD700" : COLORS.lightGray}
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>
                  {store.rating} ({store.reviews} avis)
                </Text>
              </View>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: store.isOpen ? COLORS.success : COLORS.error }]}>
              <Text style={styles.statusText}>
                {store.isOpen ? "Ouvert" : "Fermé"}
              </Text>
            </View>
          </View>

          <Text style={styles.storeDescription}>{store.description}</Text>

          {/* Store Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialIcons name="access-time" size={20} color={COLORS.primary} />
              <Text style={styles.statText}>{store.deliveryTime}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="delivery-dining" size={20} color={COLORS.primary} />
              <Text style={styles.statText}>{store.deliveryFee}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
              <Text style={styles.statText}>2.5 km</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.callButton}>
              <MaterialIcons name="phone" size={20} color={COLORS.white} />
              <Text style={styles.callButtonText}>Appeler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.directionsButton}>
              <MaterialIcons name="directions" size={20} color={COLORS.primary} />
              <Text style={styles.directionsButtonText}>Itinéraire</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsHeader}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "products" && styles.activeTab]}
              onPress={() => setActiveTab("products")}
            >
              <Text style={[
                styles.tabText,
                activeTab === "products" && styles.activeTabText
              ]}>
                Produits
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === "info" && styles.activeTab]}
              onPress={() => setActiveTab("info")}
            >
              <Text style={[
                styles.tabText,
                activeTab === "info" && styles.activeTabText
              ]}>
                Informations
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
              onPress={() => setActiveTab("reviews")}
            >
              <Text style={[
                styles.tabText,
                activeTab === "reviews" && styles.activeTabText
              ]}>
                Avis
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContent}>
            {activeTab === "products" && (
              <View style={styles.productsSection}>
                <Text style={styles.sectionTitle}>
                  Nos produits ({store.products.length})
                </Text>
                <FlatList
                  data={store.products}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => <ProductCard item={item} />}
                  contentContainerStyle={styles.productsGrid}
                  columnWrapperStyle={styles.row}
                  scrollEnabled={false}
                />
              </View>
            )}

            {activeTab === "info" && (
              <View style={styles.infoSection}>
                <View style={styles.infoItem}>
                  <MaterialIcons name="location-on" size={24} color={COLORS.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Adresse</Text>
                    <Text style={styles.infoValue}>{store.address}</Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <MaterialIcons name="phone" size={24} color={COLORS.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Téléphone</Text>
                    <Text style={styles.infoValue}>{store.phone}</Text>
                  </View>
                </View>
                
                <View style={styles.infoItem}>
                  <MaterialIcons name="access-time" size={24} color={COLORS.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Horaires</Text>
                    <Text style={styles.infoValue}>{store.hours}</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === "reviews" && (
              <View style={styles.reviewsSection}>
                <View style={styles.reviewsSummary}>
                  <Text style={styles.reviewsTitle}>Avis clients</Text>
                  <View style={styles.reviewsRating}>
                    <Text style={styles.reviewsRatingNumber}>{store.rating}</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <AntDesign
                          key={star}
                          name="star"
                          size={16}
                          color={star <= Math.floor(store.rating) ? "#FFD700" : COLORS.lightGray}
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewsCount}>({store.reviews} avis)</Text>
                  </View>
                </View>
                
                <Text style={styles.noReviewsText}>
                  Les avis détaillés seront bientôt disponibles.
                </Text>
              </View>
            )}
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
    backgroundColor: COLORS.primary,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  coverSection: {
    height: 200,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  storeInfo: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  storeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  storeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  storeCategory: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "600",
  },
  storeDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 5,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  callButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  directionsButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  directionsButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  tabsContainer: {
    backgroundColor: COLORS.white,
    marginTop: 10,
  },
  tabsHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    margin: 20,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 15,
  },
  productsGrid: {
    gap: 15,
  },
  row: {
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    ...SHADOWS.small,
  },
  productImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: COLORS.white,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
  infoSection: {
    gap: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.gray,
  },
  reviewsSection: {
    gap: 20,
  },
  reviewsSummary: {
    alignItems: "center",
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 15,
  },
  reviewsRating: {
    alignItems: "center",
  },
  reviewsRatingNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  reviewsCount: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 5,
  },
  noReviewsText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default StoreDetailScreen;