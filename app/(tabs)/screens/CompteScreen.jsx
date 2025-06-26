import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

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

// Composant LoginForm extrait et mémorisé
const LoginForm = React.memo(({ 
  loginData, 
  updateLoginData, 
  showPassword, 
  setShowPassword, 
  handleLogin, 
  setShowLoginForm, 
  setShowRegisterForm 
}) => (
  <View style={styles.formContainer}>
    <View style={styles.formHeader}>
      <Text style={styles.formTitle}>Connexion</Text>
      <TouchableOpacity onPress={() => setShowLoginForm(false)}>
        <MaterialIcons name="close" size={24} color={COLORS.gray} />
      </TouchableOpacity>
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Numéro de téléphone</Text>
      <TextInput
        style={styles.simpleInput}
        value={loginData.phone}
        onChangeText={(text) => updateLoginData('phone', text)}
        placeholder="Entrez votre numéro de téléphone"
        keyboardType="phone-pad"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Mot de passe</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordField}
          value={loginData.password}
          onChangeText={(text) => updateLoginData('password', text)}
          placeholder="Entrez votre mot de passe"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={20}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      </View>
    </View>

    <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
      <Text style={styles.submitButtonText}>SE CONNECTER</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.switchFormButton}
      onPress={() => {
        setShowLoginForm(false);
        setShowRegisterForm(true);
      }}
    >
      <Text style={styles.switchFormText}>Pas de compte ? Créer un compte</Text>
    </TouchableOpacity>
  </View>
));

// Composant RegisterForm extrait et mémorisé
const RegisterForm = React.memo(({ 
  registerData, 
  updateRegisterData, 
  showPassword, 
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  handleRegister, 
  setShowRegisterForm, 
  setShowLoginForm 
}) => (
  <View style={styles.formContainer}>
    <View style={styles.formHeader}>
      <Text style={styles.formTitle}>Créer un compte</Text>
      <TouchableOpacity onPress={() => setShowRegisterForm(false)}>
        <MaterialIcons name="close" size={24} color={COLORS.gray} />
      </TouchableOpacity>
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Nom complet *</Text>
      <TextInput
        style={styles.simpleInput}
        value={registerData.name}
        onChangeText={(text) => updateRegisterData('name', text)}
        placeholder="Entrez votre nom complet"
        autoCapitalize="words"
        autoCorrect={false}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Numéro de téléphone *</Text>
      <TextInput
        style={styles.simpleInput}
        value={registerData.phone}
        onChangeText={(text) => updateRegisterData('phone', text)}
        placeholder="+227 90 00 00 00"
        keyboardType="phone-pad"
        autoCorrect={false}
      />
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Mot de passe *</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordField}
          value={registerData.password}
          onChangeText={(text) => updateRegisterData('password', text)}
          placeholder="Entrez votre mot de passe"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={20}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Confirmer le mot de passe *</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordField}
          value={registerData.confirmPassword}
          onChangeText={(text) => updateRegisterData('confirmPassword', text)}
          placeholder="Confirmez votre mot de passe"
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <MaterialIcons
            name={showConfirmPassword ? "visibility" : "visibility-off"}
            size={20}
            color={COLORS.gray}
          />
        </TouchableOpacity>
      </View>
    </View>

    <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
      <Text style={styles.submitButtonText}>CRÉER MON COMPTE</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.switchFormButton}
      onPress={() => {
        setShowRegisterForm(false);
        setShowLoginForm(true);
      }}
    >
      <Text style={styles.switchFormText}>Déjà un compte ? Se connecter</Text>
    </TouchableOpacity>
  </View>
));

const CompteScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // États simplifiés avec un seul objet pour chaque formulaire
  const [loginData, setLoginData] = useState({
    phone: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const { user, isAuthenticated, login, register, logout } = useAuth();
  const { clearCart } = useCart();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Fonction pour mettre à jour les données de connexion
  const updateLoginData = React.useCallback((field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Fonction pour mettre à jour les données d'inscription
  const updateRegisterData = React.useCallback((field, value) => {
    setRegisterData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleLogin = React.useCallback(async () => {
    if (!loginData.phone || !loginData.password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const result = await login(loginData.phone, loginData.password);
    if (result.success) {
      Alert.alert("Succès", "Connexion réussie !");
      setShowLoginForm(false);
      setLoginData({ phone: "", password: "" });
    } else {
      Alert.alert("Erreur", result.error || "Erreur de connexion");
    }
  }, [loginData, login]);

  const handleRegister = React.useCallback(async () => {
    if (!registerData.name || !registerData.phone || !registerData.password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    const result = await register({
      name: registerData.name,
      phone: registerData.phone,
      password: registerData.password,
    });

    if (result.success) {
      Alert.alert("Succès", "Compte créé avec succès !");
      setShowRegisterForm(false);
      setRegisterData({ name: "", phone: "", password: "", confirmPassword: "" });
    } else {
      Alert.alert("Erreur", result.error || "Erreur lors de la création du compte");
    }
  }, [registerData, register]);

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        onPress: () => {
          logout();
          clearCart();
          Alert.alert("Succès", "Vous avez été déconnecté");
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: "orders",
      title: "Mes commandes",
      icon: "shopping-bag",
      onPress: () => Alert.alert("Mes commandes", "Fonctionnalité en cours de développement"),
    },
    {
      id: "addresses",
      title: "Mes adresses",
      icon: "location-on",
      onPress: () => Alert.alert("Mes adresses", "Fonctionnalité en cours de développement"),
    },
    {
      id: "payment",
      title: "Moyens de paiement",
      icon: "payment",
      onPress: () => Alert.alert("Paiement", "Fonctionnalité en cours de développement"),
    },
    {
      id: "favorites",
      title: "Mes favoris",
      icon: "favorite",
      onPress: () => Alert.alert("Favoris", "Fonctionnalité en cours de développement"),
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "notifications",
      onPress: () => Alert.alert("Notifications", "Fonctionnalité en cours de développement"),
    },
    {
      id: "help",
      title: "Aide & Support",
      icon: "help",
      onPress: () => Alert.alert("Aide", "Contactez-nous à support@boukata-ta.com"),
    },
  ];

  const UserProfile = () => (
    <View style={styles.profileSection}>
      <LinearGradient colors={[COLORS.primary, "#000066"]} style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={40} color={COLORS.white} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userPhone}>{user?.phone}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <MaterialIcons name="edit" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemLeft}>
              <MaterialIcons name={item.icon} size={24} color={COLORS.primary} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color={COLORS.error} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const GuestView = () => (
    <>
      <View style={styles.section}>
        <View style={[styles.card, styles.welcomeCard]}>
          <Text style={styles.cardTitle}>Bienvenue sur Boukata-Ta</Text>
          <Text style={styles.cardSubtitle}>
            Créez votre compte pour profiter de toutes nos fonctionnalités
          </Text>
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowRegisterForm(true)}
          >
            <Text style={styles.primaryButtonText}>Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={[styles.card, styles.loginCard]}>
          <Text style={styles.cardTitle}>Vous avez déjà un compte ?</Text>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowLoginForm(true)}
          >
            <Text style={styles.secondaryButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <Header title="Mon Compte" showSearch={false} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.content}>
          {showLoginForm && (
            <LoginForm
              loginData={loginData}
              updateLoginData={updateLoginData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              handleLogin={handleLogin}
              setShowLoginForm={setShowLoginForm}
              setShowRegisterForm={setShowRegisterForm}
            />
          )}
          
          {showRegisterForm && (
            <RegisterForm
              registerData={registerData}
              updateRegisterData={updateRegisterData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              handleRegister={handleRegister}
              setShowRegisterForm={setShowRegisterForm}
              setShowLoginForm={setShowLoginForm}
            />
          )}

          {!showLoginForm && !showRegisterForm && (
            <>{isAuthenticated ? <UserProfile /> : <GuestView />}</>
          )}
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    ...SHADOWS.medium,
  },
  // Styles simplifiés pour les formulaires
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  simpleInput: {
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  passwordField: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },
  welcomeCard: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  loginCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  formCard: {
    marginVertical: 15,
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 20,
  },
  inputLabel: {
    color: COLORS.text,
    marginBottom: 6,
    fontWeight: "500",
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  switchFormButton: {
    alignItems: "center",
  },
  switchFormText: {
    color: COLORS.primary,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  profileSection: {
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userPhone: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  editButton: {
    padding: 10,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    ...SHADOWS.medium,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    color: COLORS.error,
    fontWeight: "500",
  },
});

export default CompteScreen;