import React, { useState, useEffect } from 'react';
import api from '../api';

const Stock = () => {
  const [books, setBooks] = useState([]);
  const [stationeryItems, setStationeryItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newQuantities, setNewQuantities] = useState({});
  const [newPrices, setNewPrices] = useState({});

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const booksResponse = await api.get('/books');
        const stationeryResponse = await api.get('/stationery');
        setBooks(booksResponse.data);
        setStationeryItems(stationeryResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError(error);
        setLoading(false);
      }
    };
    fetchStockData();
  }, []);

  const handleUpdateBook = async (id, newQuantity, updatedPrice) => {
    const book = books.find(book => book.id === id);
    const updatedQuantity = book.stock + newQuantity;
    try {
      await api.put(`/books/${id}`, { stock: updatedQuantity, price: updatedPrice });
      setBooks(books.map(book => (book.id === id ? { ...book, stock: updatedQuantity, price: updatedPrice } : book)));
      alert('Book updated successfully');
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Failed to update book');
    }
  };

  const handleUpdateStationery = async (id, newQuantity, updatedPrice) => {
    const item = stationeryItems.find(item => item.id === id);
    const updatedQuantity = item.stock + newQuantity;
    try {
      await api.put(`/stationery/${id}`, { stock: updatedQuantity, price: updatedPrice });
      setStationeryItems(stationeryItems.map(item => (item.id === id ? { ...item, stock: updatedQuantity, price: updatedPrice } : item)));
      alert('Stationery item updated successfully');
    } catch (error) {
      console.error('Error updating stationery item:', error);
      alert('Failed to update stationery item');
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStationery = stationeryItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStockTable = (items, type) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '8px' }}>ID</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Title</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Current Quantity</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>New Quantity</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Current Price</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>New Price</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id} style={{ backgroundColor: item.stock <= 2 ? 'red' : 'transparent' }}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.id}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.title}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.stock}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <input
                type="number"
                defaultValue={0}
                onChange={(e) =>
                  setNewQuantities({ ...newQuantities, [item.id]: parseInt(e.target.value, 10) || 0 })
                }
              />
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{item.price}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <input
                type="number"
                defaultValue={item.price}
                onChange={(e) =>
                  setNewPrices({ ...newPrices, [item.id]: parseFloat(e.target.value) || item.price })
                }
              />
            </td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
              <button
                onClick={() =>
                  type === 'book'
                    ? handleUpdateBook(item.id, newQuantities[item.id] || 0, newPrices[item.id] || item.price)
                    : handleUpdateStationery(item.id, newQuantities[item.id] || 0, newPrices[item.id] || item.price)
                }
              >
                Update
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching stock data: {error.message}</div>;
  }

  return (
    <div>
      <h2>Stock Management</h2>
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <h3>Books</h3>
      {renderStockTable(filteredBooks, 'book')}
      <h3>Stationery</h3>
      {renderStockTable(filteredStationery, 'stationery')}
    </div>
  );
};

export default Stock;
