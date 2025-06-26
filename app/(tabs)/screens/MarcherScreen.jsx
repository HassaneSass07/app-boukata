import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/Header";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import Footer from "../../components/Footer";

const COLORS = {
  background: "#FAFAFA",
  primary: "#010080",
  secondary: "#E7BA06",
  white: "#FFFFFF",
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

const categories = [
  {
    id: "1",
    name: "Restaurants",
    icon: "restaurant",
    iconFamily: "MaterialIcons",
    color: COLORS.error,
    count: "150+ restaurants",
    route: "/category/alimentation",
  },
  {
    id: "2",
    name: "Supermarché",
    icon: "shopping-cart",
    iconFamily: "FontAwesome5",
    color: COLORS.success,
    count: "50+ magasins",
    route: "/category/alimentation",
  },
  {
    id: "3",
    name: "Pharmacie",
    icon: "medical-services",
    iconFamily: "MaterialIcons",
    color: COLORS.secondary,
    count: "30+ pharmacies",
    route: "/pharmacies-garde",
  },
  {
    id: "4",
    name: "Mode",
    icon: "shopping-bag",
    iconFamily: "FontAwesome5",
    color: COLORS.primary,
    count: "200+ boutiques",
    route: "/category/mode",
  },
];

const popularStores = [
  {
    id: "1",
    name: "Restaurant Le Sahel",
    category: "Restaurant",
    rating: 4.8,
    deliveryTime: "25-35 min",
    deliveryFee: "Gratuit",
    image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOpen: true,
  },
  {
    id: "2",
    name: "Supermarché Central",
    category: "Supermarché",
    rating: 4.5,
    deliveryTime: "45-60 min",
    deliveryFee: "500 FCFA",
    image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOpen: true,
  },
  {
    id: "3",
    name: "Pharmacie Moderne",
    category: "Pharmacie",
    rating: 4.9,
    deliveryTime: "15-25 min",
    deliveryFee: "Gratuit",
    image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOpen: false,
  },
  {
    id: "4",
    name: "Boutique Fashion",
    category: "Mode",
    rating: 4.6,
    deliveryTime: "30-45 min",
    deliveryFee: "300 FCFA",
    image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400",
    isOpen: true,
  },
];

const SearchBar = React.memo(({ searchQuery, setSearchQuery }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchBar}>
      <MaterialIcons name="search" size={20} color={COLORS.gray} />
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un restaurant, magasin..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={COLORS.gray}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery("")}>
          <MaterialIcons name="clear" size={20} color={COLORS.gray} />
        </TouchableOpacity>
      )}
    </View>
  </View>
));

