import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import BookStore from './components/BookStore';
import Checkout from './components/Checkout';
import AdminOrders from './components/AdminOrders'; // Import the AdminOrders component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/bookstore" element={<BookStore />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/orders" element={<AdminOrders />} /> {/* Add the AdminOrders route */}
      </Routes>
    </Router>
  );
};

export default App;
