import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { saveEntries, loadEntries } from "../utils/storage";
import { TravelEntry } from "../types";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";

const AddEntryScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>("");
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
      await Notifications.requestPermissionsAsync();
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      const location = await Location.getCurrentPositionAsync({});
      const geo = await Location.reverseGeocodeAsync(location.coords);
      const addr = geo[0];
      setAddress(`${addr.name}, ${addr.city}, ${addr.country}`);
    }
  };

  const saveEntry = async () => {
    if (!imageUri || !address) return;
    const newEntry: TravelEntry = {
      id: uuid.v4().toString(),
      imageUri,
      address,
    };
    const existing = await loadEntries();
    const updated = [...existing, newEntry];
    await saveEntries(updated);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Travel Entry Saved!",
        body: "You’ve successfully added a new memory.",
      },
      trigger: null,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Text style={styles.text}>{address}</Text>
          <TouchableOpacity style={styles.saveBtn} onPress={saveEntry}>
            <Text style={styles.saveText}>Save Entry</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.takeBtn} onPress={takePhoto}>
          <Text style={styles.takeText}>Take Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: "100%", height: 300, borderRadius: 10, marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 10 },
  takeBtn: { backgroundColor: "#2196F3", padding: 12, borderRadius: 8 },
  takeText: { color: "#fff", textAlign: "center" },
  saveBtn: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 8 },
  saveText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

export default AddEntryScreen;
