import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { styles } from "../../styles";
import { SectionName, PackingItem, PackingList } from "./types";

const PACKING_LIST_STORAGE_KEY = "@packing_list_sections";

const initialSections: PackingList = {
  "Vehicle Items": [],
  Shelter: [],
  "Sleeping System": [],
  "Emergency/Medical": [],
  Clothing: [],
  Cooking: [],
  Food: [],
  Hygiene: [],
  "Lighting/Signaling": [],
  Electronics: [],
  Misc: [],
};

const GearScreen = () => {
  const { t } = useTranslation();
  const [packingList, setPackingList] = useState<PackingList>(initialSections);
  const [newItemText, setNewItemText] = useState("");
  const [selectedSection, setSelectedSection] = useState<SectionName | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    section: SectionName;
    itemId: string;
    itemName: string;
  } | null>(null);

  useEffect(() => {
    loadPackingList();
  }, []);


  const loadPackingList = async () => {
    try {
      const storedList = await AsyncStorage.getItem(PACKING_LIST_STORAGE_KEY);
      if (storedList !== null) {
        setPackingList(JSON.parse(storedList));
      }
    } catch (error) {
      console.error("Error loading packing list:", error);
      Alert.alert(t("error"), t("failed to load packing list"));
    } finally {
      setIsLoading(false);
    }
  };

  const savePackingList = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        PACKING_LIST_STORAGE_KEY,
        JSON.stringify(packingList)
      );
    } catch (error) {
      console.error("Error saving packing list:", error);
      Alert.alert(t("error"), t("failed to save packing list"));
    }
  }, [packingList]);

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
      Alert.alert(t("error"), t("please enter an item name"));
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

  const openDeleteModal = (section: SectionName, itemId: string) => {
    const item = packingList[section].find((i) => i.id === itemId);
    if (item) {
      setItemToDelete({ section, itemId, itemName: item.name });
      setDeleteModalVisible(true);
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setPackingList((prev) => ({
        ...prev,
        [itemToDelete.section]: prev[itemToDelete.section].filter(
          (item) => item.id !== itemToDelete.itemId
        ),
      }));
    }
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const cancelAddItem = () => {
    setSelectedSection(null);
    setNewItemText("");
  };

    // Auto Save - Packing list.
  useEffect(() => {
    if (!isLoading) {
      savePackingList();
    }
  }, [packingList, savePackingList]);

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
        onPress={() => openDeleteModal(section, item.id)}
      >
        <Text style={styles.deleteItemButtonText}>
          {item.checked ? "✕" : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddItemForm = (section: SectionName) => (
    <View style={styles.addItemFormContainer}>
      <TextInput
        style={styles.addItemInput}
        placeholder={t("enter new item")}
        placeholderTextColor="#6b7280"
        value={newItemText}
        onChangeText={setNewItemText}
        autoFocus
      />
      <TouchableOpacity
        style={styles.addItemButton}
        onPress={() => addNewItem(section)}
      >
        <Text style={styles.addItemButtonText}>{t("add")}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelItemButton} onPress={cancelAddItem}>
        <Text style={styles.cancelItemButtonText}>{t("cancel")}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSection = (sectionName: SectionName) => {
    const items = packingList[sectionName];
    const totalCount = items.length;

    return (
      <View key={sectionName} style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {t(sectionName.toLowerCase())}
          </Text>
          {totalCount > 0 && (
            <Text style={styles.sectionCount}>
              {t("items")}: {totalCount}
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
            <Text style={styles.showAddItemButtonText}>+ {t("add item")}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.gearScreenContainer}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t("loading")}...</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View testID="packing-list-screen" style={styles.gearScreenContainer}>
        <Text style={styles.gearScreenTitle}>{t("trip packing list")}</Text>

        <ScrollView
          style={styles.packingListWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.packingListScrollContent}
        >
          {(Object.keys(packingList) as SectionName[]).map((sectionName) =>
            renderSection(sectionName)
          )}
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={cancelDelete}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.userOptionsModal}>
              <Text style={styles.deleteAllWaypointsModalTitle}>
                {t("delete item")}
              </Text>
              <Text style={styles.deleteAllWaypointsSubtext}>
                {t("are you sure you want to delete")} "{itemToDelete?.itemName}
                "?
              </Text>
              <TouchableOpacity
                style={[styles.modalButtons, { backgroundColor: "#6b7280" }]}
                onPress={cancelDelete}
              >
                <Text style={styles.waypointMenuButtonText}>{t("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButtons, { backgroundColor: "#ef4444" }]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteAllWaypointsButtonText}>
                  {t("delete")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GearScreen;
