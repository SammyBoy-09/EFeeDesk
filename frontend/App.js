import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Screens
import LoginScreen from './screens/LoginScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AddStudentScreen from './screens/AddStudentScreen';
import ManageStudentsScreen from './screens/ManageStudentsScreen';
import StudentDetailsScreen from './screens/StudentDetailsScreen';
import StudentDashboardScreen from './screens/StudentDashboardScreen';
import MakePaymentScreen from './screens/MakePaymentScreen';
import PaymentHistoryScreen from './screens/PaymentHistoryScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        // Authentication Stack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      ) : user?.role === 'admin' ? (
        // Admin Stack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
          <Stack.Screen name="AddStudent" component={AddStudentScreen} />
          <Stack.Screen name="ManageStudents" component={ManageStudentsScreen} />
          <Stack.Screen name="StudentDetails" component={StudentDetailsScreen} />
        </Stack.Navigator>
      ) : (
        // Student Stack
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} />
          <Stack.Screen name="MakePayment" component={MakePaymentScreen} />
          <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
