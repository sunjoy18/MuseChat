import { View, Text, StyleSheet } from 'react-native';

interface ChatMessageProps {
  message: {
    text: string;
    sender: 'user' | 'bot';
    timestamp: number;
  };
  isUser: boolean;
}

export function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <View style={[styles.container, isUser ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.text}>{message.text}</Text>
      <Text style={styles.timestamp}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E9E9EB',
  },
  text: {
    color: '#000',
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
});