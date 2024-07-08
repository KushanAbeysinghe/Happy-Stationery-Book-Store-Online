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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching orders: {error.message}</div>;
  }

  return (
    <div>
      <h2>All Orders</h2>
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
                        Book ID: {item.book_id}, Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
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
};

export default AdminOrders;
