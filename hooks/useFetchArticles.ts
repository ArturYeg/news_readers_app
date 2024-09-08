import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network'


const useFetchArticles = (query: string, page: number) => {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchViewedArticles = async () => {
        try {
            const storedViewed = await AsyncStorage.getItem('viewed_articles');
            if (storedViewed) {
                setArticles(JSON.parse(storedViewed));
            }
        } catch (error) {
            console.error('Error fetching viewed articles from AsyncStorage:', error);
        }
    };

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://content.guardianapis.com/search?&q=${query}&page=${page}&show-fields=thumbnail&api-key=95516e98-3509-4ba4-86c7-af9e67b12168`
            );

            if (response.status === 200) {
                if (page === 1) {
                    // New search or query change, reset articles
                    setArticles(response.data.response.results);
                } else {
                    // Append results for pagination
                    setArticles((prevArticles) => [
                        ...prevArticles,
                        ...response.data.response.results,
                    ]);
                }
            }
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkConnectionAndFetch = async () => {
        const networkState = await Network.getNetworkStateAsync();

        if (networkState.isConnected) {
            fetchArticles();
        } else {
            fetchViewedArticles();
        }
    };

    useEffect(() => {
        checkConnectionAndFetch()
    }, [query, page]);

    return { articles, loading };
};

export default useFetchArticles;
