import {StyleSheet, View, Text, Image, Pressable, Platform} from 'react-native';

import {colors, mainNavigations, settingNavigations} from '@/constants';
import useAuth from '@/hooks/queries/useAuth';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Config from 'react-native-config';
import {ThemeMode} from '@/types';
import useThemeStore from '@/store/useThemeStore';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const {theme} = useThemeStore();
  const styles = styling(theme);
  const {getProfileQuery} = useAuth();
  const {email, nickname, imageUri, kakaoImageUri} = getProfileQuery.data || {};

  const handlePressSetting = () => {
    props.navigation.navigate(mainNavigations.SETTING, {
      screen: settingNavigations.SETTING_HOME,
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={false}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <View style={styles.userImageContainer}>
            {imageUri === null && kakaoImageUri === null && (
              <Image
                source={require('@/assets/user-default.png')}
                style={styles.userImage}
              />
            )}
            {imageUri !== null && !!kakaoImageUri && (
              <Image
                source={{
                  uri: `${
                    Platform.OS === 'ios'
                      ? 'http://localhost:3030'
                      : Config.IPCONFIG
                  }/${kakaoImageUri}`,
                }}
                style={styles.userImage}
              />
            )}
            {imageUri !== null && (
              <Image
                source={{
                  uri: `${
                    Platform.OS === 'ios'
                      ? 'http://localhost:3030'
                      : Config.IPCONFIG
                  }/${imageUri}`,
                }}
                style={styles.userImage}
              />
            )}
          </View>
          <Text style={styles.nameText}>{nickname ?? email}</Text>
        </View>
        <DrawerItemList {...props} />

        <View style={styles.bottomContainer}>
          <Pressable style={styles.bottomMenu} onPress={handlePressSetting}>
            <MaterialIcons
              name={'settings'}
              color={colors[theme].GRAY_700}
              size={18}
            />
            <Text style={styles.bottomMenuText}>설정</Text>
          </Pressable>
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

const styling = (theme: ThemeMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      backgroundColor: colors[theme].WHITE,
    },
    nameText: {
      color: colors[theme].BLACK,
    },
    userInfoContainer: {
      alignItems: 'center',
      marginTop: 15,
      marginBottom: 30,
      marginHorizontal: 15,
    },
    userImageContainer: {
      width: 70,
      height: 70,
      borderRadius: 35,
      marginBottom: 10,
    },
    userImage: {
      width: '100%',
      height: '100%',
      borderRadius: 35,
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderTopWidth: 1,
      borderTopColor: colors[theme].GRAY_200,
    },
    bottomMenu: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    bottomMenuText: {
      fontWeight: '600',
      fontSize: 15,
      color: colors[theme].GRAY_700,
    },
  });

export default CustomDrawerContent;
