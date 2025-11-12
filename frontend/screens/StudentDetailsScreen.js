import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Appbar,
  ActivityIndicator,
  Divider,
  List,
  Dialog,
  Portal,
  TextInput,
  Text,
  Snackbar,
} from 'react-native-paper';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function StudentDetailsScreen({ route, navigation }) {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editedFees, setEditedFees] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editDetailsVisible, setEditDetailsVisible] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedUsn, setEditedUsn] = useState('');
  const [editedDepartment, setEditedDepartment] = useState('');
  const [editedYear, setEditedYear] = useState('');
  const [editedSem, setEditedSem] = useState('');
  const [editedTotalFeesAll, setEditedTotalFeesAll] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const response = await api.get(`/admin/students/${studentId}`);
      setStudent(response.data.student);
      setEditedFees(response.data.student.totalFees.toString());
  // prefill edit form fields
  setEditedName(response.data.student.name || '');
  setEditedUsn(response.data.student.usn || '');
  setEditedDepartment(response.data.student.department || '');
  setEditedYear(response.data.student.year?.toString() || '');
  setEditedSem(response.data.student.sem?.toString() || '');
  setEditedTotalFeesAll(response.data.student.totalFees?.toString() || '');
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDetails = async () => {
    // basic validation
    if (!editedName.trim()) {
      setSnackbarMsg('Please enter student name');
      setSnackbarVisible(true);
      return;
    }
    if (!editedUsn.trim()) {
      setSnackbarMsg('Please enter USN');
      setSnackbarVisible(true);
      return;
    }
    if (!editedDepartment.trim()) {
      setSnackbarMsg('Please enter department');
      setSnackbarVisible(true);
      return;
    }
    if (!editedYear || isNaN(editedYear) || Number(editedYear) < 1 || Number(editedYear) > 4) {
      setSnackbarMsg('Please enter valid year (1-4)');
      setSnackbarVisible(true);
      return;
    }
    if (!editedSem || isNaN(editedSem) || Number(editedSem) < 1 || Number(editedSem) > 8) {
      setSnackbarMsg('Please enter valid semester (1-8)');
      setSnackbarVisible(true);
      return;
    }
    if (!editedTotalFeesAll || isNaN(editedTotalFeesAll) || Number(editedTotalFeesAll) <= 0) {
      setSnackbarMsg('Please enter valid total fees');
      setSnackbarVisible(true);
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        name: editedName,
        usn: editedUsn.toUpperCase(),
        department: editedDepartment,
        year: Number(editedYear),
        sem: Number(editedSem),
        totalFees: Number(editedTotalFeesAll),
      };

      const response = await api.patch(`/admin/update-fees/${studentId}`, payload);
      if (response.data.success) {
        setEditDetailsVisible(false);
        fetchStudentDetails();
        Alert.alert('Success', 'Student details updated successfully');
      }
    } catch (error) {
      console.error('Update student details error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update student');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateFees = async () => {
    if (!editedFees || isNaN(editedFees) || Number(editedFees) <= 0) {
      Alert.alert('Error', 'Please enter valid fees amount');
      return;
    }

    setUpdating(true);

    try {
      const response = await api.patch(`/admin/update-fees/${studentId}`, {
        totalFees: Number(editedFees),
      });

      if (response.data.success) {
        setEditDialogVisible(false);
        fetchStudentDetails();
        Alert.alert('Success', 'Fees updated successfully');
      }
    } catch (error) {
      console.error('Update fees error:', error);
      Alert.alert('Error', 'Failed to update fees');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteStudent = () => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${student?.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/students/${studentId}`);
              Alert.alert('Success', 'Student deleted successfully');
              navigation.goBack();
            } catch (error) {
              console.error('Delete student error:', error);
              Alert.alert('Error', 'Failed to delete student');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.centerContainer}>
        <Text>Student not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Student Details" />
        <Appbar.Action icon="pencil" onPress={() => setEditDetailsVisible(true)} />
        <Appbar.Action icon="delete" onPress={handleDeleteStudent} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>{student.name}</Title>
            <Paragraph style={styles.email}>{student.email}</Paragraph>
            <Paragraph style={styles.info}>USN: {student.usn}</Paragraph>
            <Paragraph style={styles.info}>
              Department: {student.department}
            </Paragraph>
            <Paragraph style={styles.info}>Year: {student.year}</Paragraph>
            <Paragraph style={styles.info}>Semester: {student.sem}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.feesHeader}>
              <Title>Fee Details</Title>
              <Button
                mode="outlined"
                icon="pencil"
                onPress={() => setEditDialogVisible(true)}
                compact
              >
                Edit
              </Button>
            </View>

            <View style={styles.feesRow}>
              <Text style={styles.feesLabel}>Total Fees:</Text>
              <Text style={styles.feesValue}>
                {formatCurrency(student.totalFees)}
              </Text>
            </View>
            <View style={styles.feesRow}>
              <Text style={styles.feesLabel}>Amount Paid:</Text>
              <Text style={[styles.feesValue, styles.paidText]}>
                {formatCurrency(student.amountPaid)}
              </Text>
            </View>
            <View style={styles.feesRow}>
              <Text style={styles.feesLabel}>Amount Pending:</Text>
              <Text
                style={[
                  styles.feesValue,
                  student.amountDue > 0 ? styles.dueText : styles.paidText,
                ]}
              >
                {formatCurrency(student.amountDue)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Payment History</Title>
          </Card.Content>
          {student.paymentHistory && student.paymentHistory.length > 0 ? (
            student.paymentHistory.map((payment, index) => (
              <React.Fragment key={payment._id}>
                <List.Item
                  title={formatCurrency(payment.amount)}
                  description={`${formatDate(payment.paymentDate)} • ${
                    payment.transactionId
                  }`}
                  left={(props) => <List.Icon {...props} icon="check-circle" />}
                />
                {index < student.paymentHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Card.Content>
              <Text style={styles.noPayments}>No payments yet</Text>
            </Card.Content>
          )}
        </Card>

        <Button
          mode="contained"
          icon="delete"
          onPress={handleDeleteStudent}
          style={styles.deleteButton}
          buttonColor="#d32f2f"
        >
          Delete Student
        </Button>
      </ScrollView>

      <Portal>
        <Dialog
          visible={editDialogVisible}
          onDismiss={() => setEditDialogVisible(false)}
        >
          <Dialog.Title>Update Total Fees</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Total Fees (₹)"
              value={editedFees}
              onChangeText={setEditedFees}
              keyboardType="numeric"
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateFees} loading={updating}>
              Update
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={editDetailsVisible}
          onDismiss={() => setEditDetailsVisible(false)}
        >
          <Dialog.Title>Edit Student Details</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Full Name"
              value={editedName}
              onChangeText={setEditedName}
              mode="outlined"
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="USN"
              value={editedUsn}
              onChangeText={(v) => setEditedUsn(v.toUpperCase())}
              mode="outlined"
              autoCapitalize="characters"
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Department"
              value={editedDepartment}
              onChangeText={setEditedDepartment}
              mode="outlined"
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Year (1-4)"
              value={editedYear}
              onChangeText={setEditedYear}
              keyboardType="numeric"
              mode="outlined"
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Semester (1-8)"
              value={editedSem}
              onChangeText={setEditedSem}
              keyboardType="numeric"
              mode="outlined"
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Total Fees (₹)"
              value={editedTotalFeesAll}
              onChangeText={setEditedTotalFeesAll}
              keyboardType="numeric"
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDetailsVisible(false)}>Cancel</Button>
            <Button onPress={handleUpdateDetails} loading={updating}>
              Update
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMsg}
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  email: {
    color: '#666',
    marginTop: 4,
  },
  info: {
    marginTop: 4,
  },
  feesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  feesLabel: {
    fontSize: 16,
    color: '#666',
  },
  feesValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paidText: {
    color: '#4caf50',
  },
  dueText: {
    color: '#ff9800',
  },
  noPayments: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
  },
  deleteButton: {
    marginTop: 8,
    marginBottom: 20,
  },
});
