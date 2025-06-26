import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

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
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
};

const Sidebar = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [expandedOption, setExpandedOption] = useState(null);
  const slideAnimation = useRef(new Animated.Value(isOpen ? 0 : -width * 0.8)).current;
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: isOpen ? 0 : -width * 0.8,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const menuOptions = [
    { 
      id: "1", 
      title: "Accueil", 
      icon: "home", 
      iconType: "MaterialIcons",
      route: "/(tabs)"
    },
    {
      id: "2",
      title: "Supermarché",
      icon: "shopping-cart",
      iconType: "FontAwesome5",
      hasDropdown: true,
      submenu: [
        { title: "Alimentation", route: "/category/alimentation" },
        { title: "Électronique", route: "/category/electronique" },
        { title: "Mode", route: "/category/mode" },
      ]
    },
    {
      id: "3",
      title: "Boutiques",
      icon: "shopping-bag",
      iconType: "FontAwesome5",
      route: "/(tabs)/Achat"
    },
    {
      id: "4",
      title: "Pharmacie",
      icon: "medical-bag",
      iconType: "MaterialCommunityIcons",
      route: "/pharmacies-garde"
    },
    {
      id: "5",
      title: "Restaurant",
      icon: "restaurant",
      iconType: "MaterialIcons",
      route: "/category/alimentation"
    },
    { 
      id: "6", 
      title: "Hôtel", 
      icon: "hotel", 
      iconType: "MaterialIcons",
      route: "/(tabs)/Achat"
    },
    {
      id: "7",
      title: "Pharmacies de garde",
      icon: "local-pharmacy",
      iconType: "MaterialIcons",
      route: "/pharmacies-garde"
    },
    {
      id: "8",
      title: "Mes commandes",
      icon: "shopping-bag",
      iconType: "MaterialIcons",
      route: "/orders"
    },
    {
      id: "9",
      title: "Mes favoris",
      icon: "favorite",
      iconType: "MaterialIcons",
      route: "/favorites"
    },
    {
      id: "10",
      title: "Mon profil",
      icon: "person",
      iconType: "MaterialIcons",
      route: "/profile"
    },
    {
      id: "11",
      title: "Mes adresses",
      icon: "location-on",
      iconType: "MaterialIcons",
      route: "/addresses"
    },
    {
      id: "12",
      title: "Moyens de paiement",
      icon: "payment",
      iconType: "MaterialIcons",
      route: "/payment-methods"
    },
    {
      id: "13",
      title: "Notifications",
      icon: "notifications",
      iconType: "MaterialIcons",
      route: "/notifications"
    },
    {
      id: "14",
      title: "Aide & Support",
      icon: "help",
      iconType: "MaterialIcons",
      route: "/help"
    },
  ];

  const toggleDropdown = (id) => {
    setExpandedOption(expandedOption === id ? null : id);
  };

  const renderIcon = (iconName, iconType, size = 22, color = COLORS.primary) => {
    switch (iconType) {
      case "MaterialIcons":
        return <MaterialIcons name={iconName} size={size} color={color} />;
      case "FontAwesome5":
        return <FontAwesome5 name={iconName} size={size} color={color} />;
      case "Ionicons":
        return <Ionicons name={iconName} size={size} color={color} />;
      case "MaterialCommunityIcons":
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      case "Feather":
        return <Feather name={iconName} size={size} color={color} />;
      case "AntDesign":
        return <AntDesign name={iconName} size={size} color={color} />;
      default:
        return <MaterialIcons name={iconName} size={size} color={color} />;
    }
  };

  const handleMenuPress = (option) => {
    if (option.hasDropdown) {
      toggleDropdown(option.id);
    } else {
      console.log("Navigation vers:", option.route);
      router.push(option.route);
      onClose();
    }
  };

  const handleSubmenuPress = (submenuItem) => {
    console.log("Navigation vers:", submenuItem.route);
    router.push(submenuItem.route);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleLoginPress = () => {
    router.push("/(tabs)/Compte");
    onClose();
  };

  return (
    <>
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      )}

      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: slideAnimation }] },
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary, "#000066"]}
          style={styles.sidebarHeader}
        >
          <View style={styles.sidebarHeaderContent}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Feather name="user" size={22} color={COLORS.white} />
              </View>
              <View>
                {isAuthenticated ? (
                  <>
                    <Text style={styles.userName}>{user?.name || "Utilisateur"}</Text>
                    <Text style={styles.userEmail}>{user?.phone}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.userName}>Bienvenue</Text>
                    <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
                      <Text style={styles.loginButtonText}>Se connecter</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.menuContainer}>
          <View style={styles.sidebarContent}>
            {menuOptions.map((option) => (
              <View key={option.id}>
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    expandedOption === option.id && styles.menuItemActive,
                  ]}
                  onPress={() => handleMenuPress(option)}
                >
                  <View style={styles.menuItemIcon}>
                    {renderIcon(option.icon, option.iconType)}
                  </View>
                  <Text style={styles.menuItemText}>{option.title}</Text>
                  {option.hasDropdown && (
                    <View style={styles.dropdownIndicator}>
                      <MaterialIcons
                        name={
                          expandedOption === option.id
                            ? "keyboard-arrow-up"
                            : "keyboard-arrow-down"
                        }
                        size={24}
                        color={COLORS.gray}
                      />
                    </View>
                  )}
                </TouchableOpacity>

                {option.hasDropdown && expandedOption === option.id && (
                  <View style={styles.submenuContainer}>
                    {option.submenu.map((submenuItem, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.submenuItem}
                        onPress={() => handleSubmenuPress(submenuItem)}
                      >
                        <Text style={styles.submenuItemText}>{submenuItem.title}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {isAuthenticated && (
              <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
                <View style={styles.menuItemIcon}>
                  <MaterialIcons name="logout" size={22} color="#F44336" />
                </View>
                <Text style={styles.logoutText}>Déconnexion</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <TouchableOpacity style={styles.donateButton}>
            <AntDesign name="heart" size={16} color={COLORS.white} />
            <Text style={styles.donateButtonText}>Faire un don</Text>
          </TouchableOpacity>

          <View style={styles.supportActions}>
            <TouchableOpacity style={styles.supportIcon}>
              <FontAwesome5 name="whatsapp" size={22} color={COLORS.success} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportIcon}>
              <MaterialCommunityIcons name="robot" size={22} color={COLORS.secondary} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.8,
    height: "100%",
    backgroundColor: COLORS.white,
    zIndex: 20,
    ...SHADOWS.large,
  },
  sidebarHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 50 : 60,
  },
  sidebarHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 12,
  },
  closeButton: {
    padding: 4,
  },
  menuContainer: {
    flex: 1,
  },
  sidebarContent: {
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuItemActive: {
    backgroundColor: COLORS.lightGray,
  },
  menuItemIcon: {
    width: 30,
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },
  dropdownIndicator: {
    paddingLeft: 8,
  },
  submenuContainer: {
    backgroundColor: COLORS.lightGray,
    paddingLeft: 30,
  },
  submenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  submenuItemText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    marginTop: 10,
  },
  logoutText: {
    flex: 1,
    color: "#F44336",
    fontSize: 15,
    fontWeight: "500",
  },
  sidebarFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  donateButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  donateButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  supportActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  supportIcon: {
    padding: 8,
  },
});

export default Sidebar;