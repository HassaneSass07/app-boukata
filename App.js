import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabLayout from "./app/(tabs)/_layout";
import SplashScreen from "./app/SplashScreen";
import { useEffect, useState } from "react";
import { CartProvider } from "./app/context/CartContext";
import { AuthProvider } from "./app/context/AuthContext";

export default function App() {



  let nom = "Samira";
  console.log("Hello " + nom);

  const [isSplashVisible, setSplashVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer style={styles.container}>
          {isSplashVisible ? <SplashScreen /> : <TabLayout />}
          <StatusBar style="light" />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});