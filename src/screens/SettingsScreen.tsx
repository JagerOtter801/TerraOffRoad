import { View, Text} from 'react-native';
import { styles } from '../../styles';

const SettingsScreen = () => {
    return (
        <View testID="settings-screen" style={styles.settingsDrawerContent}>
            <Text style={{flex: 1, justifyContent: 'center', alignItems: 'center', }}>TODO: Settings Screen</Text>
        </View>
    );
};

export default SettingsScreen;