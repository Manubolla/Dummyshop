import { fetchProductById } from "@/src/api/products.api";
import {
  mapProductFromApi,
  ProductModel,
} from "@/src/data/mappers/product.mappers";
import colors from "@/src/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, IconButton, Text } from "react-native-paper";
import { useProductStore } from "@/src/store/useProductStore";
import { useCartStore } from "@/src/store/useCartStore";

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { addItem, getQuantity, removeItem } = useCartStore();

  const router = useRouter();
  const { isFavorite, toggleFavorite } = useProductStore();

  const [product, setProduct] = useState<ProductModel | null>(null);
  const [loading, setLoading] = useState(true);
  const quantity = getQuantity(product?.id as number);

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
    if (product && quantity < product.stock) {
      addItem(product);
    }
  };

  const decrement = () => {
    if (quantity > 0) {
      removeItem(product?.id as number);
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text>Loading product...</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.container}>
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
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.row}>
            <View style={styles.quantityControls}>
              <Text style={styles.qtyBtn} onPress={decrement}>
                -
              </Text>
              <Text style={styles.qtyText}>{quantity}</Text>
              <Text style={styles.qtyBtn} onPress={increment}>
                +
              </Text>
            </View>

            <View>
              <Text style={styles.price}>{product.price}</Text>
              <Text style={styles.stock}>
                Stock disponible: {product.stock}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
  },
  container: {
    alignItems: "center",
    paddingBottom: 120,
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
});
