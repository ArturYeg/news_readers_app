import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorage(key, viewedKey) {
  const [data, setData] = useState([]);
  const [viewed, setViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(key);

        if (storedData !== null) {
          setData(JSON.parse(storedData));
        }

        if (viewedKey) {
          const storedViewed = await AsyncStorage.getItem(viewedKey);
          if (storedViewed !== null) {
            setViewed(JSON.parse(storedViewed));
          }
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key, viewedKey]);


  const setItem = async (newData) => {
    try {
      const existingData = Array.isArray(data) ? data : [];

      const itemExists = existingData.some((item) => item.id === newData.id);

      let updatedData;
      if (itemExists) {

        updatedData = existingData.filter((item) => item.id !== newData.id);
      } else {

        updatedData = [...existingData, newData];
      }


      await AsyncStorage.setItem(key, JSON.stringify(updatedData));


      setData(updatedData);
    } catch (error) {
      setError('Failed to update data');
    }
  };


  const setViewedArticle = async (article) => {
    try {
      const updatedViewed = [...viewed, article];
      await AsyncStorage.setItem(viewedKey ?? 'viewed_articles', JSON.stringify(updatedViewed));
      setViewed(updatedViewed);
    } catch (err) {
      setError('Failed to save viewed article');
    }
  };

  const removeItem = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setData([]);
    } catch (err) {
      setError('Failed to remove data');
    }
  };

  const deleteItem = async (id) => {
    try {
      const existingData = Array.isArray(data) ? data : [];

      const updatedData = existingData.filter((item) => item.id !== id);

      await AsyncStorage.setItem(key, JSON.stringify(updatedData));
      setData(updatedData);
    } catch (error) {
      setError('Failed to delete item');
    }
  };

  return {
    data,
    viewed,
    loading,
    error,
    setItem,
    setViewedArticle,
    removeItem,
    deleteItem
  };
}
