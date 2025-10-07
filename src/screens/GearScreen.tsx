import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../../styles";

type SectionName =
  | "Vehicle Items"
  | "Shelter"
  | "Sleeping System"
  | "Emergency/Medical"
  | "Clothing"
  | "Cooking"
  | "Food"
  | "Lighting/Signaling"
  | "Electronics"
  | "Misc";

type PackingItem = {
  id: string;
  name: string;
  checked: boolean;
};

type PackingList = {
  [key in SectionName]: PackingItem[];
};

const PACKING_LIST_STORAGE_KEY = "@packing_list_sections";

const initialSections: PackingList = {
  "Vehicle Items": [],
  Shelter: [],
  "Sleeping System": [],
  "Emergency/Medical": [],
  Clothing: [],
  Cooking: [],
  Food: [],
  "Lighting/Signaling": [],
  Electronics: [],
  Misc: [],
};

const GearScreen = () => {
  const [packingList, setPackingList] = useState<PackingList>(initialSections);
  const [newItemText, setNewItemText] = useState("");
  const [selectedSection, setSelectedSection] = useState<SectionName | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPackingList();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      savePackingList();
    }
  }, [packingList]);

  const loadPackingList = async () => {
    try {
      const storedList = await AsyncStorage.getItem(PACKING_LIST_STORAGE_KEY);
      if (storedList !== null) {
        setPackingList(JSON.parse(storedList));
      }
    } catch (error) {
      console.error("Error loading packing list:", error);
      Alert.alert("Error", "Failed to load packing list");
    } finally {
      setIsLoading(false);
    }
  };

  const savePackingList = async () => {
    try {
      await AsyncStorage.setItem(
        PACKING_LIST_STORAGE_KEY,
        JSON.stringify(packingList)
      );
    } catch (error) {
      console.error("Error saving packing list:", error);
      Alert.alert("Error", "Failed to save packing list");
    }
  };

  const toggleItemCheck = (section: SectionName, itemId: string) => {
    setPackingList((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    }));
  };

  const addNewItem = (section: SectionName) => {
    if (newItemText.trim() === "") {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    const newItem: PackingItem = {
      id: `${section.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      name: newItemText.trim(),
      checked: false,
    };

    setPackingList((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));

    setNewItemText("");
    setSelectedSection(null);
  };

  const deleteItem = (section: SectionName, itemId: string) => {
    Alert.alert("Delete Item", "Are you sure you want to delete this item?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setPackingList((prev) => ({
            ...prev,
            [section]: prev[section].filter((item) => item.id !== itemId),
          }));
        },
      },
    ]);
  };

  const cancelAddItem = () => {
    setSelectedSection(null);
    setNewItemText("");
  };

  const renderPackingItem = ({
    item,
    section,
  }: {
    item: PackingItem;
    section: SectionName;
  }) => (
    <View style={styles.packingItemContainer}>
      <TouchableOpacity
        style={styles.packingItemCheckboxContainer}
        onPress={() => toggleItemCheck(section, item.id)}
      >
        <Text
          style={
            item.checked
              ? styles.packingItemCheckboxChecked
              : styles.packingItemCheckboxUnchecked
          }
        >
          {item.checked ? "☑️" : "☐"}
        </Text>
        <Text
          style={
            item.checked
              ? styles.packingItemTextChecked
              : styles.packingItemTextUnchecked
          }
        >
          {item.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteItemButton}
        onPress={() => deleteItem(section, item.id)}
      >
        <Text style={styles.deleteItemButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddItemForm = (section: SectionName) => (
    <View style={styles.addItemFormContainer}>
      <TextInput
        style={styles.addItemInput}
        placeholder="Enter new item..."
        value={newItemText}
        onChangeText={setNewItemText}
        autoFocus
      />
      <TouchableOpacity
        style={styles.addItemButton}
        onPress={() => addNewItem(section)}
      >
        <Text style={styles.addItemButtonText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelItemButton} onPress={cancelAddItem}>
        <Text style={styles.cancelItemButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSection = (sectionName: SectionName) => {
    const items = packingList[sectionName];
    const checkedCount = items.filter((item) => item.checked).length;
    const totalCount = items.length;

    return (
      <View key={sectionName} style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{sectionName}</Text>
          {totalCount > 0 && (
            <Text style={styles.sectionCount}>
              {checkedCount}/{totalCount}
            </Text>
          )}
        </View>

        {items.map((item) => (
          <View key={item.id}>
            {renderPackingItem({ item, section: sectionName })}
          </View>
        ))}

        {selectedSection === sectionName ? (
          renderAddItemForm(sectionName)
        ) : (
          <TouchableOpacity
            style={styles.showAddItemButton}
            onPress={() => setSelectedSection(sectionName)}
          >
            <Text style={styles.showAddItemButtonText}>+ Add Item</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.gearScreenContainer}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View testID="packing-list-screen" style={styles.gearScreenContainer}>
      <Text style={styles.gearScreenTitle}>Trip Packing List</Text>

      <ScrollView
        style={styles.packingListWrapper}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.packingListScrollContent}
      >
        {(Object.keys(packingList) as SectionName[]).map((sectionName) =>
          renderSection(sectionName)
        )}
      </ScrollView>
    </View>
  );
};

export default GearScreen;
