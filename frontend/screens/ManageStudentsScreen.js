import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Appbar,
  ActivityIndicator,
  Searchbar,
  Chip,
  FAB,
  Text,
} from 'react-native-paper';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';

export default function ManageStudentsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data.students);
      setFilteredStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterStudents = () => {
    if (!searchQuery.trim()) {
      setFilteredStudents(students);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.department.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudents();
  }, []);

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('StudentDetails', { studentId: item._id })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.studentName}>{item.name}</Title>
            <Chip
              icon="school"
              style={styles.yearChip}
              textStyle={styles.chipText}
            >
              Year {item.year}
            </Chip>
          </View>

          <Paragraph style={styles.email}>{item.email}</Paragraph>
          <Paragraph style={styles.department}>{item.department}</Paragraph>

          <View style={styles.feesContainer}>
            <View style={styles.feesRow}>
              <Text style={styles.feesLabel}>Total Fees:</Text>
              <Text style={styles.feesValue}>
                {formatCurrency(item.totalFees)}
              </Text>
            </View>
            <View style={styles.feesRow}>
              <Text style={styles.feesLabel}>Paid:</Text>
              <Text style={[styles.feesValue, styles.paidText]}>
                {formatCurrency(item.amountPaid)}
              </Text>
            </View>
            <View style={styles.feesRow}>
              <Text style={styles.feesLabel}>Pending:</Text>
              <Text
                style={[
                  styles.feesValue,
                  item.amountDue > 0 ? styles.dueText : styles.paidText,
                ]}
              >
                {formatCurrency(item.amountDue)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Manage Students" />
      </Appbar.Header>

      <Searchbar
        placeholder="Search students..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        }
      />

      <FAB
        icon="account-plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddStudent')}
      />
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
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  yearChip: {
    backgroundColor: '#e3f2fd',
  },
  chipText: {
    fontSize: 12,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  department: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 12,
  },
  feesContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  feesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  feesLabel: {
    fontSize: 14,
    color: '#666',
  },
  feesValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paidText: {
    color: '#4caf50',
  },
  dueText: {
    color: '#ff9800',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
  },
});
