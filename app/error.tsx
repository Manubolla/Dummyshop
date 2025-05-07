import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ErrorBoundaryProps } from "expo-router";

export default function GlobalError({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="alert-circle" size={48} color="#d9534f" />
      </View>

      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.description}>{error.message}</Text>

      <Button
        mode="contained"
        style={styles.button}
        onPress={retry}
        icon="refresh"
      >
        Try again
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  iconContainer: {
    backgroundColor: "#fbeaea",
    borderRadius: 100,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    borderRadius: 8,
  },
});
