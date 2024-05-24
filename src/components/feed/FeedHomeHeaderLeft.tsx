import HeaderButton from '../common/HeaderButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '@/constants';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FeedStackParamList} from '@/navigations/stack/FeedStackNavigator';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import useThemeStore from '@/store/useThemeStore';

type FeedHomeHeaderLeftProps = CompositeNavigationProp<
  StackNavigationProp<FeedStackParamList>,
  DrawerNavigationProp<FeedStackParamList>
>;

function FeedHomeHeaderLeft(navigation: FeedHomeHeaderLeftProps) {
  const {theme} = useThemeStore();
  return (
    <HeaderButton
      icon={
        <Ionicons
          name="menu"
          color={colors[theme].BLACK}
          size={25}
          onPress={() => navigation.openDrawer()}
        />
      }
    />
  );
}

export default FeedHomeHeaderLeft;
