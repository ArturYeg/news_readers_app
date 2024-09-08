import React, { useEffect, useState } from 'react'
import { StyleSheet, View, VirtualizedList } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import CartItem from '@/components/CartItem'
import { useAsyncStorage } from '@/hooks/useAsyncStorage'

type Article = {
  id: string
  apiUrl: string
  fields: {
    thumbnail: string
  }
  isHosted: boolean
  pillarId: string
  pillarName: string
  sectionId: string
  sectionName: string
  type: string
  webPublicationDate: string
  webTitle: string
  webUrl: string
}

export default function Favorite() {
  const { data, setItem,deleteItem } = useAsyncStorage('favorites', 'viewed_articles')
  const isFocused = useIsFocused()
  const [favoriteArticles, setFavoriteArticles] = useState([])

  
  useEffect(() => {
    if (isFocused) {
      setFavoriteArticles(data);
    }
  }, [isFocused, data]);

  const getItem = (data: Article[], index: number): Article => data[index]

  const handleDeleteFavorite = async (item) => {
    await deleteItem(item.id);  
  };

  return (
    <View style={styles.container}>
      <VirtualizedList
        showsVerticalScrollIndicator={false}
        data={favoriteArticles}
        initialNumToRender={4}
        renderItem={({ item }) => <CartItem item={item} action={handleDeleteFavorite} />}
        getItemCount={() => favoriteArticles?.length ?? 0}
        getItem={getItem}
        keyExtractor={(item) => item?.id.toString() + Math.random()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
})
