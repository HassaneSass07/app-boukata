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

// Données simulées des commandes
const ordersData = [
  {
    id: "BT123456",
    date: "2024-01-15",
    status: "delivered",
    total: 45000,
    items: [
      { name: "iPhone 15 Pro Max", quantity: 1, price: 45000 }
    ],
    deliveryAddress: "Niamey, Niger",
  },
  {
    id: "BT123457",
    date: "2024-01-14",
    status: "shipped",
    total: 25000,
    items: [
      { name: "Samsung Galaxy S24", quantity: 1, price: 25000 }
    ],
    deliveryAddress: "Niamey, Niger",
  },
  {
    id: "BT123458",
    date: "2024-01-13",
    status: "processing",
    total: 15000,
    items: [
      { name: "Pizza Margherita", quantity: 2, price: 7500 }
    ],
    deliveryAddress: "Niamey, Niger",
  },
];

const OrdersScreen = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return COLORS.success;
      case "shipped":
        return COLORS.warning;
      case "processing":
        return COLORS.primary;
      case "cancelled":
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Livré";
      case "shipped":
        return "Expédié";
      case "processing":
        return "En préparation";
      case "cancelled":
        return "Annulé";
      default:
        return "Inconnu";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return "check-circle";
      case "shipped":
        return "local-shipping";
      case "processing":
        return "hourglass-empty";
      case "cancelled":
        return "cancel";
      default:
        return "help";
    }
  };

  const filteredOrders = ordersData.filter((order) => {
    if (selectedFilter === "all") return true;
    return order.status === selectedFilter;
  });

  const OrderCard = ({ order }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Commande #{order.id}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.date).toLocaleDateString('fr-FR')}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <MaterialIcons
            name={getStatusIcon(order.status)}
            size={20}
            color={getStatusColor(order.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.itemText}>
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>
          Total: {order.total.toLocaleString()} FCFA
        </Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Voir détails</Text>
          <MaterialIcons name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const FilterButtons = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: "all", label: "Toutes" },
          { key: "processing", label: "En cours" },
          { key: "shipped", label: "Expédiées" },
          { key: "delivered", label: "Livrées" },
          { key: "cancelled", label: "Annulées" },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter.key && styles.filterButtonTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes commandes</Text>
        <TouchableOpacity>
          <MaterialIcons name="search" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <FilterButtons />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredOrders.length > 0 ? (
          <View style={styles.ordersList}>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="shopping-bag" size={80} color={COLORS.gray} />
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptySubtitle}>
              Vous n'avez pas encore passé de commande
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.shopButtonText}>Commencer mes achats</Text>
            </TouchableOpacity>
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
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
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
  ordersList: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    ...SHADOWS.small,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  orderDate: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 5,
  },
  orderItems: {
    marginBottom: 15,
  },
  itemText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
    marginRight: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
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
    marginBottom: 30,
    lineHeight: 24,
  },
  shopButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  shopButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OrdersScreen;