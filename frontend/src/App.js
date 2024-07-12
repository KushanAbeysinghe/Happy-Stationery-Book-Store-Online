import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import AdminDashboard from './components/AdminDashboard';
import BookStore from './components/BookStore';
import Checkout from './components/Checkout';
import AdminOrders from './components/AdminOrders';
import Stationery from './components/Stationery';
import Stock from './components/Stock';
import BookDetails from './components/BookDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin'; // Add this import
import api from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import PrivateRoute from './routes/PrivateRoute';

const App = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const booksResponse = await api.get('/books');
      setBooks(booksResponse.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <HeaderWrapper totalItems={totalItems} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart cart={cart} updateCart={updateCart} />} />
        <Route path="/bookstore" element={<BookStore books={books} searchTerm={searchTerm} updateCart={updateCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} updateCart={updateCart} />} />
        <Route path="/stationery" element={<Stationery searchTerm={searchTerm} updateCart={updateCart} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/" element={<BookStore books={books} searchTerm={searchTerm} updateCart={updateCart} />} />
        <Route path="/books/:id" element={<BookDetails books={books} updateCart={updateCart} />} />

        <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/orders" element={<PrivateRoute><AdminOrders /></PrivateRoute>} />
        <Route path="/admin/stock" element={<PrivateRoute><Stock /></PrivateRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
};

const HeaderWrapper = ({ totalItems, searchTerm, setSearchTerm }) => {
  const location = useLocation();
  return (
    <Header
      totalItems={totalItems}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      currentPath={location.pathname}
    />
  );
};

export default App;
