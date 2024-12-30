import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/Button';
import { GenreSelector } from '../../components/GenreSelector';
import { ProfileHeader } from '../../components/ProfileHeader';
import * as SecureStore from 'expo-secure-store';

interface UserPreferences {
  genres: string[];
  favoriteArtists: string[];
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    genres: [],
    favoriteArtists: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserPreferences = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/preferences`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      Alert.alert('Error', 'Failed to load preferences');
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/preferences`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferences),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      Alert.alert('Success', 'Preferences saved successfully');
    } catch (error) {
      console.error('Save preferences error:', error);
      Alert.alert('Error', 'Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader user={user} />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Music Preferences</Text>
        <GenreSelector
          selectedGenres={preferences.genres}
          onGenresChange={(genres) => 
            setPreferences(prev => ({ ...prev, genres }))
          }
        />
      </View>

      <Button
        title="Save Preferences"
        onPress={handleSavePreferences}
        loading={isLoading}
        style={styles.saveButton}
      />

      <Button
        title="Logout"
        onPress={logout}
        variant="secondary"
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  saveButton: {
    margin: 16,
  },
  logoutButton: {
    margin: 16,
    backgroundColor: '#f8f8f8',
    color: '#ff3b30',
  },
});