import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {ImagePickerResponse} from 'react-native-image-picker';
import PushNotification, {Importance} from 'react-native-push-notification';
import CustomDatePicker from './src/components/AppDatePicker';
import useUploadPhoto from './src/components/hooks/useUploadPhoto';
import UploadFileSheet from './src/components/UploadFIleSheet';
import {COLORS} from './src/Utils/ColorUtils';
import {generateUniqueId, SizeUtils} from './src/Utils/SizeUtils';
import {PermissionsAndroid} from 'react-native';
import moment from 'moment';

type EventItem = {
  id: string;
  title: string;
  time: string;
  image: string | null;
  timeStamp: Date;
};

type Items = {
  [date: string]: EventItem[];
};

const App = () => {
  const [items, setItems] = useState<Items>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [editing, setEditing] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [newImage, setNewImage] = useState<string>('');
  const {takeAPhoto, chooseFromLibrary} = useUploadPhoto();
  const [defaultTime, setDefaultTime] = useState(new Date());

  useEffect(() => {
    const initializeItems = () => {
      const dates: Items = {};
      for (let i = 0; i < 30; i++) {
        const date = moment().add(i, 'days').format('YYYY-MM-DD');
        dates[date] = items[date] || [];
      }
      setItems(dates);
    };

    initializeItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }

    PushNotification.createChannel(
      {
        channelId: '100',
        channelName: 'Default Channel',
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      created => console.log('Channel created:', created),
    );
  }, []);

  const notify = () => {
    if (Platform.OS === 'android') {
      PushNotification.localNotification({
        channelId: '100',
        title: 'Test',
        message: 'This is a test notification',
        largeIcon:
          'https://upload.wikimedia.org/wikipedia/commons/b/b2/FCMB_Logo.png',
        largeIconUrl:
          'https://upload.wikimedia.org/wikipedia/commons/b/b2/FCMB_Logo.png',
        bigPictureUrl:
          'https://upload.wikimedia.org/wikipedia/commons/b/b2/FCMB_Logo.png',
        bigLargeIconUrl:
          'https://upload.wikimedia.org/wikipedia/commons/b/b2/FCMB_Logo.png',
      });
    } else {
      PushNotificationIOS.addNotificationRequest({
        id: '100',
        title: 'My Notification Title',
        body: 'My Notification Body',
      });
    }
  };

  const addEvent = async () => {
    try {
      const defaultEventTime = moment(defaultTime).format('h:mm a');
      const time = newTime || defaultEventTime;

      const newItem: EventItem = {
        id: generateUniqueId(),
        title: newTitle,
        time: time,
        image: selectedImage,
        timeStamp: selectedDate,
      };
      const newItems = {...items};
      const dateString = selectedDate.toISOString().split('T')[0];

      if (newItems[dateString] && newItems[dateString].length > 0) {
        Alert.alert(
          'Add Event',
          'There are existing events for this date. Do you want to add another event?',
          [
            {
              text: 'Add Another Event',
              onPress: () => addAnotherEvent(newItems, dateString, newItem),
            },
            {
              text: 'Cancel',
              onPress: () => console.log('Canceled'),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      } else {
        newItems[dateString] = [newItem];
        setItems(newItems);
        setModalVisible(false);
        setNewTitle('');
        setNewTime('');
        setNewImage('');
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const addAnotherEvent = (
    newItems: Items,
    dateString: string,
    newItem: EventItem,
  ) => {
    newItems[dateString].push(newItem);
    setItems(newItems);
    setModalVisible(false);
    setNewTitle('');
    setNewTime('');
    setNewImage('');
    setSelectedImage(null);
  };

  const updateEvent = useCallback(() => {
    const date = moment(selectedDate).format('YYYY-MM-DD');
    const defaultEventTime = moment(defaultTime).format('h:mm a');
    const time = newTime || defaultEventTime;

    if (!moment(selectedDate).isValid()) {
      console.error('Invalid selectedDate:', selectedDate);
      return;
    }

    const updatedEvent: EventItem = {
      ...selectedEvent!,
      title: newTitle,
      time: time,
      image: selectedImage || newImage,
    };

    const updatedItems = {...items};
    updatedItems[date] = updatedItems[date].map(event =>
      event.id === selectedEvent!.id ? updatedEvent : event,
    );

    setItems(prev => ({
      ...prev,
      [date]: updatedItems[date],
    }));

    setNewTitle('');
    setNewTime('');
    setSelectedImage(null);
    setNewImage('');
    setModalVisible(false);
    setEditing(false);
  }, [
    defaultTime,
    items,
    newImage,
    newTime,
    newTitle,
    selectedDate,
    selectedEvent,
    selectedImage,
  ]);

  const renderEmptyDate = () => (
    <View style={styles.emptyDate}>
      <Text style={{color: COLORS.fcmbPurpleLight2}}>
        No events available for this date
      </Text>
    </View>
  );

  const rowHasChanged = (r1: EventItem, r2: EventItem) => r1.title !== r2.title;

  const handleDayPress = (day: {timestamp: number}) => {
    const date = new Date(day.timestamp);
    setSelectedDate(date);
    setSelectedEvent(null);
    setEditing(false);
    setModalVisible(true);
    setNewTitle('');
    setNewTime('');
    setNewImage('');
  };

  const renderItem = (item: EventItem) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSelectedEvent(item);
        setNewTitle(item.title);
        setNewImage(item.image);
        setNewTime(item.time);
        setDefaultTime(moment(item.time, 'h:mm a').toDate());
        const parsedDate = moment(item.timeStamp, 'YYYY-MM-DD');
        if (parsedDate.isValid()) {
          setSelectedDate(parsedDate.toDate());
        } else {
          console.error('Invalid item.date:', item.timeStamp);
        }
        setEditing(true);
        setModalVisible(true);
      }}>
      {item.image && <Image source={{uri: item.image}} style={styles.image} />}
      <View style={styles.itemContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleSelectedDate = (date: moment.MomentInput) => {
    setNewTime(moment(date).format('hh:mm A'));
  };

  const handleUtilityBillUpload = (image: ImagePickerResponse) => {
    if (image?.assets?.length) {
      const photoBase64 = image.assets[0]?.uri || '';
      setSelectedImage(photoBase64);
      setIsFileOpen(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      {!modalVisible && (
        <>
          <Agenda
            items={items}
            renderItem={renderItem}
            renderEmptyDate={renderEmptyDate}
            rowHasChanged={rowHasChanged}
            pastScrollRange={12}
            futureScrollRange={12}
            hideKnob={false}
            onDayPress={handleDayPress}
            theme={{
              backgroundColor: '#E4D8EB',
              calendarBackground: '#ffffff',
              agendaKnobColor: '#5F138D',
              selectedDayBackgroundColor: '#5F138D',
              selectedDayTextColor: '#ffffff',
              dotColor: '#5F138D',
              selectedDotColor: '#5F138D',
              todayTextColor: '#5F138D',
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
              agendaDayTextColor: '#E4D8EB',
              agendaDayNumColor: '#E4D8EB',
              agendaTodayColor: '#E4D8EB',
            }}
          />

          <Button
            color={COLORS.fcmbPurple}
            title={'Notify'}
            onPress={() => notify()}
          />
        </>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editing ? 'Edit Event' : 'Add Event'}
            </Text>

            <View style={styles.fullWidth}>
              <Text style={styles.nameLabel}>{'Event Name'}</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={newTitle}
              onChangeText={setNewTitle}
              placeholderTextColor={COLORS.fcmbPurpleLight}
            />
            <View style={styles.fullWidth}>
              <CustomDatePicker
                selectedDate={handleSelectedDate}
                initialDate={editing ? selectedEvent!.timeStamp : new Date()}
                defaultTime={defaultTime}
                isEditing={editing}
              />
            </View>

            {selectedImage || newImage ? (
              <View style={{marginTop: 10, marginBottom: 10}}>
                <Image
                  source={{uri: selectedImage || newImage}}
                  style={styles.imagePreview}
                />
              </View>
            ) : null}

            {isFileOpen && (
              <UploadFileSheet
                isOpen={isFileOpen}
                onChooseFromLibrary={() =>
                  chooseFromLibrary(handleUtilityBillUpload)
                }
                onTakePhoto={() => takeAPhoto(handleUtilityBillUpload)}
              />
            )}

            <View style={{marginTop: 10}}>
              <Button
                color={COLORS.fcmbPurple}
                title={editing ? 'Update Image' : 'Add Image'}
                onPress={() => setIsFileOpen(true)}
              />
            </View>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={editing ? updateEvent : addEvent}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>
                  {editing ? 'Update Event' : 'Add Event'}
                </Text>
              </TouchableOpacity>
              <View style={styles.modalButtonMargin}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#E4D8EB',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    flex: 1,
    flexDirection: 'row',
  },
  itemContent: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5F138D',
  },
  time: {
    fontSize: 14,
    color: '#5F138D',
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#5F138D',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.fcmbPurpleLight,
  },
  nameLabel: {
    fontSize: 12,
    textAlign: 'left',
    marginBottom: 15,
    alignItems: 'flex-start',
    color: COLORS.fcmbPurpleLight,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: COLORS.fcmbPurpleLight,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    color: COLORS.fcmbPurpleLight,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  fullWidth: {
    width: '100%',
  },
  modalButtonContainer: {
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: COLORS.fcmbPurpleLight,
    width: SizeUtils.responsiveWidth(50),
    height: SizeUtils.responsiveHeight(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: COLORS.fcmbPurple,
  },
  modalButtonMargin: {
    marginTop: 15,
  },
});

export default App;
