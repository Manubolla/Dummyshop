import { fetchProductById } from "@/src/api/products.api";
import {
  mapProductFromApi,
  ProductModel,
} from "@/src/data/mappers/product.mappers";
import { useCartStore } from "@/src/store/useCartStore";
import { useProductStore } from "@/src/store/useProductStore";
import colors from "@/src/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  IconButton,
  Text,
  Button,
  Snackbar,
} from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { addItem, getQuantity } = useCartStore();
  const { isFavorite, toggleFavorite } = useProductStore();
  const router = useRouter();

  const [product, setProduct] = useState<ProductModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [localQuantity, setLocalQuantity] = useState(1);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const inCartQuantity = getQuantity(Number(productId));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!productId) return;

    const load = async () => {
      try {
        const data = await fetchProductById(Number(productId));
        setProduct(mapProductFromApi(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  const increment = () => {
    if (product && localQuantity < product.stock) {
      setLocalQuantity(localQuantity + 1);
    }
  };

  const decrement = () => {
    if (localQuantity > 1) {
      setLocalQuantity(localQuantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < localQuantity; i++) {
        addItem(product);
      }
      setShowSnackbar(true);
      setTimeout(() => {
        router.back();
      }, 750);
    }
  };

  if (loading || !product) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
        <Text>Loading product...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingBottom: 200 }]}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.thumbnail }} style={styles.image} />
          <IconButton
            icon={isFavorite(product.id) ? "heart" : "heart-outline"}
            size={24}
            onPress={() => toggleFavorite(product.id)}
            style={styles.favoriteBtn}
            iconColor={colors.primary}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.brandRow}>
            <IconButton
              icon="store-outline"
              size={16}
              style={styles.brandIcon}
            />
            <Text style={styles.brandChip}>{product.brand}</Text>
          </View>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.row}>
            <View style={styles.quantityControls}>
              <Text style={styles.qtyBtn} onPress={decrement}>
                -
              </Text>
              <Text style={styles.qtyText}>{localQuantity}</Text>
              <Text style={styles.qtyBtn} onPress={increment}>
                +
              </Text>
            </View>

            <View>
              <Text style={styles.price}>{product.price}</Text>
              <Text style={styles.stock}>Stock: {product.stock}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {inCartQuantity > 0 && (
          <Text style={styles.inCartText}>
            You already have {inCartQuantity} of this item in your cart
          </Text>
        )}
        <Button
          mode="contained"
          onPress={handleAddToCart}
          style={styles.addToCartBtn}
        >
          {inCartQuantity > 0
            ? `Add ${localQuantity} more to Cart`
            : `Add ${localQuantity} to Cart`}
        </Button>
      </View>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
        style={{ marginBottom: insets.bottom + 80 }}
      >
        Added to cart
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  container: {
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    height: 340,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  favoriteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: colors.surface,
    borderRadius: 20,
  },
  content: {
    width: "100%",
    paddingHorizontal: 24,
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  qtyBtn: {
    fontSize: 18,
    color: "#ccc",
    paddingHorizontal: 8,
  },
  qtyText: {
    fontSize: 16,
    color: colors.textPrimary,
    marginHorizontal: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  stock: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  inCartText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginVertical: 8,
  },
  addToCartBtn: {
    borderRadius: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -4,
    marginBottom: 12,
  },
  brandIcon: {
    margin: 0,
    marginRight: -4,
  },
  brandChip: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textSecondary,
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
