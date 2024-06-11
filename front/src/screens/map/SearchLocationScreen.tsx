import useSearchLocation from '@/hooks/useSearchLocatin';
import {StyleSheet, Text, View, Keyboard} from 'react-native';
import {useState} from 'react';
import useUserLocation from '@/hooks/useUserLocation';
import SearchInput from '@/components/common/SearchInput';
import SearchRegionResult from '@/components/map/SearchRegionResult';
import Pagination from '@/components/common/Pagination';

function SearchLocationScreen() {
  const [keyword, setKeyword] = useState<string>('');
  const {userLocation} = useUserLocation();
  const {regionInfo, pageParam, fetchNextPage, fetchPrevPage, hasNextPage} =
    useSearchLocation(keyword, userLocation);

  const handleChangeKeyword = (text: string) => {
    setKeyword(text);
  };

  return (
    <View style={styles.container}>
      <SearchInput
        autoFocus
        value={keyword}
        onChangeText={handleChangeKeyword}
        placeholder="검색할 정소를 입력하세요."
        onSubmit={() => Keyboard.dismiss()}
      />
      <SearchRegionResult regionInfo={regionInfo} />
      <Pagination
        pageParam={pageParam}
        fetchNextPage={fetchNextPage}
        fetchPrevPage={fetchPrevPage}
        hasNextPage={hasNextPage}
        totalLength={regionInfo.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default SearchLocationScreen;
