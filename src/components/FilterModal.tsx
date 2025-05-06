import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../theme/colors";
import { CategorySelector } from "./CategorySelector";
import PriceRangePresets from "./PriceRangePresets";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onApply: (filters: {
    category?: string;
    priceRange?: [number, number];
  }) => void;
  categories: string[];
}

export default function FilterModal({
  visible,
  onDismiss,
  onApply,
  categories,
}: Props) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleApply = () => {
    onApply({ category: selectedCategory, priceRange });
    onDismiss();
  };

  const handleReset = () => {
    setSelectedCategory(undefined);
    setPriceRange([0, 10000]);
  };

  if (!visible) return null;

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 10);

  return (
    <Portal>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}>
          <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
            <View style={styles.header}>
              <IconButton icon="arrow-left" onPress={onDismiss} />
              <Text style={styles.title}>Filters</Text>
              <TouchableRipple onPress={handleReset}>
                <Text style={styles.reset}>Clear</Text>
              </TouchableRipple>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
              <Text style={styles.section}>Categories</Text>
              <CategorySelector
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                categories={displayedCategories}
              />
              {categories.length > 10 && (
                <TouchableRipple
                  onPress={() => {
                    setShowAllCategories(!showAllCategories);
                  }}
                  style={{ alignSelf: "flex-start", marginTop: 8 }}
                >
                  <Text style={{ color: colors.primary, fontWeight: "500" }}>
                    {showAllCategories ? "Show less" : "Show more"}
                  </Text>
                </TouchableRipple>
              )}

              <Text style={styles.section}>Price Range</Text>
              <View style={styles.sliderRow}>
                <Text>${priceRange[0]}</Text>
                <Text>${priceRange[1]}</Text>
              </View>
              <Slider
                style={{ width: "100%" }}
                minimumValue={0}
                maximumValue={10000}
                step={1}
                onValueChange={(v) => setPriceRange([0, v])}
                value={priceRange[1]}
                minimumTrackTintColor={colors.primary}
                thumbTintColor={colors.primary}
              />

              <PriceRangePresets
                onSelect={(range) => setPriceRange(range)}
                selected={priceRange}
              />

              <View style={{ height: 24 }} />
            </ScrollView>

            <Button mode="contained" style={styles.apply} onPress={handleApply}>
              Apply Filters
            </Button>
          </View>
        </View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  reset: {
    color: colors.primary,
    fontWeight: "500",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  section: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 24,
  },
  sliderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  apply: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 10,
  },
});
