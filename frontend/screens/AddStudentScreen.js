import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Appbar,
  Snackbar,
  SegmentedButtons,
  HelperText,
  Menu,
  Divider,
  Text,
} from 'react-native-paper';
import api from '../utils/api';
import { validateCambridgeEmail } from '../utils/helpers';

export default function AddStudentScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    email: '',
    password: '',
    department: '',
    year: '1',
    sem: '1',
    totalFees: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [semesterMenuVisible, setSemesterMenuVisible] = useState(false);

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Information Technology',
    'Electrical',
  ];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showSnackbar('Please enter student name');
      return false;
    }

    if (!formData.usn.trim()) {
      showSnackbar('Please enter USN');
      return false;
    }

    if (!formData.email.trim()) {
      showSnackbar('Please enter email');
      return false;
    }

    if (!validateCambridgeEmail(formData.email)) {
      showSnackbar('Email must end with @cambridge.edu.in');
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      showSnackbar('Password must be at least 6 characters');
      return false;
    }

    if (!formData.department) {
      showSnackbar('Please select department');
      return false;
    }

    if (!formData.totalFees || isNaN(formData.totalFees) || Number(formData.totalFees) <= 0) {
      showSnackbar('Please enter valid total fees');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post('/admin/add-student', {
        ...formData,
        usn: formData.usn.toUpperCase(),
        year: Number(formData.year),
        sem: Number(formData.sem),
        totalFees: Number(formData.totalFees),
      });

      if (response.data.success) {
        const credentials = response.data.credentials;
        Alert.alert(
          'Student Created Successfully!',
          `Name: ${response.data.student.name}\nUSN: ${response.data.student.usn}\n\nLogin Credentials:\nEmail: ${credentials.email}\nPassword: ${credentials.password}\n\nPlease save these credentials and share with the student.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Add student error:', error);
      showSnackbar(
        error.response?.data?.message || 'Failed to add student'
      );
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add New Student" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TextInput
            label="Full Name *"
            value={formData.name}
            onChangeText={(value) => handleChange('name', value)}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="USN (University Serial Number) *"
            value={formData.usn}
            onChangeText={(value) => handleChange('usn', value.toUpperCase())}
            mode="outlined"
            autoCapitalize="characters"
            style={styles.input}
            left={<TextInput.Icon icon="identifier" />}
            placeholder="e.g., 1CR21CS001"
          />
          <HelperText type="info">
            University Serial Number (Unique ID)
          </HelperText>

          <TextInput
            label="Email *"
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />
          <HelperText type="info">
            Must end with @cambridge.edu.in
          </HelperText>

          <TextInput
            label="Password *"
            value={formData.password}
            onChangeText={(value) => handleChange('password', value)}
            mode="outlined"
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />
          <HelperText type="info">
            Minimum 6 characters
          </HelperText>

          <TextInput
            label="Department *"
            value={formData.department}
            onChangeText={(value) => handleChange('department', value)}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="school" />}
          />

          <SegmentedButtons
            value={formData.year}
            onValueChange={(value) => handleChange('year', value)}
            buttons={[
              { value: '1', label: 'Year 1' },
              { value: '2', label: 'Year 2' },
              { value: '3', label: 'Year 3' },
              { value: '4', label: 'Year 4' },
            ]}
            style={styles.input}
          />

          <Menu
            visible={semesterMenuVisible}
            onDismiss={() => setSemesterMenuVisible(false)}
            anchor={
              <TextInput
                label="Semester *"
                value={`Semester ${formData.sem}`}
                mode="outlined"
                editable={false}
                onPressIn={() => setSemesterMenuVisible(true)}
                style={styles.input}
                left={<TextInput.Icon icon="calendar-range" />}
                right={<TextInput.Icon icon="menu-down" />}
              />
            }
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <Menu.Item
                key={sem}
                onPress={() => {
                  handleChange('sem', sem.toString());
                  setSemesterMenuVisible(false);
                }}
                title={`Semester ${sem}`}
              />
            ))}
          </Menu>

          <TextInput
            label="Total Fees (₹) *"
            value={formData.totalFees}
            onChangeText={(value) => handleChange('totalFees', value)}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            left={<TextInput.Icon icon="currency-inr" />}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Add Student
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
