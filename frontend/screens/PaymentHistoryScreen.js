import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Appbar,
  ActivityIndicator,
  Chip,
  Text,
  Divider,
  Button,
  Portal,
  Dialog,
} from 'react-native-paper';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import PaymentReceipt from '../components/PaymentReceipt';
import { useAuth } from '../contexts/AuthContext';

export default function PaymentHistoryScreen({ navigation }) {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const receiptRef = useRef();

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await api.get('/student/payment-history');
      setPayments(response.data.payments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPaymentHistory();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return '#4caf50';
      case 'pending':
        return '#ff9800';
      case 'failed':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return 'check-circle';
      case 'pending':
        return 'clock-outline';
      case 'failed':
        return 'close-circle';
      default:
        return 'information';
    }
  };

  const handleViewReceipt = (payment) => {
    if (payment.status === 'success') {
      setSelectedPayment(payment);
      setReceiptVisible(true);
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      const uri = await captureRef(receiptRef, {
        format: 'png',
        quality: 1,
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Download Payment Receipt',
        UTI: 'image/png',
      });
    } catch (error) {
      console.error('Download receipt error:', error);
      Alert.alert('Error', 'Failed to download receipt');
    }
  };

  const renderPayment = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.amount}>{formatCurrency(item.amount)}</Title>
          <Chip
            icon={getStatusIcon(item.status)}
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}
            textStyle={{ color: getStatusColor(item.status) }}
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>

        <Paragraph style={styles.date}>
          {formatDate(item.paymentDate)}
        </Paragraph>

        <Divider style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID:</Text>
          <Text style={styles.detailValue}>{item.transactionId}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Payment Method:</Text>
          <Text style={styles.detailValue}>
            {item.paymentMethod.toUpperCase()}
          </Text>
        </View>

        {item.description && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description:</Text>
            <Text style={styles.detailValue}>{item.description}</Text>
          </View>
        )}
      </Card.Content>
      {item.status === 'success' && (
        <Card.Actions>
          <Button
            icon="download"
            mode="outlined"
            onPress={() => handleViewReceipt(item)}
            compact
          >
            Download Receipt
          </Button>
        </Card.Actions>
      )}
    </Card>
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
        <Appbar.Content title="Payment History" />
      </Appbar.Header>

      <FlatList
        data={payments}
        renderItem={renderPayment}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No payment history yet</Text>
            <Text style={styles.emptySubtext}>
              Your payment transactions will appear here
            </Text>
          </View>
        }
      />

      {/* Receipt Dialog */}
      <Portal>
        <Dialog
          visible={receiptVisible}
          onDismiss={() => setReceiptVisible(false)}
          style={styles.receiptDialog}
        >
          <Dialog.Title style={styles.receiptTitle}>Payment Receipt</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={styles.receiptScrollContent}>
              <View ref={receiptRef} collapsable={false}>
                {selectedPayment && user && (
                  <PaymentReceipt
                    payment={selectedPayment}
                    student={user}
                  />
                )}
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={handleDownloadReceipt} icon="download">
              Download
            </Button>
            <Button onPress={() => setReceiptVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
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
  listContent: {
    padding: 16,
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
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  statusChip: {
    height: 28,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  divider: {
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  receiptDialog: {
    maxHeight: '90%',
    width: '100%',
    alignSelf: 'center',
  },
  receiptTitle: {
    textAlign: 'center',
  },
  receiptScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    flexGrow: 1,
  },
});
