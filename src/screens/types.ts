export type SectionName =
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

export type PackingItem = {
  id: string;
  name: string;
  checked: boolean;
};