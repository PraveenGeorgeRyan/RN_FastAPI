import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { create } from 'zustand';

// Import environment variables
import { API_URL_EMULATOR, API_URL_LOCAL, API_URL_DEVICE } from '@env';

import { RootStackParamList } from '../navigation';

// Auth store using Zustand
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  login: (token) => set({ token, isAuthenticated: true }),
  logout: () => set({ token: null, isAuthenticated: false }),
}));

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [workingServerUrl, setWorkingServerUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuthStore();

  // Get server URLs from environment variables with fallbacks
  const getServerUrls = () => {
    const urls = [];
    
    // For Android emulator
    if (Platform.OS === 'android') {
      urls.push(API_URL_EMULATOR || 'http://10.0.2.2:8000');
    }
    
    // For iOS simulator or web
    urls.push(API_URL_LOCAL || 'http://localhost:8000');
    
    // For physical devices
    urls.push(API_URL_DEVICE || 'http://127.0.0.1:8000');
    
    // Filter out any duplicates
    return [...new Set(urls)];
  };

  // Find a working server URL on component mount
  useEffect(() => {
    async function findWorkingServer() {
      const serverUrls = getServerUrls();
      console.log('Trying to find a working server from:', serverUrls);
      
      for (const url of serverUrls) {
        try {
          console.log(`Testing connection to ${url}/ping...`);
          const response = await fetch(`${url}/ping`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`Server at ${url} responded with:`, data);
            setWorkingServerUrl(url);
            console.log(`Using server at ${url}`);
            return;
          }
        } catch (error) {
          console.log(`Server at ${url} is not reachable:`, error);
        }
      }
      
      console.log('Could not find a working server');
    }
    
    findWorkingServer();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    if (!workingServerUrl) {
      Alert.alert(
        'Server Connection Error',
        'Cannot connect to the server. Please check your network connection and try again.'
      );
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Attempting to login at: ${workingServerUrl}/token`);
      
      // Use URLSearchParams to format data correctly for FastAPI
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      
      const formString = formData.toString();
      console.log('Form data being sent:', formString);

      const response = await fetch(`${workingServerUrl}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: formString,
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      console.log('Login successful:', data);
      // Store the token in Zustand store
      login(data.access_token);
      
      // Navigate to the main screen
      navigation.navigate('Overview');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed', 
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="mb-8 text-center text-3xl font-bold text-black">RN_FastAPI App</Text>
      <Text className="mb-8 text-center text-3xl font-bold text-blue-600">Login</Text>
      
      {!workingServerUrl && (
        <View className="mb-4 p-3 bg-yellow-100 rounded-lg">
          <Text className="text-yellow-800 text-center">
            Searching for server connection...
          </Text>
        </View>
      )}
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Username</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>
      
      <View className="mb-6">
        <Text className="text-gray-700 mb-2">Password</Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg bg-gray-50">
          <TextInput
            className="flex-1 p-3"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            className="pr-3"
          >
            <Text className="text-blue-500 font-semibold">
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg"
        onPress={handleLogin}
        disabled={isLoading || !workingServerUrl}
      >
        {isLoading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white text-center font-semibold">
            {workingServerUrl ? 'Login' : 'Waiting for server...'}
          </Text>
        )}
      </TouchableOpacity>
      
      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity>
          <Text className="text-blue-500 font-semibold">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
