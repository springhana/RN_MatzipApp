import {StyleSheet, Text, View} from 'react-native';
import HeaderButton from '../common/HeaderButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '@/constants';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FeedStackParamList} from '@/navigations/stack/FeedStackNavigator';
import {DrawerNavigationProp} from '@react-navigation/drawer';

type FeedHomeHeaderLeftProps = CompositeNavigationProp<
  StackNavigationProp<FeedStackParamList>,
  DrawerNavigationProp<FeedStackParamList>
>;

function FeedHomeHeaderLeft(navigation: FeedHomeHeaderLeftProps) {
  return (
    <HeaderButton
      icon={
        <Ionicons
          name="menu"
          color={colors.BLACK}
          size={25}
          onPress={() => navigation.openDrawer()}
        />
      }
    />
  );
}

const styles = StyleSheet.create({});

export default FeedHomeHeaderLeft;
