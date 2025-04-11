import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { TravelEntry } from "../types";

interface Props {
  entry: TravelEntry;
  onRemove: () => void;
}

const EntryItem: React.FC<Props> = ({ entry, onRemove }) => (
  <View style={styles.container}>
    <Image source={{ uri: entry.imageUri }} style={styles.image} />
    <Text style={styles.text}>{entry.address}</Text>
    <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
      <Text style={styles.removeText}>Remove</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 10, padding: 10, backgroundColor: "#eee", borderRadius: 8 },
  image: { width: "100%", height: 200, borderRadius: 8 },
  text: { marginTop: 8, fontSize: 16 },
  removeBtn: { marginTop: 5, backgroundColor: "#f44", padding: 5, borderRadius: 5 },
  removeText: { color: "#fff", textAlign: "center" },
});

export default EntryItem;
