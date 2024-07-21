import React, {useState, useEffect} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {SizeUtils} from '../Utils/SizeUtils';
import {COLORS} from '../Utils/ColorUtils';

interface CustomDatePickerProps {
  selectedDate: (dob: Date) => void;
  initialDate: Date;
  defaultTime: Date;
  isEditing: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  initialDate = new Date(),
  defaultTime,
  isEditing = false,
}) => {
  const [date, setDate] = useState<Date>(initialDate);
  const [placeHolder, setPlaceHolder] = useState(
    isEditing
      ? defaultTime.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        })
      : initialDate.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        }),
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [textColor, setTextColor] = useState(COLORS.fcmbPurpleLight);
  const [dateSelected, setDateSelected] = useState(false);

  useEffect(() => {
    if (modalVisible && !dateSelected && isEditing) {
      const currentTime = new Date(); // Set to current time
      setDate(currentTime);
      setPlaceHolder(
        currentTime.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
        }),
      );
      setTextColor('#ffffff');
    }
  }, [modalVisible, dateSelected, isEditing]);

  const handleDateChange = (newDate: Date): void => {
    selectedDate(newDate);
    setDate(newDate);
    setPlaceHolder(
      newDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
      }),
    );
    setTextColor('#ffffff');
    setDateSelected(true);
  };

  return (
    <View>
      <Text style={[styles.title, {color: COLORS.fcmbPurpleLight}]}>Time</Text>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[
          styles.datePicker,
          dateSelected ? styles.datePickerActive : styles.datePickerInactive,
        ]}>
        <Text style={[styles.date, {color: textColor}]}>{placeHolder}</Text>
      </Pressable>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.dateMainView}>
          <View style={styles.dateView}>
            <Text style={styles.timeTxt}>Select Time</Text>
            <DatePicker
              date={date}
              onDateChange={handleDateChange}
              mode={'time'}
              dividerColor={COLORS.fcmbPurple}
            />

            <View style={styles.btn}>
              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.doneTxt}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  datePicker: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 10,
  },
  datePickerActive: {
    borderColor: COLORS.lightPurple,
  },
  datePickerInactive: {
    borderColor: COLORS.lightGray,
  },
  title: {
    fontSize: 12,
  },
  date: {
    fontSize: 14,
  },
  dateMainView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateView: {
    backgroundColor: COLORS.lightPurple,
    borderRadius: 10,
    width: '90%',
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  doneBtn: {
    backgroundColor: COLORS.fcmbPurple,
    justifyContent: 'center',
    alignItems: 'center',
    width: SizeUtils.responsiveWidth(50),
    height: SizeUtils.responsiveHeight(6),
  },
  doneTxt: {
    color: COLORS.white,
    fontWeight: '800',
  },
  timeTxt: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.fcmbPurple,
  },
});

export default CustomDatePicker;
