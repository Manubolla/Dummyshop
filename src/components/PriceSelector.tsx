import { Text } from "react-native-paper";
import { TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import colors from "../theme/colors";

export function PriceSelector({
  selectedRange,
  onSelect,
}: {
  selectedRange: [number, number];
  onSelect: (range: [number, number]) => void;
}) {
  const ranges: { label: string; range: [number, number] }[] = [
    { label: "<25", range: [0, 25] },
    { label: "25 - 100", range: [25, 100] },
    { label: "100 - 500", range: [100, 500] },
    { label: "500 - 10000", range: [500, 10000] },
  ];

  return (
    <View style={priceStyles.container}>
      {ranges.map(({ label, range }) => {
        const isSelected =
          selectedRange[0] === range[0] && selectedRange[1] === range[1];
        return (
          <TouchableOpacity
            key={label}
            onPress={() => onSelect(range)}
            style={[priceStyles.item, isSelected && priceStyles.itemSelected]}
          >
            <Text
              style={[priceStyles.text, isSelected && priceStyles.textSelected]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const priceStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 16,
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
