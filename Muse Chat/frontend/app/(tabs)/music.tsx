import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, ActivityIndicator, Text, TextInput } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { MusicCard } from '../../components/MusicCard';
import * as SecureStore from 'expo-secure-store';

interface Track {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  previewUrl?: string;
}

export default function Music() {
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchRecommendations = async (params: Record<string, string> = {}) => {
    try {
      setError(null);
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Build URL with query parameters
      const queryParams = new URLSearchParams(params).toString();
      const url = `${process.env.EXPO_PUBLIC_API_URL}/api/music/recommendations${
        queryParams ? `?${queryParams}` : ''
      }`;

      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (error: any) {
      console.error('Failed to fetch music:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchRecommendations();
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery) {
        fetchRecommendations({ query: searchQuery });
      } else {
        fetchRecommendations();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for music..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
      />
      <FlatList
        data={recommendations}
        renderItem={({ item }) => (
          <MusicCard 
            track={item}
            onPress={() => {
              console.log('Selected track:', item.name);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? 'No results found' : 'No recommendations available'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  searchInput: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});