import { View, Text, StyleSheet, Pressable } from 'react-native';

const AVAILABLE_GENRES = [
  'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical',
  'Electronic', 'R&B', 'Country', 'Metal', 'Folk'
];

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
}

export function GenreSelector({ selectedGenres, onGenresChange }: GenreSelectorProps) {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenresChange(selectedGenres.filter(g => g !== genre));
    } else {
      onGenresChange([...selectedGenres, genre]);
    }
  };

  return (
    <View style={styles.container}>
      {AVAILABLE_GENRES.map(genre => (
        <Pressable
          key={genre}
          style={[
            styles.genre,
            selectedGenres.includes(genre) && styles.selectedGenre
          ]}
          onPress={() => toggleGenre(genre)}
        >
          <Text style={[
            styles.genreText,
            selectedGenres.includes(genre) && styles.selectedGenreText
          ]}>
            {genre}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genre: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedGenre: {
    backgroundColor: '#007AFF',
  },
  genreText: {
    color: '#333',
  },
  selectedGenreText: {
    color: '#fff',
  },
});