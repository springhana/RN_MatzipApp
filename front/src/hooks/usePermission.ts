import {useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';

import {alerts} from '@/constants';

type PermissionType = 'LOCATION' | 'PHOTO';

type PermissonOS = {
  [key in PermissionType]: Permission;
};

const androidPermissons: PermissonOS = {
  LOCATION: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PHOTO: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
};

const iosPermissons: PermissonOS = {
  LOCATION: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  PHOTO: PERMISSIONS.IOS.PHOTO_LIBRARY,
};

function usePermission(type: PermissionType) {
  useEffect(() => {
    (async () => {
      const isAndroid = Platform.OS === 'android';
      const permissonOS = isAndroid ? androidPermissons : iosPermissons;

      const checked = await check(permissonOS[type]);

      // 체크가 안될 경우 설정 창 열기
      const showPermissonAlert = () => {
        Alert.alert(
          alerts[`${type}_PERMISSION`].TITLE,
          alerts[`${type}_PERMISSION`].DESCRIPTION,
          [
            {
              text: '설정하기',
              onPress: () => Linking.openSettings(),
            },
            {
              text: '취소',
              style: 'cancel',
            },
          ],
        );
      };

      switch (checked) {
        case RESULTS.DENIED:
          if (isAndroid) {
            showPermissonAlert();
            return;
          }
          await request(permissonOS[type]);
          break;
        case RESULTS.BLOCKED:
        case RESULTS.LIMITED:
          showPermissonAlert();
          break;
        default:
          break;
      }
    })();
  }, []);
}

export default usePermission;
