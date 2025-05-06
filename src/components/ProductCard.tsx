import React, { useEffect, useRef, useState } from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";
import { IconButton, Text } from "react-native-paper";
import colors from "../theme/colors";
import { ProductModel } from "../data/mappers/product.mappers";
import { useCartStore } from "../store/useCartStore";
import { useProductStore } from "../store/useProductStore";

interface Props {
  product: ProductModel;
  onPress: () => void;
  overrideQuantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  disableNavigation?: boolean;
}

export default function ProductCard({
  product,
  onPress,
  overrideQuantity,
  onIncrement,
  onDecrement,
  disableNavigation = false,
}: Props) {
  const { getQuantity, addItem, removeItem } = useCartStore();
  const { isFavorite, toggleFavorite } = useProductStore();
  const quantity = overrideQuantity ?? getQuantity(product.id);

  const [showControls, setShowControls] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAdd = () => {
    if (product.stock && quantity >= product.stock) return;
    onIncrement ? onIncrement() : addItem(product);
    setShowControls(true);
    resetHideTimer();
  };

  const handleRemove = () => {
    onDecrement ? onDecrement() : removeItem(product.id);
    if (quantity <= 1) {
      setShowControls(false);
    } else {
      resetHideTimer();
    }
  };

  const resetHideTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        if (!disableNavigation) onPress();
      }}
    >
      <View style={styles.info}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <Text style={styles.price}>{product.price}</Text>
      </View>
      <View style={styles.imageSection}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.thumbnail }} style={styles.image} />

          {!disableNavigation && (
            <IconButton
              icon={isFavorite(product.id) ? "heart" : "heart-outline"}
              size={16}
              onPress={() => toggleFavorite(product.id)}
              style={styles.favorite}
              iconColor={colors.primary}
              containerColor={colors.surface}
            />
          )}

          {quantity > 0 && showControls ? (
            <View style={styles.controlsOverlay}>
              <IconButton icon="minus" size={16} onPress={handleRemove} />
              <Text style={styles.count}>{quantity}</Text>
              <IconButton icon="plus" size={16} onPress={handleAdd} />
            </View>
          ) : quantity > 0 ? (
            <Pressable
              onPress={() => setShowControls(true)}
              style={styles.plusOverlay}
            >
              <Text style={styles.countOnly}>{quantity}</Text>
            </Pressable>
          ) : (
            <IconButton
              icon="plus"
              size={20}
              onPress={handleAdd}
              iconColor={colors.surface}
              containerColor={colors.primary}
              style={styles.plusOverlay}
            />
          )}
        </View>
      </View>
      <View style={styles.rating}>
        <Text>⭐ {product.rating.toFixed(1)}</Text>
        <View style={styles.brandRow}>
          <IconButton icon="store-outline" size={14} style={styles.brandIcon} />
          <Text style={styles.brandChip}>{product.brand}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    gap: 12,
    position: "relative",
  },
  info: {
    flex: 1,
    justifyContent: "space-between",
    paddingRight: 8,
    marginTop: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  imageSection: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favorite: {
    position: "absolute",
    top: 0,
    right: 4,
    borderRadius: 6,
  },
  plusOverlay: {
    position: "absolute",
    bottom: 4,
    right: 4,
    borderRadius: 6,
  },
  controlsOverlay: {
    position: "absolute",
    bottom: 4,
    right: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  count: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 4,
  },
  countOnly: {
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: colors.black,
    color: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rating: {
    position: "absolute",
    top: 8,
    left: 4,
    fontSize: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    color: colors.textPrimary,
    overflow: "hidden",
  },
  brandChip: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    color: colors.textSecondary,
    paddingHorizontal: 10,
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 6,
    marginTop: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  brandIcon: {
    margin: 0,
    marginLeft: -8,
    marginRight: -2,
  },
});
