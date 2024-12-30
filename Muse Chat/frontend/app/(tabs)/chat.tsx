import { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, StyleSheet, Text } from 'react-native';
import { Button } from '../../components/Button';
import { ChatMessage } from '../../components/ChatMessage';
import { useAuth } from '../../context/AuthContext';
import * as SecureStore from 'expo-secure-store';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

const EXAMPLE_COMMANDS = [
  'recommend some rock music',
  'search Bohemian Rhapsody',
  'recommend genre:jazz',
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        text: `Welcome! I can help you discover music. Try these commands:\n${EXAMPLE_COMMANDS.map(cmd => `• ${cmd}`).join('\n')}`,
        sender: 'bot',
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('No authentication token found');

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: data.response,
        sender: 'bot',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatMessage message={item} isUser={item.sender === 'user'} />
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          multiline
          editable={!isLoading}
        />
        <Button 
          onPress={sendMessage} 
          title="Send" 
          loading={isLoading}
          disabled={!inputText.trim() || isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    maxHeight: 100,
  },
});