import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import colors from "@/src/theme/colors";

interface Props {
  categories: string[];
  selected?: string;
  onSelect: (value: string) => void;
}

export function CategorySelector({ categories, selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {categories.map((cat) => {
        const isSelected = selected === cat;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            style={[styles.item, isSelected && styles.itemSelected]}
          >
            <Text style={[styles.text, isSelected && styles.textSelected]}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: colors.surface,
  },
  itemSelected: {
    borderColor: "#000",
    backgroundColor: "#eee",
  },
  text: {
    fontSize: 14,
    color: "#444",
  },
  textSelected: {
    fontWeight: "600",
    color: "#000",
  },
});
