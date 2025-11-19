import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPendingOrders, type PendingOrderView } from '@/services/vehicle/vehicleOwnerService';

export default function VOPendingOrdersScreen() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<PendingOrderView[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingOrders({ limit: 20, page: 1 });
      setOrders(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load pending orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pending Orders (VO)</Text>
        <TouchableOpacity onPress={load}>
          <Text style={styles.refresh}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}> 
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.order_id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.route}>{item.pickup_city} → {item.drop_city}</Text>
              <Text style={styles.meta}>Type: {item.trip_type} • Car: {item.car_type}</Text>
              <Text style={styles.meta}>Distance: {item.trip_distance} km • Time: {item.trip_time}</Text>
              <Text style={styles.price}>Total: ₹{item.total_amount ?? 'N/A'}</Text>
              <Text style={styles.meta}>Per km: {item.per_km_price != null ? `₹${item.per_km_price}` : 'N/A'}</Text>
              <Text style={styles.meta}>Status: {item.assignment_status}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No pending orders</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  refresh: { color: '#2563EB', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#EF4444' },
  card: { margin: 12, padding: 16, borderRadius: 12, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB' },
  route: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  meta: { color: '#6B7280', marginTop: 2 },
  price: { marginTop: 8, fontSize: 16, fontWeight: '700', color: '#111827' },
  empty: { textAlign: 'center', marginTop: 24, color: '#6B7280' },
});


