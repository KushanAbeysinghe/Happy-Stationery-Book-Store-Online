import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Book from './Book';
import './BookStore.css'; // Ensure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const BookStore = ({ books = [] }) => {  // Set default value for books prop
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]); // List of authors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [inStock, setInStock] = useState(true);
  const [outOfStock, setOutOfStock] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data);

        // Extract authors from books
        const authorsList = [...new Set(books.map(book => book.author))];
        setAuthors(authorsList);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [books]);

  const filteredBooks = books.filter(book => {
    const matchesTitle = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? book.category_id === selectedCategory : true;
    const matchesAuthor = selectedAuthor ? book.author === selectedAuthor : true;
    const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
    const matchesStock = (inStock && book.stock > 0) || (outOfStock && book.stock === 0);

    return matchesTitle && matchesCategory && matchesAuthor && matchesPrice && matchesStock;
  });

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="container">
      <h2 className="text-center my-4">Book Store</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 text-right">
          <button className="btn btn-primary" onClick={() => navigate('/cart')}>Go to Cart</button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <h3>Categories</h3>
          <ul className="list-group">
            <li className="list-group-item" onClick={() => setSelectedCategory(null)}>All</li>
            {categories.map(category => (
              <li key={category.id} className="list-group-item" onClick={() => setSelectedCategory(category.id)}>
                {category.name}
              </li>
            ))}
          </ul>
          <h3 className="mt-4">Filter by Stock</h3>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="inStock"
              checked={inStock}
              onChange={() => setInStock(!inStock)}
            />
            <label className="form-check-label" htmlFor="inStock">In Stock</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="outOfStock"
              checked={outOfStock}
              onChange={() => setOutOfStock(!outOfStock)}
            />
            <label className="form-check-label" htmlFor="outOfStock">Out of Stock</label>
          </div>
          <h3 className="mt-4">Filter by Price</h3>
          <div className="price-slider">
            <Slider
              range
              min={0}
              max={5000}
              defaultValue={priceRange}
              onChange={handlePriceChange}
            />
            <div className="d-flex justify-content-between">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
          <h3 className="mt-4">Filter by Author</h3>
          <ul className="list-group">
            <li className="list-group-item" onClick={() => setSelectedAuthor(null)}>All</li>
            {authors.map(author => (
              <li key={author} className="list-group-item" onClick={() => setSelectedAuthor(author)}>
                {author}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-9">
          <h3>Books</h3>
          <div className="row">
            {filteredBooks.length > 0 ? (
              filteredBooks.map(book => (
                <div className="col-md-4 mb-4" key={book.id}>
                  <Book book={book} />
                </div>
              ))
            ) : (
              <div className="col-12">No books available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookStore;
