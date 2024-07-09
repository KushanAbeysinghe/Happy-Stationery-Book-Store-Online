import React, { useState, useEffect } from 'react';
import api from '../api';
import StationeryItem from './StationeryItem';

const Stationery = () => {
  const [stationeryItems, setStationeryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const filteredStationery = stationeryItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsToDisplay = selectedCategory
    ? filteredStationery.filter(item => item.category_id === selectedCategory)
    : filteredStationery;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div>
      <h2>Stationery Store</h2>
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
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
        {itemsToDisplay.length > 0 ? (
          itemsToDisplay.map(item => (
            <StationeryItem key={item.id} item={item} />
          ))
        ) : (
          <div>No stationery items available</div>
        )}
      </div>
    </div>
  );
};

export default Stationery;
