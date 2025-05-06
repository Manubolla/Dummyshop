import { fetchAllProducts, fetchCategories } from "@/src/api/products.api";
import FilterModal from "@/src/components/FilterModal";
import ProductCard from "@/src/components/ProductCard";
import {
  mapProductsFromApi,
  ProductModel,
} from "@/src/data/mappers/product.mappers";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useCartStore } from "@/src/store/useCartStore";
import colors from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Badge, IconButton, Menu, Searchbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "rating-asc"
  | "rating-desc";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items } = useCartStore();

  const totalQuantity = Object.values(items).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [sort, setSort] = useState<SortOption>("name-asc");
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
        const [field, direction] = sort.split("-");

        if (field === "price") {
          const aPrice = parseFloat(a.price.replace("$", ""));
          const bPrice = parseFloat(b.price.replace("$", ""));
          return direction === "asc" ? aPrice - bPrice : bPrice - aPrice;
        }

        if (field === "rating") {
          return direction === "asc"
            ? a.rating - b.rating
            : b.rating - a.rating;
        }

        if (field === "name") {
          return direction === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }

        return 0;
      });
  }, [products, activeFilters, debouncedQuery, sort]);

  const toggleSort = (field: "price" | "name" | "rating") => {
    setSort((prev) => {
      const defaultDirection =
        field === "price" ? "asc" : field === "rating" ? "desc" : "asc";

      const isCurrent = prev.startsWith(field);
      const isAsc = prev === `${field}-asc`;

      if (!isCurrent) return `${field}-${defaultDirection}` as SortOption;
      return `${field}-${isAsc ? "desc" : "asc"}` as SortOption;
    });

    setMenuVisible(false);
  };

  const handleSearch = (text: string) => setSearchQuery(text);
  const onDismissModal = () => setModalVisible(false);
  const onOpenModal = () => setModalVisible(true);
  const onDismissMenu = () => setMenuVisible(false);
  const onOpenMenu = () => setMenuVisible(true);

  const renderItem = ({ item }: { item: ProductModel }) => {
    const onPressProductItem = () =>
      router.push({
        pathname: "/[productId]",
        params: { productId: String(item.id) },
      });

    return <ProductCard product={item} onPress={onPressProductItem} />;
  };

  const onApplyFilters = (filters: {
    category?: string;
    priceRange?: [number, number];
  }) => setActiveFilters(filters);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.activeFilterContainer}>
          <IconButton icon="filter-variant" size={24} onPress={onOpenModal} />
          {activeFilterCount > 0 && (
            <Badge size={16} style={styles.filterBadge}>
              {activeFilterCount}
            </Badge>
          )}
        </View>

        <Searchbar
          placeholder="Search products"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
          inputStyle={styles.input}
          iconColor={colors.muted}
          placeholderTextColor={colors.muted}
        />

        <Menu
          visible={menuVisible}
          onDismiss={onDismissMenu}
          anchor={<IconButton icon="sort" onPress={onOpenMenu} />}
          anchorPosition="bottom"
          contentStyle={styles.menuContent}
        >
          <Menu.Item
            onPress={() => toggleSort("name")}
            title={`Sort by Name (${
              sort === "name-asc" ? "A-Z" : sort === "name-desc" ? "Z-A" : "A-Z"
            })`}
            leadingIcon="sort-alphabetical-ascending"
          />
          <Menu.Item
            onPress={() => toggleSort("price")}
            title={`Sort by Price (${
              sort === "price-asc"
                ? "Low-High"
                : sort === "price-desc"
                ? "High-Low"
                : "Low-High"
            })`}
            leadingIcon="sort-numeric-ascending"
          />
          <Menu.Item
            onPress={() => toggleSort("rating")}
            title={`Sort by Rating (${
              sort === "rating-asc"
                ? "Low-High"
                : sort === "rating-desc"
                ? "High-Low"
                : "High-Low"
            })`}
            leadingIcon="star"
          />
        </Menu>

        <View style={styles.cartContainer}>
          <IconButton icon="cart" onPress={() => router.push("/cart")} />
          {totalQuantity > 0 && (
            <Badge style={styles.badge} size={16}>
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
          <View style={styles.emptyContainer}>
            <Text>No products found</Text>
          </View>
        )}
        renderItem={renderItem}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      <FilterModal
        visible={modalVisible}
        onDismiss={onDismissModal}
        onApply={onApplyFilters}
        categories={categories}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  activeFilterContainer: { position: "relative" },
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
    padding: 0,
  },
  grid: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingBottom: 80,
  },
  input: { fontSize: 14, marginTop: -2 },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: colors.primary,
  },
  filterBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: colors.primary,
  },
  menuContent: { backgroundColor: colors.surface },
  cartContainer: { position: "relative" },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
