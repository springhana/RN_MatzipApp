import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import {colors} from '@/constants';
import DatePicker from 'react-native-date-picker';

interface DataPickerOptionProps {
  isVisible: boolean;
  date: Date;
  onChangeDate: (data: Date) => void;
  onConfirmDate: () => void;
}

const DataPickerOption = ({
  isVisible,
  date,
  onChangeDate,
  onConfirmDate,
}: DataPickerOptionProps) => {
  return (
    <Modal visible={isVisible} transparent={true} animationType={'slide'}>
      <SafeAreaView style={styles.optionBackground}>
        <View style={styles.optionContainer}>
          <View style={styles.pickerContainer}>
            <DatePicker
              mode="date"
              date={date}
              onDateChange={onChangeDate}
              locale="ko"
            />
          </View>
        </View>
        <View style={styles.optionContainer}>
          <Pressable style={styles.optionButton} onPress={onConfirmDate}>
            <Text style={styles.optionText}>확인</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default DataPickerOption;

const styles = StyleSheet.create({
  pickerContainer: {
    alignItems: 'center',
  },
  optionBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0 0 0 / 0.5)',
  },
  optionContainer: {
    borderRadius: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: colors.GRAY_100,
    overflow: 'hidden',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    gap: 5,
  },
  optionText: {
    color: colors.BLUE_400,
    fontSize: 17,
    fontWeight: '500',
  },
});
