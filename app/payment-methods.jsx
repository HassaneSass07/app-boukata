import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

const PaymentMethodsScreen = () => {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "mobile_money",
      provider: "Orange Money",
      number: "+227 90 12 34 56",
      isDefault: true,
    },
    {
      id: "2",
      type: "mobile_money",
      provider: "Moov Money",
      number: "+227 96 78 90 12",
      isDefault: false,
    },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [newMethod, setNewMethod] = useState({
    type: "mobile_money",
    provider: "Orange Money",
    number: "",
  });

  const mobileMoneyProviders = [
    { key: "Orange Money", label: "Orange Money", color: "#FF6600" },
    { key: "Moov Money", label: "Moov Money", color: "#0066CC" },
    { key: "Airtel Money", label: "Airtel Money", color: "#FF0000" },
  ];

  const handleAddMethod = () => {
    if (!newMethod.number) {
      Alert.alert("Erreur", "Veuillez saisir le numéro de téléphone");
      return;
    }

    const method = {
      id: Date.now().toString(),
      ...newMethod,
      isDefault: paymentMethods.length === 0,
    };

    if (editingMethod) {
      setPaymentMethods(prev => 
        prev.map(m => m.id === editingMethod.id ? method : m)
      );
    } else {
      setPaymentMethods(prev => [...prev, method]);
    }

    setNewMethod({ type: "mobile_money", provider: "Orange Money", number: "" });
    setEditingMethod(null);
    setShowAddModal(false);
  };

  const handleEditMethod = (method) => {
    setEditingMethod(method);
    setNewMethod(method);
    setShowAddModal(true);
  };

  const handleDeleteMethod = (methodId) => {
    Alert.alert(
      "Supprimer le moyen de paiement",
      "Voulez-vous vraiment supprimer ce moyen de paiement ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: () => {
            setPaymentMethods(prev => prev.filter(m => m.id !== methodId));
          },
        },
      ]
    );
  };

  const handleSetDefault = (methodId) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case "Orange Money":
        return "phone";
      case "Moov Money":
        return "phone";
      case "Airtel Money":
        return "phone";
      default:
        return "payment";
    }
  };

  const getProviderColor = (provider) => {
    const providerData = mobileMoneyProviders.find(p => p.key === provider);
    return providerData ? providerData.color : COLORS.primary;
  };

  const PaymentMethodCard = ({ method }) => (
    <View style={styles.methodCard}>
      <View style={styles.methodHeader}>
        <View style={styles.methodTitleContainer}>
          <View style={[styles.providerIcon, { backgroundColor: getProviderColor(method.provider) }]}>
            <MaterialIcons
              name={getProviderIcon(method.provider)}
              size={20}
              color={COLORS.white}
            />
          </View>
          <View style={styles.methodTitleText}>
            <Text style={styles.methodProvider}>{method.provider}</Text>
            <Text style={styles.methodNumber}>{method.number}</Text>
            {method.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Par défaut</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.methodActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditMethod(method)}
          >
            <MaterialIcons name="edit" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteMethod(method.id)}
          >
            <MaterialIcons name="delete" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      {!method.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(method.id)}
        >
          <Text style={styles.setDefaultText}>Définir par défaut</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const AddMethodModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingMethod ? "Modifier le moyen de paiement" : "Ajouter un moyen de paiement"}
            </Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fournisseur Mobile Money</Text>
              <View style={styles.providerSelector}>
                {mobileMoneyProviders.map((provider) => (
                  <TouchableOpacity
                    key={provider.key}
                    style={[
                      styles.providerOption,
                      newMethod.provider === provider.key && styles.providerOptionActive,
                      { borderColor: provider.color }
                    ]}
                    onPress={() => setNewMethod({ ...newMethod, provider: provider.key })}
                  >
                    <View style={[styles.providerIconSmall, { backgroundColor: provider.color }]}>
                      <MaterialIcons name="phone" size={16} color={COLORS.white} />
                    </View>
                    <Text
                      style={[
                        styles.providerOptionText,
                        newMethod.provider === provider.key && { color: provider.color }
                      ]}
                    >
                      {provider.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Numéro de téléphone *</Text>
              <TextInput
                style={styles.textInput}
                value={newMethod.number}
                onChangeText={(text) => setNewMethod({ ...newMethod, number: text })}
                placeholder="+227 90 00 00 00"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.infoCard}>
              <MaterialIcons name="info" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>
                Assurez-vous que ce numéro est actif et peut recevoir des notifications de paiement.
              </Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleAddMethod}>
              <Text style={styles.saveButtonText}>
                {editingMethod ? "Modifier" : "Ajouter"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moyens de paiement</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <MaterialIcons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="security" size={24} color={COLORS.success} />
            <Text style={styles.infoTitle}>Paiements sécurisés</Text>
          </View>
          <Text style={styles.infoDescription}>
            Vos informations de paiement sont cryptées et sécurisées. Nous ne stockons jamais vos codes PIN.
          </Text>
        </View>

        {paymentMethods.length > 0 ? (
          <View style={styles.methodsList}>
            <Text style={styles.sectionTitle}>Mes moyens de paiement</Text>
            {paymentMethods.map((method) => (
              <PaymentMethodCard key={method.id} method={method} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="payment" size={80} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>Aucun moyen de paiement</Text>
            <Text style={styles.emptySubtitle}>
              Ajoutez un moyen de paiement pour faciliter vos achats
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.addFirstButtonText}>Ajouter un moyen de paiement</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.supportedMethods}>
          <Text style={styles.sectionTitle}>Moyens de paiement acceptés</Text>
          <View style={styles.supportedGrid}>
            {mobileMoneyProviders.map((provider) => (
              <View key={provider.key} style={styles.supportedItem}>
                <View style={[styles.supportedIcon, { backgroundColor: provider.color }]}>
                  <MaterialIcons name="phone" size={20} color={COLORS.white} />
                </View>
                <Text style={styles.supportedText}>{provider.label}</Text>
              </View>
            ))}
            
            <View style={styles.supportedItem}>
              <View style={[styles.supportedIcon, { backgroundColor: COLORS.gray }]}>
                <MaterialIcons name="payments" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.supportedText}>Paiement à la livraison</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <AddMethodModal />
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
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  infoSection: {
    backgroundColor: COLORS.white,
    margin: 20,
    padding: 20,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: 10,
  },
  infoDescription: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  methodsList: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 15,
  },
  methodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    ...SHADOWS.small,
  },
  methodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  methodTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  methodTitleText: {
    flex: 1,
  },
  methodProvider: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 5,
  },
  methodNumber: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 5,
  },
  defaultBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  defaultBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "600",
  },
  methodActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  setDefaultButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 15,
  },
  setDefaultText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  addFirstButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  addFirstButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  supportedMethods: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  supportedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  supportedItem: {
    alignItems: "center",
    width: "30%",
  },
  supportedIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  supportedText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  providerSelector: {
    gap: 10,
  },
  providerOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderRadius: 8,
  },
  providerOptionActive: {
    backgroundColor: "rgba(1,0,128,0.05)",
  },
  providerIconSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  providerOptionText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.lightGray,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentMethodsScreen;