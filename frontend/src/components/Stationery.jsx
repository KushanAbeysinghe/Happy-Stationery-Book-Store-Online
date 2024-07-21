import React, { useState, useEffect } from 'react';
import api from '../api';
import StationeryItem from './StationeryItem';
import QuantityPopup from './QuantityPopup';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaFilter, FaTimes } from 'react-icons/fa';

const Stationery = ({ searchTerm, updateCart }) => {
  const [stationeryItems, setStationeryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [inStock, setInStock] = useState(true);
  const [outOfStock, setOutOfStock] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationeryResponse, categoriesResponse] = await Promise.all([
          api.get('/stationery'),
          api.get('/stationery-categories'),
        ]);
        setStationeryItems(stationeryResponse.data);
        setCategories(categoriesResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredStationery = stationeryItems.filter(item => {
    const matchesTitle = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? item.category_id === selectedCategory : true;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesStock = (inStock && item.stock > 0) || (outOfStock && item.stock === 0);

    return matchesTitle && matchesCategory && matchesPrice && matchesStock;
  });

  const totalPages = Math.ceil(filteredStationery.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStationery.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddToCart = (item) => {
    setSelectedItem(item);
  };

  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  const addToCart = (item, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === 'stationery');
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity, type: 'stationery' });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(cart);
    setSelectedItem(null);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
          style={{
            cursor: 'pointer',
            color: i === currentPage ? 'white' : 'black',
            margin: '0 5px',
            borderRadius: '5px',
            padding: '5px 10px'
          }}
        >
          <a className="page-link" href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{i}</a>
        </li>
      );
    }
    return (
      <nav style={{ position: 'relative', zIndex: 1 }}>
        <ul className="pagination justify-content-center">
          {pages}
        </ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            height: 100vh;
            padding-top: 20%;
          }
          .loading-spinner {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #FFDE59;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 1.5s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="container">
      <h2 className="text-center my-4">Stationery Store</h2>
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="d-flex align-items-center mb-3">
            <h3 className="mb-0 mr-2">Filters</h3>
            <FaFilter
              className="d-md-none filter-icon"
              onClick={() => setShowFilters(!showFilters)}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className={`filters ${showFilters ? 'show' : 'hide'}`}>
            <div className="filter-header d-md-none">
              <h3>Filters</h3>
              <FaTimes
                className="close-icon"
                onClick={() => setShowFilters(false)}
                style={{ cursor: 'pointer' }}
              />
            </div>
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
                <span>LKR {priceRange[0]}</span>
                <span>LKR {priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="row">
            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <div className="col-6 col-md-4 mb-4" key={item.id}>
                  <StationeryItem item={item} onAddToCart={handleAddToCart} />
                </div>
              ))
            ) : (
              <div className="col-12">No stationery items available</div>
            )}
          </div>
          {renderPagination()}
        </div>
      </div>
      {selectedItem && (
        <div className="popup">
          <QuantityPopup
            item={selectedItem}
            onClose={handleClosePopup}
            onAddToCart={addToCart}
          />
        </div>
      )}
      <style jsx>{`
        .filters {
          display: block;
          transition: max-height 0.5s ease-out, opacity 0.5s ease-out;
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 10px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }
        .filters.hide {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
        }
        .filters.show {
          max-height: 1000px; /* or any appropriate value */
          opacity: 1;
        }
        .filter-icon, .close-icon {
          font-size: 24px;
        }
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
          margin-bottom: 10px;
        }
        @media (min-width: 768px) {
          .filters {
            display: block !important;
            max-height: none !important;
            opacity: 1 !important;
          }
          .filter-icon {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .col-6 {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }
        .pagination {
          z-index: 1; /* Ensure the pagination is behind the popup */
        }
        .popup {
          z-index: 10; /* Ensure the popup is above the pagination */
          position: fixed;
         
        }
      `}</style>
    </div>
  );
};

export default Stationery;
