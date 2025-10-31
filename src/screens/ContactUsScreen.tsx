import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { styles } from "../../styles";

const COMPANY_INFO = {
  name: "Terra OffRoad",
  email: "jason.e.green@outlook.com",
  linkedin: "https://github.com/users/JagerOtter801/projects/1",
};

const ContactUsScreen = () => {
  return (
    <View testID="contact-us-screen" style={styles.contactUsScreenContainer}>
      <Text style={styles.contactUsHeader}>Contact Us</Text>
      <Text style={styles.contactUsLabels}>Company Name:</Text>
      <Text style={styles.contactUsTextValue}>{COMPANY_INFO.name}</Text>
      <Text style={styles.contactUsLabels}>Email:</Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(`mailto:${COMPANY_INFO.email}`)}
      >
        <Text style={[styles.contactUsTextValue, styles.contactUsHyperlink]}>
          {COMPANY_INFO.email}
        </Text>
      </TouchableOpacity>
      <Text style={styles.contactUsLabels}>Github:</Text>
      <TouchableOpacity onPress={() => Linking.openURL(COMPANY_INFO.linkedin)}>
        <Text style={[styles.contactUsTextValue, styles.contactUsHyperlink]}>
          {COMPANY_INFO.linkedin}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactUsScreen;
