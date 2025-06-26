import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";
import Sidebar from "./Sidebar";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#010080",
  secondary: "#E7BA06",
  white: "#FFFFFF",
  background: "#FAFAFA",
  gray: "#8A8A8A",
  lightGray: "#F5F5F5",
  text: "#333333",
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

const SearchModal = ({
  searchModalOpen,
  setSearchModalOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => (
  <Modal
    visible={searchModalOpen}
    animationType="slide"
    transparent={true}
    onRequestClose={() => setSearchModalOpen(false)}
  >
    <View style={styles.searchModalOverlay}>
      <View style={styles.searchModalContent}>
        <View style={styles.searchModalHeader}>
          <Text style={styles.searchModalTitle}>Rechercher</Text>
          <TouchableOpacity onPress={() => setSearchModalOpen(false)}>
            <MaterialIcons name="close" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des produits, services..."
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            onSubmitEditing={handleSearch}
          />
        </View>
        
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const Header = ({ title = "Boukata-Ta", showSearch = true, showCart = true }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { getCartItemsCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Recherche:", searchQuery);
      setSearchModalOpen(false);
      setSearchQuery("");
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCartPress = () => {
    router.push("/(tabs)/Panier");
  };

  const handleSearchPress = () => {
    router.push("/search");
  };

  return (
    <>
      <LinearGradient
        colors={[COLORS.primary, "#000066"]}
        style={styles.header}
      >
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity 
              onPress={() => setSidebarOpen(true)} 
              style={styles.menuButton}
            >
              <MaterialIcons name="menu" size={28} color={COLORS.white} />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>{title}</Text>
            </View>

            <View style={styles.headerActions}>
              {showSearch && (
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={handleSearchPress}
                >
                  <Ionicons name="search" size={22} color={COLORS.white} />
                </TouchableOpacity>
              )}
              
              {showCart && (
                <TouchableOpacity style={styles.cartButton} onPress={handleCartPress}>
                  <MaterialIcons name="shopping-cart" size={22} color={COLORS.white} />
                  {getCartItemsCount() > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{getCartItemsCount()}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>

          {showSearch && (
            <TouchableOpacity 
              style={styles.searchBar} 
              onPress={handleSearchPress}
            >
              <Ionicons name="search" size={18} color={COLORS.gray} />
              <Text style={styles.searchPlaceholder}>
                Rechercher des produits, services...
              </Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </LinearGradient>

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <SearchModal 
        searchModalOpen={searchModalOpen}
        setSearchModalOpen={setSearchModalOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: 15,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  menuButton: {
    padding: 4,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: 12,
    padding: 4,
  },
  cartButton: {
    padding: 4,
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchPlaceholder: {
    color: COLORS.gray,
    marginLeft: 8,
    fontSize: 14,
  },
  searchModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    paddingTop: 100,
  },
  searchModalContent: {
    backgroundColor: COLORS.white,
    margin: 20,
    borderRadius: 15,
    padding: 20,
    ...SHADOWS.small,
  },
  searchModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Header;