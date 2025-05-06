import { fetchAllProducts, fetchCategories } from "@/src/api/products.api";
import FilterModal from "@/src/components/FilterModal";
import ProductCard from "@/src/components/ProductCard";
import {
  mapProductsFromApi,
  ProductModel,
} from "@/src/data/mappers/product.mappers";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useProductStore } from "@/src/store/useProductStore";
import { useCartStore } from "@/src/store/useCartStore";
import colors from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Badge, IconButton, Menu, Searchbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const { selectedCategory } = useProductStore();
  const insets = useSafeAreaInsets();
  const { items } = useCartStore();

  const totalQuantity = Object.values(items).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [sort, setSort] = useState<"price" | "name" | "rating">("price");
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    category?: string;
    priceRange?: [number, number];
  }>({});

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const activeFilterCount =
    (activeFilters.category ? 1 : 0) +
    (activeFilters.priceRange &&
    (activeFilters.priceRange[0] !== 0 || activeFilters.priceRange[1] !== 10000)
      ? 1
      : 0);

  useEffect(() => {
    const load = async () => {
      try {
        const [apiProducts, apiCategories] = await Promise.all([
          fetchAllProducts(),
          fetchCategories(),
        ]);
        setProducts(mapProductsFromApi(apiProducts));
        setCategories(apiCategories.map((cat) => cat.slug));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return products
      .filter((p) =>
        activeFilters.category ? p.category === activeFilters.category : true
      )
      .filter((p) => {
        const price = parseFloat(p.price.replace("$", ""));
        const min = activeFilters.priceRange?.[0] ?? 0;
        const max = activeFilters.priceRange?.[1] ?? 10000;
        return price >= min && price <= max;
      })
      .filter((p) =>
        debouncedQuery
          ? p.title.toLowerCase().includes(debouncedQuery.toLowerCase())
          : true
      )
      .sort((a, b) => {
        if (sort === "price") {
          return (
            parseFloat(a.price.replace("$", "")) -
            parseFloat(b.price.replace("$", ""))
          );
        }
        if (sort === "rating") {
          return b.rating - a.rating;
        }
        return a.title.localeCompare(b.title);
      });
  }, [products, activeFilters, debouncedQuery, sort]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: colors.background,
        alignItems: "center",
      }}
    >
      <View style={styles.header}>
        <View style={{ position: "relative" }}>
          <IconButton
            icon="filter-variant"
            size={24}
            onPress={() => setModalVisible(true)}
          />
          {activeFilterCount > 0 && (
            <Badge
              size={16}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: colors.primary,
              }}
            >
              {activeFilterCount}
            </Badge>
          )}
        </View>

        <Searchbar
          placeholder="Search products"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={{ fontSize: 14, marginTop: -2 }}
          iconColor={colors.muted}
          placeholderTextColor={colors.muted}
        />

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton icon="sort" onPress={() => setMenuVisible(true)} />
          }
          anchorPosition="bottom"
          contentStyle={{ backgroundColor: colors.surface }}
        >
          <Menu.Item
            onPress={() => {
              setSort("name");
              setMenuVisible(false);
            }}
            title="Sort by Name"
            leadingIcon="sort-alphabetical-ascending"
          />
          <Menu.Item
            onPress={() => {
              setSort("price");
              setMenuVisible(false);
            }}
            title="Sort by Price"
            leadingIcon="sort-numeric-ascending"
          />
          <Menu.Item
            onPress={() => {
              setSort("rating");
              setMenuVisible(false);
            }}
            title="Sort by Rating"
            leadingIcon="star"
          />
        </Menu>

        <View style={{ position: "relative" }}>
          <IconButton icon="cart" onPress={() => router.push("/cart")} />
          {totalQuantity > 0 && (
            <Badge
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: colors.primary,
              }}
              size={16}
            >
              {totalQuantity}
            </Badge>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        numColumns={1}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>No products found</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              router.push({
                pathname: "/[productId]",
                params: { productId: String(item.id) },
              })
            }
          />
        )}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      <FilterModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onApply={(filters) => setActiveFilters(filters)}
        categories={categories}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
    width: "100%",
    backgroundColor: colors.background,
  },
  searchbar: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 0,
  },
  grid: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingBottom: 80,
  },
});
