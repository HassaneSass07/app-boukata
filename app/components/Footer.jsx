import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const isTablet = width > 768; // This might need adjustment based on your tablet definition

// Payment icons data
const paymentIcons = [
  { name: "Nita", image: "https://www.boukata-ta.com/1737453573362.jpg" },
  { name: "Amanata", image: "https://www.boukata-ta.com/1737453619271.jpg" },
  { name: "Zeyna", image: "https://www.boukata-ta.com/1737453648317.jpg" },
  { name: "Al Izza", image: "https://www.boukata-ta.com/1737453693041.jpg" },
  { name: "Airtel", image: "https://www.boukata-ta.com/1737453781099.jpg" },
  { name: "Zamani", image: "https://www.boukata-ta.com/1737453898534.jpg" },
  { name: "Moov Money", image: "https://www.boukata-ta.com/1737453926552.jpg" },
  {
    name: "Master card",
    image: "https://www.boukata-ta.com/1737453966600.jpg",
  },
  {
    name: "Visa",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTvw10q8UEI9-Pd4QJ5getpNSCZiuvzP0fMw&s",
  },
];

const Footer = () => {
  // Animation for the main component's appearance
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]); // Added fadeAnim to dependency array

  // Split payment methods into two rows for display
  const firstRowPayments = paymentIcons.slice(0, 5);
  const secondRowPayments = paymentIcons.slice(5);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      {/* Main Section with enhanced gradient */}
      <LinearGradient
        colors={["#0F0F98", "#010080", "#00005A"]}
        style={styles.mainContent}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Komipay Section */}
        <View style={styles.komipayContainer}>
          <LinearGradient
            colors={["#010080", "#0F0F98"]}
            style={styles.komipayContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.komipayHeader}>
              <View style={styles.logoKomipay}>
                <Image
                  source={{ uri: "https://www.boukata-ta.com/komipay.jpg" }}
                  style={styles.komipayLogo}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.komipayTextContainer}>
                <Text style={styles.komipayTitle} numberOfLines={2} >
                  Mode de paiement avec Komipay
                </Text>
                <Text style={styles.komipaySubtitle}>
                  Plusieurs options pour faciliter vos achats
                </Text>
              </View>
            </View>

            {/* Enhanced Payment Methods Display */}
            <View style={styles.paymentSection}>
              {/* First row of payment methods */}
              <View style={styles.paymentRow}>
                {firstRowPayments.map((payment, index) => (
                  <View key={index} style={styles.paymentMethod}>
                    <View style={styles.paymentLogoContainer}>
                      <Image
                        source={{ uri: payment.image }}
                        style={styles.paymentLogo}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                ))}
              </View>

              {/* Second row of payment methods */}
              <View style={[styles.paymentRow, { justifyContent: "center" }]}>
                {secondRowPayments.map((payment, index) => (
                  <View key={index} style={styles.paymentMethod}>
                    <View style={styles.paymentLogoContainer}>
                      <Image
                        source={{ uri: payment.image }}
                        style={styles.paymentLogo}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>

      {/* Curved separation at the bottom */}
      <View style={styles.curveSeparator}>
        <View style={styles.curveInner} />
      </View>

      {/* Bottom section with Copyright */}
      <View style={styles.copyrightSection}>
        <Text style={styles.copyrightText}>
          © {new Date().getFullYear()} Boukata-ta. Tous droits réservés.
        </Text>
        <Text style={styles.madeInNigerText}>Fait avec ❤️ au Niger</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    marginBottom: 70,
  },
  mainContent: {
    paddingTop: 30,
    zIndex: 3,
  },
  komipayContainer: {
    zIndex: 3,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  komipayContent: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  komipayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
  },
  logoKomipay: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#E7BA06",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    overflow: "hidden",
  },
  komipayLogo: {
    width: "100%",
    height: "100%",
  },
  komipayTextContainer: {
    flex: 1,
  },
  komipayTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "nowrap",
  },
  komipaySubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },

  // Payment Methods Section
  paymentSection: {
    width: "100%",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  paymentMethod: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  paymentLogoContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  paymentLogo: {
    width: "100%",
    height: "100%",
  },

  // Curved Separator
  curveSeparator: {
    height: 50,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#00005A", 
  },
  curveInner: {
    position: "absolute",
    top: -50,
    width: "150%",
    height: 100,
    borderRadius: 100,
    left: "-25%",
    backgroundColor: "#f8f9fa",
    zIndex: 1,
  },

  // Copyright Section
  copyrightSection: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  copyrightText: {
    color: "#010080",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  madeInNigerText: {
    color: "#010080",
    fontSize: 12,
  },
});

export default Footer;