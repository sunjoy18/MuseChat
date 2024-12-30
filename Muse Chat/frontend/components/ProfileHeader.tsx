import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ProfileHeaderProps {
  user: {
    username: string;
    email?: string;
    lastfmUsername?: string;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ 
            uri: `https://ui-avatars.com/api/?name=${user.username}&background=007AFF&color=fff`
          }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.username}>{user.username}</Text>
        {user.email && <Text style={styles.email}>{user.email}</Text>}
        {user.lastfmUsername && (
          <Text style={styles.lastfm}>
            Last.fm: {user.lastfmUsername}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoContainer: {
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  lastfm: {
    fontSize: 14,
    color: '#007AFF',
  },
});