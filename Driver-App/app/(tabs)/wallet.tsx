import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWallet } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { IndianRupee, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import RazorpayCheckout from 'react-native-razorpay';

export default function WalletScreen() {
  const { balance, addMoney, transactions } = useWallet();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [addAmount, setAddAmount] = useState('');

  const quickAmounts = [100, 500, 1000];

  const handleAddMoney = (amount) => {
    const options = {
      description: 'Add Wallet Balance',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: 'rzp_test_1DP5mmOlF5G5ag', // Test key
      amount: amount * 100, // Convert to paise
      name: 'Drop Cars',
      prefill: {
        email: 'riaz@dropcars.com',
        contact: '9876543210',
        name: 'Riaz'
      },
      theme: { color: '#3B82F6' }
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        addMoney(amount);
        Alert.alert('Success', `₹${amount} added to your wallet successfully!`);
        setAddAmount('');
      })
      .catch((error) => {
        Alert.alert('Payment Failed', 'Unable to process payment. Please try again.');
      });
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingVertical: 20,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    balanceCard: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 24,
      marginTop: 20,
      alignItems: 'center',
    },
    balanceLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: '#E5E7EB',
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    lowBalanceWarning: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
    },
    warningText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    addMoneySection: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginTop: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
    amountInput: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    input: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    quickAmounts: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    quickAmountButton: {
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickAmountText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    addMoneyButton: {
      backgroundColor: colors.success,
      borderRadius: 12,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addMoneyButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      marginLeft: 8,
    },
    transactionsSection: {
      marginTop: 24,
      marginBottom: 20,
    },
    transactionCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    transactionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    transactionIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    transactionTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    transactionDate: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginTop: 2,
    },
    transactionAmount: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
    },
  });
  const TransactionCard = ({ transaction }) => (
    <View style={dynamicStyles.transactionCard}>
      <View style={dynamicStyles.transactionLeft}>
        <View style={[
          dynamicStyles.transactionIcon,
          { backgroundColor: transaction.type === 'credit' ? '#D1FAE5' : '#FEE2E2' }
        ]}>
          {transaction.type === 'credit' ? (
            <ArrowUpRight color={colors.success} size={16} />
          ) : (
            <ArrowDownLeft color={colors.error} size={16} />
          )}
        </View>
        <View>
          <Text style={dynamicStyles.transactionTitle}>{transaction.description}</Text>
          <Text style={dynamicStyles.transactionDate}>{transaction.date}</Text>
        </View>
      </View>
      <Text style={[
        dynamicStyles.transactionAmount,
        { color: transaction.type === 'credit' ? colors.success : colors.error }
      ]}>
        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Wallet</Text>
        <Text style={dynamicStyles.headerSubtitle}>Welcome back, {user?.name}!</Text>
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        <View style={dynamicStyles.balanceCard}>
          <Text style={dynamicStyles.balanceLabel}>Available Balance</Text>
          <Text style={dynamicStyles.balanceAmount}>₹{balance}</Text>
          {balance < 1000 && (
            <View style={dynamicStyles.lowBalanceWarning}>
              <Text style={dynamicStyles.warningText}>
                Balance below ₹1000. Add money to receive bookings.
              </Text>
            </View>
          )}
        </View>

        <View style={dynamicStyles.addMoneySection}>
          <Text style={dynamicStyles.sectionTitle}>Add Money</Text>
          
          <View style={dynamicStyles.amountInput}>
            <IndianRupee color={colors.textSecondary} size={20} />
            <TextInput
              style={dynamicStyles.input}
              placeholder="Enter amount"
              value={addAmount}
              onChangeText={setAddAmount}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={dynamicStyles.quickAmounts}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={dynamicStyles.quickAmountButton}
                onPress={() => setAddAmount(amount.toString())}
              >
                <Text style={dynamicStyles.quickAmountText}>₹{amount}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              dynamicStyles.addMoneyButton,
              { opacity: addAmount && parseInt(addAmount) > 0 ? 1 : 0.5 }
            ]}
            onPress={() => handleAddMoney(parseInt(addAmount))}
            disabled={!addAmount || parseInt(addAmount) <= 0}
          >
            <Plus color="#FFFFFF" size={20} />
            <Text style={dynamicStyles.addMoneyButtonText}>Add Money</Text>
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.transactionsSection}>
          <Text style={dynamicStyles.sectionTitle}>Transaction History</Text>
          {transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}