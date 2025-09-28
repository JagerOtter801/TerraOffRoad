import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";

/**
 * Types for packing items and section names
 */
type SectionName = 'Vehicle' | 'Clothing' | 'Food';
type PackingItem = {
  id: string;
  name: string;
  checked: boolean;
};

/*
*NOTE THIS IS SIMPLY A PLACE HOLDER FOR WHAT WILL GO HERE. GOING OVER ACTUAL IMPLEMENTATION ON APP REDESIGN
*/
const GearScreen = () => {
  const [packingItems, setPackingItems] = useState({
    Vehicle: [
      { id: "v1", name: "Jump Cables", checked: false },
      { id: "v2", name: "Tire Pressure Gauge", checked: false },
      { id: "v3", name: "Emergency Kit", checked: false },
      { id: "v4", name: "Spare Tire", checked: false },
    ],
    Clothing: [
      { id: "c1", name: "Extra Clothes", checked: false },
      { id: "c2", name: "Rain Jacket", checked: false },
      { id: "c3", name: "Hiking Boots", checked: false },
      { id: "c4", name: "Hat", checked: false },
    ],
    Food: [
      { id: "f1", name: "Water Bottles", checked: false },
      { id: "f2", name: "Snacks", checked: false },
      { id: "f3", name: "Cooler", checked: false },
      { id: "f4", name: "Portable Stove", checked: false },
    ],
  });

  const [newItemText, setNewItemText] = useState("");
  const [selectedSection, setSelectedSection] = useState<SectionName | null>(null);

  const toggleItemCheck = (section: SectionName, itemId: string) => {
    setPackingItems(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const addNewItem = (section: SectionName) => {
    if (newItemText.trim() === "") {
      Alert.alert("Error", "Please enter an item name");
      return;
    }

    const newItem = {
      id: `${section.toLowerCase()}_${Date.now()}`,
      name: newItemText.trim(),
      checked: false
    };

    setPackingItems(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));

    setNewItemText("");
    setSelectedSection(null);
  };

  const renderPackingItem = ({ item, section }: { item: PackingItem; section: SectionName }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee"
      }}
      onPress={() => toggleItemCheck(section, item.id)}
    >
      <Text style={{
        fontSize: 18,
        marginRight: 10,
        color: item.checked ? "#4CAF50" : "#ccc"
      }}>
        {item.checked ? "☑️" : "☐"}
      </Text>
      <Text style={{
        fontSize: 16,
        textDecorationLine: item.checked ? "line-through" : "none",
        color: item.checked ? "#888" : "#000"
      }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSection = (sectionName: SectionName) => {
    const items = packingItems[sectionName];
    const checkedCount = items.filter(item => item.checked).length;

    return (
      <View key={sectionName} style={{ marginBottom: 20 }}>
        <View style={{
          backgroundColor: "#f5f5f5",
          padding: 15,
          borderRadius: 8,
          marginBottom: 10
        }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {sectionName} ({checkedCount}/{items.length})
          </Text>
        </View>

        {items.map(item => (
          <View key={item.id}>
            {renderPackingItem({ item, section: sectionName })}
          </View>
        ))}

        {selectedSection === sectionName ? (
          <View style={{
            flexDirection: "row",
            padding: 10,
            backgroundColor: "#f9f9f9",
            alignItems: "center"
          }}>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 8,
                marginRight: 10,
                borderRadius: 4
              }}
              placeholder="Enter new item..."
              value={newItemText}
              onChangeText={setNewItemText}
              autoFocus
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#4CAF50",
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 4,
                marginRight: 5
              }}
              onPress={() => addNewItem(sectionName)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#f44336",
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 4
              }}
              onPress={() => {
                setSelectedSection(null);
                setNewItemText("");
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={{
              padding: 12,
              backgroundColor: "#e3f2fd",
              borderRadius: 4,
              marginTop: 5,
              alignItems: "center"
            }}
            onPress={() => setSelectedSection(sectionName)}
          >
            <Text style={{ color: "#1976d2", fontWeight: "bold" }}>
              + Add Item to {sectionName}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View testID="packing-list-screen" style={{ flex: 1, padding: 15, backgroundColor: "white" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
        Trip Packing List
      </Text>
      
      <FlatList
        data={Object.keys(packingItems) as SectionName[]}
        keyExtractor={(item: SectionName) => item}
        renderItem={({ item }: { item: SectionName }) => renderSection(item)}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default GearScreen;