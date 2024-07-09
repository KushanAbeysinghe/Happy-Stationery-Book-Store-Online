import React, { useState, useEffect } from 'react';
import api from '../api';

const Stock = () => {
  const [books, setBooks] = useState([]);
  const [stationery, setStationery] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const booksResponse = await api.get('/books');
        const stationeryResponse = await api.get('/stationery');
        setBooks(booksResponse.data);
        setStationery(stationeryResponse.data);
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    };
    fetchStock();
  }, []);

  const handleUpdate = async (type, item) => {
    try {
      const newStockValue = item.newStock !== undefined ? item.newStock : 0;
      const updatedStock = (item.stock || 0) + newStockValue;
      const updatedPrice = item.newPrice !== undefined ? item.newPrice : item.price;
      const preorderedStock = item.preorderedStock !== undefined ? item.preorderedStock : item.preordered_stock;
      const preorderDate = item.preorderDate || item.preorder_date;

      if (type === 'book') {
        await api.put(`/books/${item.id}`, { 
          stock: updatedStock, 
          price: updatedPrice, 
          preorder: item.preorder, 
          preorderDate: preorderDate, 
          preorderedStock: preorderedStock 
        });
      } else if (type === 'stationery') {
        await api.put(`/stationery/${item.id}`, { stock: updatedStock, price: updatedPrice });
      }
      alert('Stock updated successfully');
      window.location.reload(); // Refresh the page to reflect changes
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  const handleInputChange = (item, field, value) => {
    item[field] = value;
    if (field === 'newStock' && value === '') {
      delete item.newStock;
    }
    if (field === 'newPrice' && value === '') {
      delete item.newPrice;
    }
    if (field === 'preorderedStock' && value === '') {
      delete item.preorderedStock;
    }
  };

  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredStationery = stationery.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));

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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Current Quantity</th>
            <th>New Quantity</th>
            <th>Current Price</th>
            <th>New Price</th>
            <th>Preorder</th>
            <th>Preorder Date</th>
            <th>Preordered Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map(book => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.stock}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  defaultValue={book.stock}
                  onChange={(e) => handleInputChange(book, 'newStock', parseInt(e.target.value))}
                />
              </td>
              <td>{book.price}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  defaultValue={book.price}
                  onChange={(e) => handleInputChange(book, 'newPrice', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  defaultChecked={book.preorder}
                  onChange={(e) => handleInputChange(book, 'preorder', e.target.checked ? 1 : 0)}
                />
              </td>
              <td>
                <input
                  type="date"
                  defaultValue={book.preorder_date ? book.preorder_date.split('T')[0] : ''}
                  onChange={(e) => handleInputChange(book, 'preorderDate', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  defaultValue={book.preordered_stock}
                  onChange={(e) => handleInputChange(book, 'preorderedStock', parseInt(e.target.value))}
                />
              </td>
              <td>
                <button onClick={() => handleUpdate('book', book)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Stationery</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Current Quantity</th>
            <th>New Quantity</th>
            <th>Current Price</th>
            <th>New Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStationery.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.stock}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  defaultValue={item.stock}
                  onChange={(e) => handleInputChange(item, 'newStock', parseInt(e.target.value))}
                />
              </td>
              <td>{item.price}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  defaultValue={item.price}
                  onChange={(e) => handleInputChange(item, 'newPrice', parseFloat(e.target.value))}
                />
              </td>
              <td>
                <button onClick={() => handleUpdate('stationery', item)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
