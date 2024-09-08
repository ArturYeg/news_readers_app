import {
  StyleSheet,
  Platform,
  View,
  TextInput,
  StatusBar,
  VirtualizedList,
  ActivityIndicator,
} from 'react-native'

import { useRef, useState } from 'react'
import useFetchArticles from '@/hooks/useFetchArticles'
import CartItem from '@/components/CartItem'
import { useAsyncStorage } from '@/hooks/useAsyncStorage'

export default function HomeScreen() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [firstScroll, setFirst] = useState(null)
  const currrentY = useRef(null)
  const { setItem } = useAsyncStorage('favorites','viewed_articles')


  const { articles, loading } = useFetchArticles(query, page)

  const handleEndReached = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const onScroll = (event: any) => {
    if (firstScroll === null) {
      setFirst(event.nativeEvent.contentOffset.y)
    }
    currrentY.current = event.nativeEvent.contentOffset.y
  }

  const onScrollENd = (event: any) => {

    if (firstScroll && event.nativeEvent.contentOffset.y < firstScroll) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  const getItem = (data: object[], index: number) => data[index]

  const getItemCount = (data: object[]) => data.length

  const handleAddFavorite = async (article) => { 
    await setItem(article)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search articles..."
        onChangeText={(text) => {
          setQuery(text), setPage(1)
        }}
        value={query}
        placeholderTextColor={'#030303'}
      />     
      <VirtualizedList
        ref={currrentY}
        showsVerticalScrollIndicator={false}
        data={articles}
        onScroll={onScroll}
        initialNumToRender={4}
      renderItem={({ item }) => <CartItem item={item} action={handleAddFavorite} />}
        keyExtractor={(item) => item.id.toString() + Math.random()}
        getItem={getItem}
        getItemCount={getItemCount}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onScrollEndDrag={onScrollENd}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
      />     
    </View>
  )
}

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    borderColor: '#FA3A59',
    borderWidth: 1,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    shadowColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    paddingHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    backgroundColor: '#9DBDFF',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  thumbnail: {
    width: '100%',
    height: 120,
    marginRight: 10,
    resizeMode: 'cover',
    borderRadius: 8,
  },
})
