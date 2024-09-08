import {
  Image,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native'
import { ThemedView } from './ThemedView'
import { FavoriteIcon } from './navigation/Favorite'
import { useEffect, useState } from 'react'
import { useAsyncStorage } from '@/hooks/useAsyncStorage'
import { Colors } from '@/constants/Colors'



const CartItem = ({ item, action }) => {
  const { data: favorites, viewed, setViewedArticle , setItem } = useAsyncStorage('favorites','viewed_articles')

  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (favorites) {
      const isAlreadyFavorite = favorites.some(
        (favArticle) => favArticle?.id === item?.id,
      )
      setIsFavorite(isAlreadyFavorite)
    }
  }, [favorites, item?.id])

 
  const date = new Date(item?.webPublicationDate)
  const readableDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  })
  
  const handleAddFavorite = async (article) => { 
    await setItem(article)
  }

  const openArticleUrl = async (article) => {
    try {
      await Linking.openURL(article.webUrl);
      await setViewedArticle(article); 
    } catch (err) {
      console.error('Failed to open or save viewed article:', err);
    }
  };
  
  return (
    <TouchableOpacity onPress={() => openArticleUrl(item)}>
      <View style={styles.stepContainer}>
        <View style={{ flex: 1, flexDirection: 'row', gap: 5 }}>
          <View style={{ flex: 1 }}>
            <Image
              style={styles.thumbnail}
              source={{ uri: item?.fields?.thumbnail }}
            />
          </View>
          <ThemedView lightColor="#fff" style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontFamily: '' }}>
              {item?.sectionName}
            </Text>
            <Text style={{ fontSize: 16, fontFamily: '' }}>
              {item?.webTitle}
            </Text>
            <Text>{readableDate}</Text>
          </ThemedView>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Pressable
            onPress={() => action(item)}
            style={{ flex: 1 }}
          >
            <FavoriteIcon
              name={isFavorite ? 'favorite' : 'favorite-outline'}
              size={28}
              color={Colors.light.tint}
            />
          </Pressable>
          <Pressable onPress={() => openArticleUrl(item)}>
            <Text style={{color:'#FA3A59'}}>Read more</Text>
          </Pressable>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default CartItem

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FA3A59',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    paddingHorizontal: 0,
  },

  stepContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderColor: '#FA3A59',
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    shadowColor: '#FA3A59',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    
  },

  thumbnail: {
    width: '100%',
    height: 120,
    marginRight: 10,
    resizeMode: 'cover',
    borderRadius: 8,
  },
})
