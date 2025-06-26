import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
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

const faqData = [
  {
    id: "1",
    question: "Comment passer une commande ?",
    answer: "Pour passer une commande, ajoutez les produits souhaités à votre panier, puis cliquez sur 'Passer commande'. Suivez les étapes pour saisir vos informations de livraison et de paiement.",
  },
  {
    id: "2",
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons les paiements par Mobile Money (Orange Money, Moov Money, Airtel Money) et le paiement à la livraison.",
  },
  {
    id: "3",
    question: "Combien de temps prend la livraison ?",
    answer: "La livraison standard prend entre 24 à 48 heures dans Niamey. Pour les autres villes, comptez 2 à 5 jours ouvrables.",
  },
  {
    id: "4",
    question: "Puis-je annuler ma commande ?",
    answer: "Vous pouvez annuler votre commande dans les 2 heures suivant la confirmation, tant qu'elle n'a pas été expédiée.",
  },
  {
    id: "5",
    question: "Comment suivre ma commande ?",
    answer: "Vous pouvez suivre votre commande dans la section 'Mes commandes' de votre compte. Vous recevrez également des notifications SMS.",
  },
];

const contactOptions = [
  {
    id: "1",
    title: "Appelez-nous",
    subtitle: "+227 90 00 00 00",
    icon: "phone",
    iconFamily: "MaterialIcons",
    action: () => Linking.openURL("tel:+22790000000"),
  },
  {
    id: "2",
    title: "WhatsApp",
    subtitle: "Chat en direct",
    icon: "whatsapp",
    iconFamily: "FontAwesome5",
    action: () => Linking.openURL("https://wa.me/22790000000"),
  },
  {
    id: "3",
    title: "Email",
    subtitle: "support@boukata-ta.com",
    icon: "email",
    iconFamily: "MaterialIcons",
    action: () => Linking.openURL("mailto:support@boukata-ta.com"),
  },
];

const HelpScreen = () => {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleSubmitContact = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    Alert.alert(
      "Message envoyé",
      "Votre message a été envoyé avec succès. Notre équipe vous répondra dans les plus brefs délais.",
      [
        {
          text: "OK",
          onPress: () => {
            setContactForm({ name: "", email: "", subject: "", message: "" });
          },
        },
      ]
    );
  };

  const renderIcon = (iconName, iconFamily) => {
    switch (iconFamily) {
      case "FontAwesome5":
        return <FontAwesome5 name={iconName} size={24} color={COLORS.primary} />;
      case "MaterialIcons":
      default:
        return <MaterialIcons name={iconName} size={24} color={COLORS.primary} />;
    }
  };

  const FAQItem = ({ item }) => (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => toggleFaq(item.id)}
      >
        <Text style={styles.faqQuestionText}>{item.question}</Text>
        <MaterialIcons
          name={expandedFaq === item.id ? "expand-less" : "expand-more"}
          size={24}
          color={COLORS.primary}
        />
      </TouchableOpacity>
      
      {expandedFaq === item.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </View>
  );

  const ContactOption = ({ option }) => (
    <TouchableOpacity style={styles.contactOption} onPress={option.action}>
      <View style={styles.contactIcon}>
        {renderIcon(option.icon, option.iconFamily)}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{option.title}</Text>
        <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
      </View>
      <MaterialIcons name="arrow-forward" size={20} color={COLORS.gray} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide & Support</Text>
        <View style={{ width: 24 }} />
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Section Contact rapide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contactez-nous</Text>
          <View style={styles.contactOptions}>
            {contactOptions.map((option) => (
              <ContactOption key={option.id} option={option} />
            ))}
          </View>
        </View>

        {/* Section FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions fréquentes</Text>
          <View style={styles.faqContainer}>
            {faqData.map((item) => (
              <FAQItem key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Formulaire de contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nous contacter</Text>
          <View style={styles.contactForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom complet *</Text>
              <TextInput
                style={styles.textInput}
                value={contactForm.name}
                onChangeText={(text) => setContactForm({ ...contactForm, name: text })}
                placeholder="Votre nom complet"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.textInput}
                value={contactForm.email}
                onChangeText={(text) => setContactForm({ ...contactForm, email: text })}
                placeholder="votre@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Sujet</Text>
              <TextInput
                style={styles.textInput}
                value={contactForm.subject}
                onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
                placeholder="Sujet de votre message"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={contactForm.message}
                onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
                placeholder="Décrivez votre problème ou votre question..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitContact}>
              <Text style={styles.submitButtonText}>Envoyer le message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informations supplémentaires */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <MaterialIcons name="info" size={24} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Heures d'ouverture</Text>
              <Text style={styles.infoText}>
                Lundi - Vendredi: 8h00 - 18h00{"\n"}
                Samedi: 9h00 - 16h00{"\n"}
                Dimanche: Fermé
              </Text>
            </View>
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
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 15,
  },
  contactOptions: {
    gap: 15,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  faqContainer: {
    gap: 10,
  },
  faqItem: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 10,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.lightGray,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    padding: 15,
    backgroundColor: COLORS.white,
  },
  faqAnswerText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  contactForm: {
    gap: 15,
  },
  inputGroup: {
    gap: 5,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 15,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
});

export default HelpScreen;