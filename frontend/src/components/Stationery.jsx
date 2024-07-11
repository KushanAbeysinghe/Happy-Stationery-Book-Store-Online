import React, { useState, useEffect } from 'react';
import api from '../api';
import StationeryItem from './StationeryItem';
import QuantityPopup from './QuantityPopup';
import './BookStore.css'; // Ensure this path is correct
import 'bootstrap/dist/css/bootstrap.min.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationeryResponse = await api.get('/stationery');
        const categoriesResponse = await api.get('/stationery-categories');
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
    setSelectedItem(null); // Close the popup after adding to cart
  };

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
      <h2 className="text-center my-4">Stationery Store</h2>
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
        </div>
        <div className="col-md-9">
          <h3>Stationery Items</h3>
          <div className="row">
            {filteredStationery.length > 0 ? (
              filteredStationery.map(item => (
                <div className="col-md-4 mb-4" key={item.id}>
                  <StationeryItem item={item} onAddToCart={handleAddToCart} />
                </div>
              ))
            ) : (
              <div className="col-12">No stationery items available</div>
            )}
          </div>
        </div>
      </div>
      {selectedItem && (
        <QuantityPopup
          item={selectedItem}
          onClose={handleClosePopup}
          onAddToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Stationery;
