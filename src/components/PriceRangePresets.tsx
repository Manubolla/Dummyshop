import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import colors from "@/src/theme/colors";

interface Props {
  selected: [number, number];
  onSelect: (range: [number, number]) => void;
}

const PRESETS: { label: string; range: [number, number] }[] = [
  { label: "$<25", range: [0, 25] },
  { label: "$25–100", range: [25, 100] },
  { label: "$100–500", range: [100, 500] },
  { label: "$500–10000", range: [500, 10000] },
];

export default function PriceRangePresets({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {PRESETS.map(({ label, range }) => {
        const isActive = selected[0] === range[0] && selected[1] === range[1];

        return (
          <TouchableRipple
            key={label}
            onPress={() => onSelect(range)}
            style={[
              styles.chip,
              isActive && { backgroundColor: colors.primary + "10%" },
            ]}
            borderless
          >
            <Text
              style={[
                styles.label,
                isActive && { color: colors.primary, fontWeight: "600" },
              ]}
            >
              {label}
            </Text>
          </TouchableRipple>
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
    marginTop: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});
