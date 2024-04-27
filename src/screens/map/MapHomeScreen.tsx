import {View, Text, Button} from 'react-native';
import useAuth from '@/hooks/queries/useAuth';

function MapHomeScreen() {
  const {logoutMutation} = useAuth();

  return (
    <View>
      <Text>맵 스크린</Text>
      <Button title="로그아웃" onPress={() => logoutMutation.mutate(null)} />
    </View>
  );
}

export default MapHomeScreen;
