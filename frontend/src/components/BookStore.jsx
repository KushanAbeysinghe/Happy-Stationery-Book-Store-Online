import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Book from './Book';
import QuantityPopup from './QuantityPopup';
import './BookStore.css'; // Ensure this path is correct

const BookStore = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await api.get('/books');
        const categoriesResponse = await api.get('/categories');
        setBooks(booksResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const booksToDisplay = selectedCategory
    ? filteredBooks.filter(book => book.category_id === selectedCategory)
    : filteredBooks;

  const handleAddToCart = (book) => {
    setSelectedBook(book);
  };

  const handleClosePopup = () => {
    setSelectedBook(null);
  };

  const addToCart = (item, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === 'book');
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity, type: 'book' });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Book added to cart');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div>
      <h2>Book Store</h2>
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => navigate('/cart')}>Go to Cart</button>
      <div>
        <h3>Categories</h3>
        <ul>
          <li onClick={() => setSelectedCategory(null)}>All</li>
          {categories.map(category => (
            <li key={category.id} onClick={() => setSelectedCategory(category.id)}>
              {category.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Books</h3>
        {booksToDisplay.length > 0 ? (
          booksToDisplay.map(book => (
            <Book key={book.id} book={book} onAddToCart={handleAddToCart} />
          ))
        ) : (
          <div>No books available</div>
        )}
      </div>
      {selectedBook && (
        <QuantityPopup
          item={selectedBook}
          onClose={handleClosePopup}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default BookStore;
