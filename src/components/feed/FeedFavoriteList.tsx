import React, {useState} from 'react';
import {FlatList, StyleSheet, View, Text} from 'react-native';
import FeedItem from './FeedItem';
import useGetInfiiniteFavoritePosts from '@/hooks/queries/useGetInfiniteFavoritePosts';
import useThemeStore from '@/store/useThemeStore';

function FeedFavoriteList() {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetInfiiniteFavoritePosts();
  const {theme} = useThemeStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <FlatList
      data={posts?.pages.flat()}
      renderItem={({item}) => <FeedItem post={item} />}
      keyExtractor={item => String(item.id)}
      numColumns={2}
      ListEmptyComponent={
        <View>
          <Text style={{textAlign: 'center'}}>즐겨찾기한 장소가 없습니다.</Text>
        </View>
      }
      contentContainerStyle={styles.contentContainer}
      onEndReached={handleEndReached} // 스크롤 마지막에 닫았을 때 핸들러를 연결시켜준다.
      onEndReachedThreshold={0.5} // 스크롤 마지막 위치
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      scrollIndicatorInsets={{right: 1}} // 스크롤 바 위치
      indicatorStyle={theme === 'dark' ? 'white' : 'black'}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 15,
  },
});

export default FeedFavoriteList;
