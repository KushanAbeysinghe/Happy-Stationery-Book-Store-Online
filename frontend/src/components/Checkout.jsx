import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Checkout = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const order = {
        userId: user.id,
        total,
        name,
        address,
        email,
        phone,
        city,
        postalCode,
        items: cart
      };
      await api.post('/orders', order);
      alert('Order placed successfully');
      localStorage.removeItem('cart');
      navigate('/bookstore');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />
        <h3>Total: ${total.toFixed(2)}</h3>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
