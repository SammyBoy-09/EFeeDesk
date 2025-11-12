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
  Appbar,
  ActivityIndicator,
  Text,
  ProgressBar,
  Chip,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';

export default function StudentDashboardScreen({ navigation, route }) {
  const [feesDetails, setFeesDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchFeesDetails();
  }, []);

  // Refresh when navigating back from payment screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.refresh) {
        fetchFeesDetails();
        // Clear the refresh param
        navigation.setParams({ refresh: undefined });
      }
    });

    return unsubscribe;
  }, [navigation, route.params?.refresh]);

  const fetchFeesDetails = async () => {
    try {
      const response = await api.get('/student/fees');
      setFeesDetails(response.data.feesDetails);
    } catch (error) {
      console.error('Error fetching fees details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeesDetails();
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

  const paymentProgress =
    feesDetails.totalFees > 0
      ? feesDetails.amountPaid / feesDetails.totalFees
      : 0;

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="My Dashboard" />
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
          <Chip icon="school" style={styles.roleChip}>
            Student
          </Chip>
        </View>

        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Department:</Text>
              <Text style={styles.profileValue}>{user?.department}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Year:</Text>
              <Text style={styles.profileValue}>{user?.year}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Email:</Text>
              <Text style={styles.profileValue}>{user?.email}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.feesCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Fee Summary</Title>

            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>
                Payment Progress: {Math.round(paymentProgress * 100)}%
              </Text>
              <ProgressBar
                progress={paymentProgress}
                color="#4caf50"
                style={styles.progressBar}
              />
            </View>

            <View style={styles.amountContainer}>
              <View style={styles.amountCard}>
                <Text style={styles.amountLabel}>Total Fees</Text>
                <Text style={styles.amountValue}>
                  {formatCurrency(feesDetails.totalFees)}
                </Text>
              </View>

              <View style={[styles.amountCard, styles.paidCard]}>
                <Text style={styles.amountLabel}>Paid</Text>
                <Text style={[styles.amountValue, styles.paidText]}>
                  {formatCurrency(feesDetails.amountPaid)}
                </Text>
              </View>

              <View
                style={[
                  styles.amountCard,
                  feesDetails.amountDue > 0 ? styles.dueCard : styles.paidCard,
                ]}
              >
                <Text style={styles.amountLabel}>Pending</Text>
                <Text
                  style={[
                    styles.amountValue,
                    feesDetails.amountDue > 0 ? styles.dueText : styles.paidText,
                  ]}
                >
                  {formatCurrency(feesDetails.amountDue)}
                </Text>
              </View>
            </View>

            {feesDetails.amountDue > 0 && (
              <Button
                mode="contained"
                icon="cash"
                onPress={() => navigation.navigate('MakePayment', { feesDetails })}
                style={styles.payButton}
                contentStyle={styles.payButtonContent}
              >
                Pay Fees
              </Button>
            )}

            {feesDetails.amountDue === 0 && (
              <Card style={styles.successBanner}>
                <Card.Content style={styles.successContent}>
                  <Text style={styles.successText}>
                    ✅ All fees paid! You're all set.
                  </Text>
                </Card.Content>
              </Card>
            )}
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          icon="history"
          onPress={() => navigation.navigate('PaymentHistory')}
          style={styles.historyButton}
        >
          View Payment History
        </Button>
      </ScrollView>
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
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roleChip: {
    backgroundColor: '#4caf50',
  },
  profileCard: {
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  profileLabel: {
    fontSize: 14,
    color: '#666',
  },
  profileValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  feesCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  amountContainer: {
    marginBottom: 20,
  },
  amountCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paidCard: {
    backgroundColor: '#e8f5e9',
  },
  dueCard: {
    backgroundColor: '#fff3e0',
  },
  amountLabel: {
    fontSize: 16,
    color: '#666',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  paidText: {
    color: '#4caf50',
  },
  dueText: {
    color: '#ff9800',
  },
  payButton: {
    marginTop: 8,
  },
  payButtonContent: {
    paddingVertical: 8,
  },
  successBanner: {
    backgroundColor: '#e8f5e9',
    marginTop: 8,
  },
  successContent: {
    padding: 8,
  },
  successText: {
    color: '#4caf50',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  historyButton: {
    marginBottom: 20,
  },
});
