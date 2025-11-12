import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Divider } from 'react-native-paper';
import { formatCurrency, formatDate } from '../utils/helpers';

const { width: screenWidth } = Dimensions.get('window');

export default function PaymentReceipt({ payment, student }) {
  return (
    <View style={styles.receipt}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.collegeName}>Cambridge Institute of Technology North Campus</Text>
        <Text style={styles.subHeader}>Fee Payment Receipt</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Receipt Info */}
      <View style={styles.section}>
        <Text style={styles.label}>Receipt No:</Text>
        <Text style={styles.value}>{payment.transactionId}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{formatDate(payment.paymentDate)}</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Student Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Details</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{student.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>USN:</Text>
        <Text style={styles.value}>{student.usn}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{student.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Department:</Text>
        <Text style={styles.value}>{student.department}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Year:</Text>
        <Text style={styles.value}>Year {student.year} - Semester {student.sem}</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Payment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Payment Method:</Text>
        <Text style={styles.value}>{payment.paymentMethod.toUpperCase()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{payment.description || 'College Fees Payment'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, styles.successText]}>
          {payment.status.toUpperCase()}
        </Text>
      </View>

      <Divider style={styles.divider} />

      {/* Amount */}
      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>Amount Paid:</Text>
        <Text style={styles.amountValue}>{formatCurrency(payment.amount)}</Text>
      </View>

      <Divider style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This is a computer-generated receipt and does not require a signature.
        </Text>
        <Text style={styles.footerText}>
          For any queries, contact: fees@cambridge.edu.in
        </Text>
      </View>

      {/* Watermark */}
      <View style={styles.watermark}>
        <Text style={styles.watermarkText}>EFeeDesk</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  receipt: {
    backgroundColor: '#ffffff',
    padding: 16,
    width: screenWidth - 64,
    maxWidth: 500,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  collegeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#e0e0e0',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#666',
    flex: 1,
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 13,
    color: '#333',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  successText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingVertical: 8,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexWrap: 'wrap',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
    flexWrap: 'wrap',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginVertical: 2,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -20 }],
    opacity: 0.05,
  },
  watermarkText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
});
