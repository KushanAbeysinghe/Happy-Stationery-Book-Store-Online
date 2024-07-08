import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Book from './Book';

const BookStore = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await api.get('/books');
        setBooks(booksResponse.data);
        const categoriesResponse = await api.get('/categories');
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
        {booksToDisplay.length > 0 ? (
          booksToDisplay.map(book => (
            <Book key={book.id} book={book} />
          ))
        ) : (
          <div>No books available</div>
        )}
      </div>
    </div>
  );
};

export default BookStore;
