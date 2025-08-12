import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addMoney: (amount: number) => void;
  deductMoney: (amount: number, description: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(1500);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'credit',
      amount: 2000,
      description: 'Initial Balance',
      date: '2025-01-20 10:30 AM'
    },
    {
      id: '2',
      type: 'debit',
      amount: 50,
      description: 'Trip Commission',
      date: '2025-01-19 05:45 PM'
    },
    {
      id: '3',
      type: 'debit',
      amount: 450,
      description: 'Trip Earnings Payout',
      date: '2025-01-19 05:45 PM'
    }
  ]);

  const addMoney = (amount: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'credit',
      amount,
      description: 'Wallet Top-up',
      date: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };

    setBalance(prev => prev + amount);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deductMoney = (amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'debit',
      amount,
      description,
      date: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };

    setBalance(prev => prev - amount);
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, addMoney, deductMoney }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}