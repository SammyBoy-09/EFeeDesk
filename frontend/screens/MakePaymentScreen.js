import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Appbar,
  TextInput,
  RadioButton,
  Text,
  Divider,
  Portal,
  Dialog,
} from 'react-native-paper';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import PaymentReceipt from '../components/PaymentReceipt';
import { useAuth } from '../contexts/AuthContext';

export default function MakePaymentScreen({ route, navigation }) {
  const { feesDetails } = route.params;
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mock');
  const [loading, setLoading] = useState(false);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const receiptRef = useRef();

  const handlePayment = async () => {
    // Validation
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const paymentAmount = Number(amount);

    if (paymentAmount > feesDetails.amountDue) {
      Alert.alert(
        'Error',
        `Payment amount cannot exceed pending amount of ${formatCurrency(
          feesDetails.amountDue
        )}`
      );
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Are you sure you want to pay ${formatCurrency(paymentAmount)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => processPayment(paymentAmount),
        },
      ]
    );
  };

  const processPayment = async (paymentAmount) => {
    setLoading(true);

    try {
      const response = await api.post('/student/pay', {
        amount: paymentAmount,
        paymentMethod,
      });

      if (response.data.success) {
        // Store payment data and show receipt
        setPaymentData(response.data.payment);
        setReceiptVisible(true);
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Failed',
        error.response?.data?.message || 'Failed to process payment'
      );
    } finally {
      setLoading(false);
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

  const handleCloseReceipt = () => {
    setReceiptVisible(false);
    navigation.navigate('StudentDashboard', { refresh: true });
  };

  const setQuickAmount = (percentage) => {
    const quickAmount = Math.round((feesDetails.amountDue * percentage) / 100);
    setAmount(quickAmount.toString());
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Make Payment" />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Fee Summary</Title>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Fees:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(feesDetails.totalFees)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Already Paid:</Text>
                <Text style={[styles.summaryValue, styles.paidText]}>
                  {formatCurrency(feesDetails.amountPaid)}
                </Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.dueLabel}>Amount Due:</Text>
                <Text style={[styles.dueValue]}>
                  {formatCurrency(feesDetails.amountDue)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Title>Payment Details</Title>

              <TextInput
                label="Enter Amount (₹)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="currency-inr" />}
              />

              <View style={styles.quickAmountContainer}>
                <Text style={styles.quickAmountLabel}>Quick Amount:</Text>
                <View style={styles.quickButtons}>
                  <Button
                    mode="outlined"
                    onPress={() => setQuickAmount(25)}
                    style={styles.quickButton}
                    compact
                  >
                    25%
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => setQuickAmount(50)}
                    style={styles.quickButton}
                    compact
                  >
                    50%
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => setQuickAmount(100)}
                    style={styles.quickButton}
                    compact
                  >
                    Full
                  </Button>
                </View>
              </View>

              <Text style={styles.methodLabel}>Payment Method:</Text>
              <RadioButton.Group
                onValueChange={(value) => setPaymentMethod(value)}
                value={paymentMethod}
              >
                <View style={styles.radioItem}>
                  <RadioButton value="mock" />
                  <Text style={styles.radioLabel}>Mock Payment (Demo)</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton value="razorpay" />
                  <Text style={styles.radioLabel}>Razorpay (Coming Soon)</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton value="stripe" />
                  <Text style={styles.radioLabel}>Stripe (Coming Soon)</Text>
                </View>
              </RadioButton.Group>

              <Card style={styles.infoCard}>
                <Card.Content>
                  <Text style={styles.infoText}>
                    💡 This is a demo payment. In production, this would integrate
                    with real payment gateways like Razorpay or Stripe.
                  </Text>
                </Card.Content>
              </Card>

              <Button
                mode="contained"
                onPress={handlePayment}
                loading={loading}
                disabled={loading}
                style={styles.payButton}
                contentStyle={styles.payButtonContent}
                icon="check"
              >
                Pay {amount ? formatCurrency(Number(amount)) : '₹0'}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Receipt Dialog */}
      <Portal>
        <Dialog
          visible={receiptVisible}
          onDismiss={handleCloseReceipt}
          style={styles.receiptDialog}
        >
          <Dialog.Title style={styles.receiptTitle}>Payment Successful!</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={styles.receiptScrollContent}>
              <View ref={receiptRef} collapsable={false}>
                {paymentData && user && (
                  <PaymentReceipt
                    payment={paymentData}
                    student={user}
                  />
                )}
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={handleDownloadReceipt} icon="download">
              Download Receipt
            </Button>
            <Button onPress={handleCloseReceipt}>Close</Button>
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  paidText: {
    color: '#4caf50',
  },
  divider: {
    marginVertical: 12,
  },
  dueLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dueValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9800',
  },
  input: {
    marginTop: 16,
    marginBottom: 12,
  },
  quickAmountContainer: {
    marginBottom: 20,
  },
  quickAmountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioLabel: {
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    marginTop: 16,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#1976d2',
  },
  payButton: {
    marginTop: 12,
  },
  payButtonContent: {
    paddingVertical: 8,
  },
  receiptDialog: {
    maxHeight: '90%',
    width: '100%',
    alignSelf: 'center',
  },
  receiptTitle: {
    textAlign: 'center',
    color: '#4caf50',
  },
  receiptScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    flexGrow: 1,
  },
});
