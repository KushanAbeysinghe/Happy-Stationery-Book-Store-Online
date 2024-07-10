import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import BookStore from './components/BookStore';
import Checkout from './components/Checkout';
import AdminOrders from './components/AdminOrders';
import Stationery from './components/Stationery';
import Stock from './components/Stock';
import BookDetails from './components/BookDetails'; // Import the BookDetails component
import api from './api';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const booksResponse = await api.get('/books');
      setBooks(booksResponse.data);
    };
    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/bookstore" element={<BookStore books={books} />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/stationery" element={<Stationery />} />
        <Route path="/admin/stock" element={<Stock />} />
        <Route path="/books/:id" element={<BookDetails books={books} />} /> {/* Add BookDetails route */}
        <Route path="/" element={<BookStore books={books} />} />
      </Routes>
    </Router>
  );
};

export default App;