const QuickActions = React.memo(() => {
  const router = useRouter();

  return (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Actions rapides</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => router.push("/category/alimentation")}
        >
          <MaterialIcons name="local-offer" size={24} color={COLORS.secondary} />
          <Text style={styles.quickActionText}>Promotions</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => router.push("/favorites")}
        >
          <MaterialIcons name="favorite" size={24} color={COLORS.error} />
          <Text style={styles.quickActionText}>Favoris</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => router.push("/orders")}
        >
          <MaterialIcons name="history" size={24} color={COLORS.primary} />
          <Text style={styles.quickActionText}>Historique</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => router.push("/pharmacies-garde")}
        >
          <MaterialIcons name="local-pharmacy" size={24} color={COLORS.success} />
          <Text style={styles.quickActionText}>Urgence</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const MarcherScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { isAuthenticated } = useAuth();
  const { getCartItemsCount, getCartTotal, loading: cartLoading } = useCart();

  const renderIcon = (iconName, iconFamily, size = 24, color = COLORS.white) => {
    switch (iconFamily) {
      case "MaterialIcons":
        return <MaterialIcons name={iconName} size={size} color={color} />;
      case "FontAwesome5":
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      case "AntDesign":
        return <AntDesign name={iconName} size={size} color={color} />;
      default:
        return <FontAwesome5 name={iconName} size={size} color={color} />;
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const CategoryCard = React.memo(({ category, selectedCategory, setSelectedCategory }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory === category.id && styles.categoryCardSelected,
      ]}
      onPress={() => {
        setSelectedCategory(category.id);
        router.push(category.route);
      }}
    >
      <LinearGradient
        colors={[category.color, `${category.color}CC`]}
        style={styles.categoryGradient}
      >
        <View style={styles.categoryIcon}>
          {renderIcon(category.icon, category.iconFamily, 28)}
        </View>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryCount}>{category.count}</Text>
      </LinearGradient>
    </TouchableOpacity>
  ));

  const StoreCard = React.memo(({ store }) => (
    <TouchableOpacity 
      style={styles.storeCard}
      onPress={() => router.push(`/store/${store.id}`)}
    >
      <View style={styles.storeImageContainer}>
        <Image source={{ uri: store.image }} style={styles.storeImage} />
        <View style={[styles.statusBadge, { backgroundColor: store.isOpen ? COLORS.success : COLORS.error }]}>
          <Text style={styles.statusText}>{store.isOpen ? "Ouvert" : "Fermé"}</Text>
        </View>
      </View>

      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{store.name}</Text>
        <Text style={styles.storeCategory}>{store.category}</Text>

        <View style={styles.storeDetails}>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{store.rating}</Text>
          </View>

          <View style={styles.deliveryInfo}>
            <MaterialIcons name="access-time" size={14} color={COLORS.gray} />
            <Text style={styles.deliveryText}>{store.deliveryTime}</Text>
          </View>

          <View style={styles.feeInfo}>
            <MaterialIcons name="delivery-dining" size={14} color={COLORS.gray} />
            <Text style={styles.feeText}>{store.deliveryFee}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ));

  const deliveryOptions = [
    {
      id: 1,
      icon: "motorcycle",
      title: "À livrer :",
      description: "Un livreur professionnel de Boukata-ta vous livre",
      color: COLORS.secondary,
    },
    {
      id: 2,
      icon: "utensils",
      title: "Sur place :",
      description: "Mangez sur place si c'est un restaurant",
      color: COLORS.primary,
    },
    {
      id: 3,
      icon: "car",
      title: "À emporter (DRIVE) :",
      description: "Récupérez votre commande vous-même chez le vendeur",
      color: COLORS.secondary,
    },
  ];

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header
          title="Marketplace"
          cartItemCount={getCartItemsCount()}
          onCartPress={() => Alert.alert("Panier", "Veuillez vous connecter pour gérer votre panier.")}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.updateText}>
              Cet écran se met à jour chaque minute
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <MaterialIcons name="refresh" size={16} color={COLORS.primary} />
              <Text style={styles.refreshText}>Actualiser manuellement</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.connectionCard}>
              <Text style={styles.connectionTitle}>
                Vous n'êtes pas connecté à votre compte
              </Text>
              <Text style={styles.connectionSubtitle}>
                Rendez-vous sur l'onglet Mon compte en bas à droite.
              </Text>

              <View style={styles.cartIconContainer}>
                <MaterialIcons name="shopping-basket" size={40} color={COLORS.gray} />
              </View>

              <Text style={styles.instructionText}>
                Commandez chez un vendeur et choisissez une des options :
              </Text>

              <View style={styles.deliveryOptions}>
                {deliveryOptions.map((option) => (
                  <TouchableOpacity key={option.id} style={styles.deliveryOption}>
                    <View
                      style={[
                        styles.optionIcon,
                        { backgroundColor: option.color },
                      ]}
                    >
                      <FontAwesome5 name={option.icon} size={20} color={COLORS.white} />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={[styles.optionTitle, { color: option.color }]}>
                        {option.title}
                      </Text>
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <Footer />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Marketplace"
        cartItemCount={getCartItemsCount()}
        onCartPress={() => router.push("/(tabs)/Panier")}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <QuickActions />

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Catégories</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCard
                category={item}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <View style={styles.storesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Magasins populaires</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.storesList}>
            {popularStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </View>
        </View>

        <View style={styles.promoBanner}>
          <LinearGradient
            colors={[COLORS.secondary, "#FFB000"]}
            style={styles.promoGradient}
          >
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>Livraison gratuite</Text>
              <Text style={styles.promoSubtitle}>
                Sur votre première commande de plus de 5000 FCFA
              </Text>
              <TouchableOpacity style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Commander maintenant</Text>
              </TouchableOpacity>
            </View>
            <MaterialIcons name="local-shipping" size={60} color="rgba(1,0,128,0.3)" />
          </LinearGradient>
        </View>

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
  header: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  updateText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 10,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  refreshText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 8,
    fontWeight: "500",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  connectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 30,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  connectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  connectionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 30,
  },
  cartIconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
  },
  deliveryOptions: {
    gap: 20,
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
    minHeight: Platform.OS === 'ios' ? 30 : 40,
    paddingVertical: Platform.OS === 'ios' ? 0 : 0,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickAction: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    width: "22%",
    ...SHADOWS.small,
  },
  quickActionText: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 8,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  categoriesList: {
    paddingRight: 20,
  },
  categoryCard: {
    marginRight: 15,
    borderRadius: 15,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  categoryCardSelected: {
    transform: [{ scale: 1.05 }],
  },
  categoryGradient: {
    padding: 20,
    alignItems: "center",
    width: 120,
    height: 120,
  },
  categoryIcon: {
    marginBottom: 10,
  },
  categoryName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  categoryCount: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    textAlign: "center",
  },
  storesSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  storesList: {
    paddingBottom: 10,
  },
  storeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    ...SHADOWS.small,
  },
  storeImageContainer: {
    position: "relative",
    height: 120,
  },
  storeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "600",
  },
  storeInfo: {
    padding: 15,
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  storeCategory: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 10,
  },
  storeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "500",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.gray,
  },
  feeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  feeText: {
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.gray,
  },
  promoBanner: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 15,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  promoGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  promoSubtitle: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 15,
    lineHeight: 20,
  },
  promoButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  promoButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default MarcherScreen;