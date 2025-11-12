import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Appbar,
  ActivityIndicator,
  Text,
  Chip,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';

export default function AdminDashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    logout();
  };

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
        <Appbar.Content title="Admin Dashboard" />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
          <Chip icon="shield-account" style={styles.roleChip}>
            Admin
          </Chip>
        </View>

        {stats && (
          <View style={styles.statsContainer}>
            <Card style={styles.statCard}>
              <Card.Content>
                <Paragraph style={styles.statLabel}>Total Students</Paragraph>
                <Title style={styles.statValue}>{stats.totalStudents}</Title>
              </Card.Content>
            </Card>

            <Card style={styles.statCard}>
              <Card.Content>
                <Paragraph style={styles.statLabel}>Total Payments</Paragraph>
                <Title style={styles.statValue}>{stats.totalPayments}</Title>
              </Card.Content>
            </Card>

            <Card style={[styles.statCard, styles.fullWidth]}>
              <Card.Content>
                <Paragraph style={styles.statLabel}>Fees Expected</Paragraph>
                <Title style={styles.statValue}>
                  {formatCurrency(stats.totalFeesExpected)}
                </Title>
              </Card.Content>
            </Card>

            <Card style={[styles.statCard, styles.fullWidth]}>
              <Card.Content>
                <Paragraph style={styles.statLabel}>Fees Collected</Paragraph>
                <Title style={[styles.statValue, styles.successText]}>
                  {formatCurrency(stats.totalFeesCollected)}
                </Title>
              </Card.Content>
            </Card>

            <Card style={[styles.statCard, styles.fullWidth]}>
              <Card.Content>
                <Paragraph style={styles.statLabel}>Fees Pending</Paragraph>
                <Title style={[styles.statValue, styles.warningText]}>
                  {formatCurrency(stats.totalFeesPending)}
                </Title>
              </Card.Content>
            </Card>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <Button
            mode="contained"
            icon="account-plus"
            onPress={() => navigation.navigate('AddStudent')}
            style={styles.actionButton}
          >
            Add New Student
          </Button>

          <Button
            mode="outlined"
            icon="account-group"
            onPress={() => navigation.navigate('ManageStudents')}
            style={styles.actionButton}
          >
            Manage Students
          </Button>
        </View>
      </ScrollView>

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
  scrollContent: {
    padding: 16,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roleChip: {
    backgroundColor: '#1976d2',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
  },
  fullWidth: {
    width: '100%',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  successText: {
    color: '#4caf50',
  },
  warningText: {
    color: '#ff9800',
  },
  actionsContainer: {
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1976d2',
  },
});
