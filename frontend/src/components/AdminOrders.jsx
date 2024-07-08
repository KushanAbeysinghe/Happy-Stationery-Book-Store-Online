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
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
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

  const renderOrderTable = (orders, title) => (
    <div>
      <h3>{title}</h3>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Total</th>
              <th>Name</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>Postal Code</th>
              <th>Items</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.user_id}</td>
                <td>${order.total}</td>
                <td>{order.name}</td>
                <td>{order.address}</td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>{order.city}</td>
                <td>{order.postal_code}</td>
                <td>
                  <ul>
                    {order.items.map(item => (
                      <li key={item.id}>
                        Book ID: {item.book_id}, Title: {item.title}, Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{order.status}</td>
                <td>
                  {order.status === 'pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(order.id, 'completed')}>Confirm</button>
                      <button onClick={() => handleUpdateStatus(order.id, 'rejected')}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
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
      {renderOrderTable(pendingOrders, 'Pending Orders')}
      {renderOrderTable(completedOrders, 'Completed Orders')}
      {renderOrderTable(rejectedOrders, 'Rejected Orders')}
    </div>
  );
};

export default AdminOrders;
