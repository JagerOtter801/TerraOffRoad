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
  Pressable,
  Keyboard,
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
     Keyboard.dismiss();
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
     Keyboard.dismiss();
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
    <View 
      testID={`packing-item-${item.id}`}
      style={styles.packingItemContainer}
    >
      <TouchableOpacity
        testID={`packing-item-checkbox-${item.id}`}
        accessibilityLabel={`${item.checked ? 'Checked' : 'Unchecked'} ${item.name}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.checked }}
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
          testID={`packing-item-name-${item.id}`}
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
        testID={`packing-item-delete-${item.id}`}
        accessibilityLabel={`Delete ${item.name}`}
        accessibilityRole="button"
        style={styles.deleteItemButton}
        onPress={() => openDeleteModal(section, item.id)}
      >
        <Text style={styles.deleteItemButtonText}>
          {item.checked ? "✕" : ""}
        </Text>
      </TouchableOpacity>
    </View>
  );

const renderAddItemForm = (section: SectionName) => {
  const sectionKey = section.toLowerCase().replace(/\s+/g, "_");
  
  return (
    <View 
      testID={`add-item-form-${sectionKey}`}
      style={styles.addItemFormContainer}
    >
      <TextInput
        testID={`add-item-input-${sectionKey}`}
        accessibilityLabel={`Enter new item for ${section}`}
        style={styles.addItemInput}
        placeholder={t("enter new item")}
        placeholderTextColor="#6b7280"
        value={newItemText}
        onChangeText={setNewItemText}
        autoFocus
      />
      <Pressable
        testID={`add-item-confirm-${sectionKey}`}
        accessibilityLabel="Add item"
        accessibilityRole="button"
        style={styles.addItemButton}
        onPress={() => addNewItem(section)}
      >
        <Text style={styles.addItemButtonText}>{t("add")}</Text>
      </Pressable>
      <Pressable
        testID={`add-item-cancel-${sectionKey}`}
        accessibilityLabel="Cancel adding item"
        accessibilityRole="button"
        style={styles.cancelItemButton} 
        onPress={cancelAddItem}
      >
        <Text style={styles.cancelItemButtonText}>{t("cancel")}</Text>
      </Pressable>
    </View>
  );
};

const renderSection = (sectionName: SectionName) => {
    const items = packingList[sectionName];
    const totalCount = items.length;
    const sectionKey = sectionName.toLowerCase().replace(/\s+/g, "-");

    return (
      <View 
        key={sectionName} 
        testID={`section-${sectionKey}`}
        style={styles.sectionContainer}
      >
        <View style={styles.sectionHeader}>
          <Text 
            testID={`section-title-${sectionKey}`}
            accessibilityLabel={`section-title-${sectionKey}`}
            style={styles.sectionTitle}
          >
            {t(sectionName.toLowerCase())}
          </Text>
          {totalCount > 0 && (
            <Text 
              testID={`section-count-${sectionKey}`}
              accessibilityLabel={`section-title-${sectionKey}`}
              style={styles.sectionCount}
            >
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
          <Pressable
            testID={`add-item-button-${sectionKey}`}
            accessibilityRole="button"
            accessibilityLabel={`add-item-button-${sectionName}`} 
            style={styles.showAddItemButton}
            onPress={() => setSelectedSection(sectionName)}
          >
            <Text style={styles.showAddItemButtonText}>+ {t("add item")}</Text>
          </Pressable>
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
          keyboardShouldPersistTaps="always"
        >
          {(Object.keys(packingList) as SectionName[]).map((sectionName) =>
            renderSection(sectionName)
          )}
        </ScrollView>

        <Modal
        testID="delete-item-modal"
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
              <Text testID="delete-waypoint-modal-title" style={styles.deleteAllWaypointsModalTitle}>
                {t("delete item")}
              </Text>
              <Text testID="delete-all-waypoints" style={styles.deleteAllWaypointsSubtext}>
                {t("are you sure you want to delete")} "{itemToDelete?.itemName}
                "?
              </Text>
              <Pressable
                style={[styles.modalButtons, { backgroundColor: "#6b7280" }]}
                onPress={cancelDelete}
              >
                <Text style={styles.waypointMenuButtonText}>{t("cancel")}</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButtons, { backgroundColor: "#ef4444" }]}
                onPress={confirmDelete}
              >
                <Text testID="delete-waypoint-button" style={styles.deleteAllWaypointsButtonText}>
                  {t("delete")}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GearScreen;
