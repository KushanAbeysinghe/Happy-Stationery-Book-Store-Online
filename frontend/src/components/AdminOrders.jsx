import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put('/orders/status', { id, status });
      setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
      alert(`Order ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const calculateCompletedTotal = () => {
    const completedOrders = orders.filter(order => order.status === 'completed');
    return completedOrders.reduce((sum, order) => {
      const itemTotal = order.items ? order.items.reduce((itemSum, item) => itemSum + (parseFloat(item.price) || 0) * item.quantity, 0) : 0;
      return sum + itemTotal;
    }, 0).toFixed(2);
  };

  const renderOrderTable = (orders, title, includeActions) => (
    <div>
      <h3>{title}</h3>
      {orders.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Order ID</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>User ID</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Item Total</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Shipping Cost</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Subtotal</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Address</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Phone</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>City</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Postal Code</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Province</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>District</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Area</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Items</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Order Date</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Status</th>
              {includeActions && <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              console.log('Order items:', order.items);
              const itemTotal = order.items ? order.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0) : 0;
              const shippingCost = parseFloat(order.delivery_fee || 0);
              const subtotal = itemTotal + shippingCost;

              return (
                <tr key={order.id}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.id}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.user_id}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>LKR {itemTotal.toFixed(2)}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>LKR {shippingCost.toFixed(2)}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>LKR {subtotal.toFixed(2)}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.name}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.address}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.email}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.phone}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.city}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.postal_code}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.province_name}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.district_name}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.area_name}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {order.items.map(item => (
                        <li key={item.id} style={{ borderBottom: '1px solid black', padding: '4px 0' }}>
                          <div>Type: {item.book_id ? 'Book' : 'Stationery'}</div>
                          <div>Name: {item.title}</div>
                          <div>Qty: {item.quantity}</div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{new Date(order.order_date).toLocaleString()}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{order.status}</td>
                  {includeActions && (
                    <td style={{ border: '1px solid black', padding: '8px' }}>
                      {order.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateStatus(order.id, 'completed')}>Confirm</button>
                          <button onClick={() => handleUpdateStatus(order.id, 'rejected')}>Reject</button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>No orders available</div>
      )}
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching orders: {error.message}</div>;
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const rejectedOrders = orders.filter(order => order.status === 'rejected');

  return (
    <div>
      <h2>All Orders</h2>
      <h3>Total of Item Totals in Completed Orders: LKR {calculateCompletedTotal()}</h3>
      {renderOrderTable(pendingOrders, 'Pending Orders', true)}
      {renderOrderTable(completedOrders, 'Completed Orders', false)}
      {renderOrderTable(rejectedOrders, 'Rejected Orders', false)}
    </div>
  );
};

export default AdminOrders;
