import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  FlatList,
  ImageBackground,
  Platform,
} from "react-native";
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Test from "../../TestScreen/TestAcces";
import Products from "../../components/Products";

const { width } = Dimensions.get("window");

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

const promotions = [
  {
    id: "promo1",
    title: "Créez votre boutique en ligne",
    description: "Faites le premier pas vers la création de votre propre boutique",
    ctaText: "Démarrer maintenant",
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "promo2",
    title: "Simplifiez votre quotidien",
    description: "Tous vos produits et services préférés en un seul endroit",
    ctaText: "Découvrir",
    image: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "promo3",
    title: "Livraison express",
    description: "Recevez vos commandes en un temps record",
    ctaText: "Commander",
    image: "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const topStores = [
  {
    id: "b1",
    name: "Fashion Factory",
    image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.8,
  },
  {
    id: "b2",
    name: "Sidibe Store",
    image: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.5,
  },
  {
    id: "b3",
    name: "Targui Store",
    image: "https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.7,
  },
  {
    id: "b4",
    name: "Marhaba Dream",
    image: "https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=400",
    rating: 4.6,
  },
];

const HeroBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.heroBannerContainer}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={promotions}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.floor(
            event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width
          );
          setActiveIndex(slideIndex);
        }}
        renderItem={({ item }) => (
          <View style={styles.heroBannerSlide}>
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.heroBannerImage}
              imageStyle={{ borderRadius: 12 }}
              resizeMode="cover"
            >
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.heroBannerOverlay}
              >
                <View style={styles.heroBannerContent}>
                  <Text style={styles.heroBannerTitle}>{item.title}</Text>
                  <Text style={styles.heroBannerDescription}>{item.description}</Text>
                  <TouchableOpacity style={styles.heroBannerButton}>
                    <Text style={styles.heroBannerButtonText}>{item.ctaText}</Text>
                    <MaterialIcons name="arrow-forward" size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
        )}
      />

      <View style={styles.paginationContainer}>
        {promotions.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index && styles.paginationActiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const TopStoresList = () => {
  return (
    <View style={styles.storeSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Boutiques</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Voir tout</Text>
          <MaterialIcons name="arrow-forward" size={14} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={topStores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.storeCard}>
            <Image source={{ uri: item.image }} style={styles.storeImage} />
            <Text style={styles.storeName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.storeList}
      />
    </View>
  );
};

const CreateStorePromo = () => {
  return (
    <TouchableOpacity style={styles.createStorePromo}>
      <LinearGradient
        colors={[COLORS.primary, "#000066"]}
        style={styles.createStoreGradient}
      >
        <View style={styles.createStoreContent}>
          <View style={styles.createStoreTextContent}>
            <Text style={styles.createStoreTitle}>
              Voulez-vous lancer votre boutique en ligne aujourd'hui ?
            </Text>
            <Text style={styles.createStoreDesc}>
              Faites le premier pas vers la création de votre propre boutique en ligne.
            </Text>
            <TouchableOpacity style={styles.createStoreButton}>
              <Text style={styles.createStoreButtonText}>Créer ma boutique</Text>
              <MaterialIcons name="arrow-forward" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.createStoreImageContainer}>
            <MaterialCommunityIcons
              name="store"
              size={60}
              color="rgba(255,255,255,0.3)"
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Boukata-Ta" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <HeroBanner />
        <Test />
        <TopStoresList />
        <CreateStorePromo />
        <Products />
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
  contentContainer: {
    paddingBottom: 100,
  },
  heroBannerContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 24,
  },
  heroBannerSlide: {
    width: width - 32,
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
  },
  heroBannerImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  heroBannerOverlay: {
    height: "100%",
    justifyContent: "flex-end",
    padding: 16,
    borderRadius: 12,
  },
  heroBannerContent: {
    width: "70%",
  },
  heroBannerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  heroBannerDescription: {
    color: COLORS.white,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  heroBannerButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  heroBannerButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 3,
  },
  paginationActiveDot: {
    backgroundColor: COLORS.secondary,
    width: 16,
  },
  storeSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: COLORS.secondary,
    fontSize: 14,
    marginRight: 4,
  },
  storeList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  storeCard: {
    width: 100,
    marginRight: 12,
    alignItems: "center",
  },
  storeImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    backgroundColor: COLORS.lightGray,
    ...SHADOWS.small,
  },
  storeName: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
  },
  createStorePromo: {
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: 12,
    overflow: "hidden",
    ...SHADOWS.medium,
  },
  createStoreGradient: {
    borderRadius: 12,
  },
  createStoreContent: {
    flexDirection: "row",
    padding: 16,
  },
  createStoreTextContent: {
    flex: 1,
    paddingRight: 12,
  },
  createStoreTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  createStoreDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  createStoreButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  createStoreButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
    marginRight: 8,
  },
  createStoreImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
});

export default HomeScreen;