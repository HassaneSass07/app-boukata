import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
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
  warning: "#FF9800",
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
};

// Données simulées des notifications
const notificationsData = [
  {
    id: "1",
    type: "order",
    title: "Commande livrée",
    message: "Votre commande #BT123456 a été livrée avec succès",
    time: "Il y a 2 heures",
    read: false,
    icon: "check-circle",
    color: COLORS.success,
  },
  {
    id: "2",
    type: "promo",
    title: "Offre spéciale",
    message: "Profitez de -20% sur tous les smartphones jusqu'à demain",
    time: "Il y a 4 heures",
    read: false,
    icon: "local-offer",
    color: COLORS.secondary,
  },
  {
    id: "3",
    type: "order",
    title: "Commande expédiée",
    message: "Votre commande #BT123457 est en route",
    time: "Hier",
    read: true,
    icon: "local-shipping",
    color: COLORS.warning,
  },
  {
    id: "4",
    type: "system",
    title: "Mise à jour disponible",
    message: "Une nouvelle version de l'application est disponible",
    time: "Il y a 2 jours",
    read: true,
    icon: "system-update",
    color: COLORS.primary,
  },
  {
    id: "5",
    type: "order",
    title: "Commande confirmée",
    message: "Votre commande #BT123458 a été confirmée",
    time: "Il y a 3 jours",
    read: true,
    icon: "shopping-bag",
    color: COLORS.primary,
  },
];

const NotificationsScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState(notificationsData);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case "unread":
        return notifications.filter(n => !n.read);
      case "orders":
        return notifications.filter(n => n.type === "order");
      case "promos":
        return notifications.filter(n => n.type === "promo");
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIcon}>
        <MaterialIcons
          name={item.icon}
          size={24}
          color={item.color}
        />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[
            styles.notificationTitle,
            !item.read && styles.unreadTitle
          ]}>
            {item.title}
          </Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        
        {!item.read && <View style={styles.unreadDot} />}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <MaterialIcons name="close" size={20} color={COLORS.gray} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const FilterButtons = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: "all", label: "Toutes" },
          { key: "unread", label: `Non lues (${unreadCount})` },
          { key: "orders", label: "Commandes" },
          { key: "promos", label: "Promotions" },
        ].map((filterOption) => (
          <TouchableOpacity
            key={filterOption.key}
            style={[
              styles.filterButton,
              filter === filterOption.key && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterOption.key)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === filterOption.key && styles.filterButtonTextActive,
              ]}
            >
              {filterOption.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const filteredNotifications = getFilteredNotifications();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Tout lire</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>

      <FilterButtons />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotifications.length > 0 ? (
          <FlatList
            data={filteredNotifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NotificationCard item={item} />}
            scrollEnabled={false}
            contentContainerStyle={styles.notificationsList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-none" size={80} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptySubtitle}>
              {filter === "unread" 
                ? "Toutes vos notifications ont été lues"
                : "Vous n'avez pas encore de notifications"
              }
            </Text>
          </View>
        )}
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
  markAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  notificationsList: {
    padding: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
    position: "relative",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
  unreadTitle: {
    fontWeight: "600",
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
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
  },
});

export default NotificationsScreen;