import ProductCard from "@/src/components/ProductCard";
import { sendLocalNotification } from "@/src/hooks/useNotifications";
import { useCartStore } from "@/src/store/useCartStore";
import colors from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, IconButton, Snackbar, Text } from "react-native-paper";
import {
  useSafeAreaInsets,
  SafeAreaView,
} from "react-native-safe-area-context";

export default function CartScreen() {
  const { items, clearCart, addItem, removeItem } = useCartStore();
  const cartItems = Object.values(items);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const total = cartItems.reduce(
    (acc, item) =>
      acc + item.quantity * parseFloat(item.product.price.replace("$", "")),
    0
  );

  const handleRemove = (productId: number) => {
    if (items[productId].quantity <= 1) return;
    removeItem(productId);
  };

  const handleBuy = () => {
    clearCart();
    setShowSnackbar(true);
    sendLocalNotification(
      "Your order is being prepared",
      "Thanks for shopping with us!",
      5
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={[styles.header, { marginTop: 12 }]}>
        <IconButton icon="arrow-left" onPress={router.back} />
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={{ width: 48 }} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item.product}
            onPress={() => {}}
            overrideQuantity={item.quantity}
            onIncrement={() => addItem(item.product)}
            onDecrement={() => handleRemove(item.product.id)}
            disableNavigation
          />
        )}
        ListEmptyComponent={
          <View style={styles.cartEmpty}>
            <Text>Your cart is empty.</Text>
          </View>
        }
        contentContainerStyle={{
          paddingBottom: insets.bottom + 160,
          flexGrow: 1,
        }}
      />

      <View style={[styles.footer, { bottom: insets.bottom + 12 }]}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <View style={styles.buttons}>
          <Button
            disabled={!cartItems.length}
            mode="outlined"
            onPress={clearCart}
            style={styles.button}
            textColor={colors.textPrimary}
          >
            Clear Cart
          </Button>
          <Button
            disabled={!cartItems.length}
            mode="contained"
            onPress={handleBuy}
            style={styles.button}
          >
            Buy Now
          </Button>
        </View>
      </View>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={4000}
      >
        Thank you for your purchase!
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  footer: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.textPrimary,
  },
  buttons: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    borderRadius: 8,
    flex: 1,
  },
  cartEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
