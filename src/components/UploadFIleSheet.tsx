import React from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../Utils/ColorUtils';
import {CustomSelectOption} from './CustomSelectOption';

export interface IUploadFileSheet {
  onChooseFromLibrary?: () => void;
  onTakePhoto?: () => void;
  isOpen: boolean;
}

const UploadFileSheet = ({
  onChooseFromLibrary,
  onTakePhoto,
  isOpen,
}: IUploadFileSheet) => {
  return (
    <Modal visible={isOpen}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Upload Picture</Text>
          <Text style={styles.subTitle}>Select preferred upload method</Text>
        </View>
        <View style={styles.buttonContainer}>
          <CustomSelectOption
            title="Choose from Library"
            onPress={() => {
              if (onChooseFromLibrary) {
                onChooseFromLibrary();
              }
            }}
          />
          <CustomSelectOption
            title="Take a photo"
            onPress={() => {
              if (onTakePhoto) {
                onTakePhoto();
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 30,
    marginTop: 40,
    paddingHorizontal: 18,
  },
  textContainer: {
    gap: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 13,
    color: COLORS.textGray,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 20,
  },
});

export default UploadFileSheet;
