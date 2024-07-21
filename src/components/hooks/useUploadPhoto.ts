import {useState} from 'react';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import useBottomSheet from './useBottomSheet';
import usePermissions from './usePermissions';
import {PERMISSIONS} from 'react-native-permissions';

const useUploadPhoto = () => {
  const [photo, setPhoto] = useState<ImagePickerResponse | null>(null);
  const {
    bottomSheetRef: uploadSheetRef,
    open: openUploadSheet,
    close: closeUploadSheet,
  } = useBottomSheet();
  const {requestPermission} = usePermissions();

  const chooseFromLibrary = async (
    onSuccess = (photo: ImagePickerResponse) => {},
  ) => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
      });
      if (response.assets?.length) {
        setPhoto(response);
        if (onSuccess) {
          onSuccess(response);
        }
        if (uploadSheetRef.current) {
          closeUploadSheet();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const takeAPhoto = async (onSuccess = (photo: ImagePickerResponse) => {}) => {
    try {
      await requestPermission(
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.IOS.CAMERA,
      );
      const response = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
      });
      if (response.assets?.length) {
        setPhoto(response);
        if (onSuccess) {
          onSuccess(response);
        }
        if (uploadSheetRef.current) {
          closeUploadSheet();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  return {
    takeAPhoto,
    chooseFromLibrary,
    photo,
    openUploadSheet,
    uploadSheetRef,
    removePhoto,
  };
};

export default useUploadPhoto;
