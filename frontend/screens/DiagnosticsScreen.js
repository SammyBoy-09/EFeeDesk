import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../utils/api';

export default function DiagnosticsScreen() {
  const [diagnostics, setDiagnostics] = useState({
    apiUrl: 'Loading...',
    backendStatus: 'Testing...',
    errorMessage: '',
  });

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await api.get('/');
      setDiagnostics({
        apiUrl: api.defaults.baseURL,
        backendStatus: 'Connected ✅',
        errorMessage: `Response: ${JSON.stringify(response.data)}`,
      });
    } catch (error) {
      setDiagnostics({
        apiUrl: api.defaults.baseURL,
        backendStatus: 'Failed ❌',
        errorMessage: `Error: ${error.message}`,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Connection Diagnostics</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>API URL:</Text>
        <Text style={styles.value}>{diagnostics.apiUrl}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Backend Status:</Text>
        <Text style={styles.value}>{diagnostics.backendStatus}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Details:</Text>
        <Text style={styles.value}>{diagnostics.errorMessage}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={testConnection}>
        <Text style={styles.buttonText}>Retry Connection</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
