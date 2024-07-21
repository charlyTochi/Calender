import {Platform} from 'react-native';
import {request, Permission} from 'react-native-permissions';

const usePermissions = () => {
  const requestPermission = async (
    androidPermission: Permission,
    iosPermission: Permission,
  ) => {
    return await Platform.select({
      android: request(androidPermission),
      ios: request(iosPermission),
    });
  };

  return {
    requestPermission,
  };
};

export default usePermissions;
