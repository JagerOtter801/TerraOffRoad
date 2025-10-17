import { StyleSheet, Platform } from "react-native";

// Modern Dark Mode Color Palette
const colors = {
  bg: {
    primary: "#0F172A", 
    secondary: "#1E293B",
    tertiary: "#334155", 
    elevated: "#475569", 
  },
  accent: {
    primary: "#3B82F6", 
    secondary: "#8B5CF6", 
    success: "#10B981", 
    warning: "#F59E0B", 
    danger: "#EF4444", 
    info: "#06B6D4", 
  },
  text: {
    primary: "#F1F5F9", 
    secondary: "#94A3B8", 
    tertiary: "#64748B", 
    accent: "#60A5FA", 
  },
  border: {
    subtle: "#334155", 
    medium: "#475569", 
    strong: "#64748B", 
  },
};

export const styles = StyleSheet.create({
  // ============================================================================
  // AUTH & LOGIN SCREENS
  // ============================================================================

  login_screen_container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  auth0_login_background: {
    backgroundColor: colors.bg.secondary,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  auth0_login_title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  subauth0_login_title: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 30,
    color: colors.text.secondary,
    letterSpacing: 0.3,
  },
  authenticated_homescreen_title: {
    fontSize: 2,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.accent.success,
  },
  email: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.text.tertiary,
    marginBottom: 20,
  },
  auth0_login_button: {
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: colors.accent.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    elevation: 4,
    letterSpacing: 0.5,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  // ============================================================================
  // MAP SCREEN
  // ============================================================================

  maps_container: {
    flex: 1,
    position: "relative",
    backgroundColor: colors.bg.primary,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  // Map Header
  floatingHeader: {
    position: "absolute",
    top: 15,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 1000,
  },
  floatingHamburgerMenu: {
    backgroundColor: "rgba(255, 255, 255, 0.71)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginLeft: 20,
    letterSpacing: 0.5,
  },
  mapsHamburgerIcon: {
    fontSize: 24,
    color: "#333",
    fontWeight: "600",
  },

  // Map Controls
  locationButton: {
    position: "absolute",
    top: 25,
    right: 20,
    backgroundColor: "rgba(233, 227, 227, 0.8)",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  locationButtonText: {
    fontSize: 24,
  },
  iosLocationButton: {
    position: "absolute",
    top: 85,
    right: 20,
    backgroundColor: "white",
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iosLocationButtonText: {
    fontSize: 20,
    color: colors.text.primary,
  },

  // Bottom Panel
  bottomPanel: {
    position: "absolute",
    bottom: 50,
    left: 16,
    right: 16,
    backgroundColor: colors.bg.secondary,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeText: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 0.3,
  },

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  maps_bottom_tab_navigation: {
    backgroundColor: colors.bg.secondary,
    borderTopColor: colors.border.subtle,
    borderTopWidth: 1,
    elevation: 0,
    height: 75,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    position: "absolute",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // ============================================================================
  // MODALS
  // ============================================================================

  // User Options Modal
  userOptionsModal: {
    backgroundColor: colors.bg.secondary,
    height: 300,
    width: 300,
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.border.subtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalButtons: {
    margin: 5,
    padding: 15,
    borderRadius: 12,
    minHeight: 50,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Waypoint Menu Modal
  waypointMenuModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: 0.3,
    color: colors.text.primary,
  },
  waypointMenuButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // Edit Waypoint Modal
  editWaypointModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: 0.3,
    color: colors.text.primary,
  },
  editWaypointTextInput: {
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    minWidth: 200,
    backgroundColor: colors.bg.primary,
    fontSize: 16,
    fontWeight: "400",
    color: colors.text.primary,
  },
  editWaypointButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // Delete All Waypoints Modal
  deleteAllWaypointsModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    letterSpacing: 0.3,
    color: colors.text.primary,
  },
  deleteAllWaypointsSubtext: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.text.secondary,
    marginBottom: 15,
    textAlign: "center",
    lineHeight: 20,
  },
  deleteAllWaypointsButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  // ============================================================================
  // GEAR SCREEN (PACKING LIST)
  // ============================================================================

  gearScreenContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingTop: 15,
  },
  gearScreenTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 15,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },

  // Packing List
  packingListWrapper: {
    flex: 1,
    paddingHorizontal: 15,
  },
  packingListScrollContent: {
    paddingBottom: 100,
  },

  // Section Styles
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    backgroundColor: colors.bg.secondary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.subtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    letterSpacing: 0.5,
  },

  // Packing Items
  packingItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.bg.primary,
  },
  packingItemCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  packingItemCheckboxUnchecked: {
    fontSize: 20,
    marginRight: 10,
    color: colors.text.tertiary,
  },
  packingItemCheckboxChecked: {
    fontSize: 20,
    marginRight: 10,
    color: colors.accent.success,
  },
  packingItemTextUnchecked: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.text.primary,
    flex: 1,
    letterSpacing: 0.2,
  },
  packingItemTextChecked: {
    fontSize: 16,
    fontWeight: "400",
    textDecorationLine: "line-through",
    color: colors.text.tertiary,
    flex: 1,
    letterSpacing: 0.2,
  },
  deleteItemButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteItemButtonText: {
    fontSize: 20,
    color: colors.accent.danger,
    fontWeight: "600",
  },

  // Add Item Form
  addItemFormContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.bg.secondary,
    alignItems: "center",
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addItemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.medium,
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: colors.bg.primary,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "400",
  },
  addItemButton: {
    backgroundColor: colors.accent.success,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 5,
    shadowColor: colors.accent.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addItemButtonText: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  cancelItemButton: {
    backgroundColor: colors.accent.danger,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: colors.accent.danger,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelItemButtonText: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  showAddItemButton: {
    padding: 12,
    backgroundColor: colors.accent.primary,
    borderRadius: 10,
    marginTop: 8,
    alignItems: "center",
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  showAddItemButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg.primary,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.text.secondary,
    letterSpacing: 0.3,
  },

  // ============================================================================
  // POINTS OF INTEREST SCREEN
  // ============================================================================

  poiScreenContainer: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    paddingTop: 15,
  },
  poiScreenTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 15,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  poiListContent: {
    paddingHorizontal: 15,
    paddingBottom: 100,
    flexGrow: 1,
  },

  // Waypoint Items
  waypointItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg.secondary,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  waypointImageContainer: {
    marginRight: 12,
  },
  waypointImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  waypointImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.bg.tertiary,
    justifyContent: "center",
    alignItems: "center",
  },
  waypointImagePlaceholderText: {
    fontSize: 30,
  },
  waypointInfoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  waypointName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  waypointDistance: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.text.secondary,
    letterSpacing: 0.2,
  },

  // Empty State
  emptyWaypointContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyWaypointText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptyWaypointSubtext: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.text.secondary,
    textAlign: "center",
    letterSpacing: 0.2,
  },

  // ============================================================================
  // WEATHER BOTTOM SHEET
  // ============================================================================

  bottomSheetBackground: {
    backgroundColor: colors.bg.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: colors.text.tertiary,
    width: 40,
    height: 4,
  },
  bottomSheetContentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
    borderRadius: 8,
  },
  weatherCard: {
    backgroundColor: colors.bg.secondary,
    padding: 24,
    borderRadius: 16,
    width: "100%",
    maxWidth: 320,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  temperatureContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 12,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "700",
    color: colors.accent.info,
    letterSpacing: -1,
  },
  detailsContainer: {
    backgroundColor: colors.bg.tertiary,
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.secondary,
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.subtle,
    marginVertical: 1,
  },
});
