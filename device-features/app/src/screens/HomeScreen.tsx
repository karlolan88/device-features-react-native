import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import EntryItem from "../components/EntryItem";
import { loadEntries, saveEntries } from "../utils/storage";
import { TravelEntry } from "../types";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

const HomeScreen = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const isFocused = useIsFocused();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (isFocused) {
      loadEntries().then(setEntries);
    }
  }, [isFocused]);

  const removeEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
  };

  return (
    <View style={styles.container}>
      {entries.length === 0 ? (
        <Text style={styles.noText}>No Entries yet</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EntryItem entry={item} onRemove={() => removeEntry(item.id)} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddEntry")}
      >
        <Text style={styles.addText}>Add Travel Entry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  noText: { textAlign: "center", marginTop: 30, fontSize: 18 },
  addBtn: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  addText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

export default HomeScreen;
