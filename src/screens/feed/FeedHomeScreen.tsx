import FeedList from '@/components/FeedList';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

function FeedHomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FeedList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default FeedHomeScreen;
