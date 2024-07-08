import React, { useState, useEffect } from 'react';
import api from '../api';
import Book from './Book';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching books: {error.message}</div>;
  }

  return (
    <div>
      <h2>Book Store</h2>
      {books.length > 0 ? (
        books.map(book => (
          <Book key={book.id} book={book} />
        ))
      ) : (
        <div>No books available</div>
      )}
    </div>
  );
};

export default BookList;
