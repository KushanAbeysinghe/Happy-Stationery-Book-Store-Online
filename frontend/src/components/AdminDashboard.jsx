import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [stationeryCategories, setStationeryCategories] = useState([]);
  const [newStationeryCategory, setNewStationeryCategory] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    categoryId: '',
    images: [],
    preorder: false
  });
  const [newStationery, setNewStationery] = useState({
    title: '',
    price: '',
    stock: '',
    categoryId: '',
    image: null
  });
  const [stationeryItems, setStationeryItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await api.get('/books');
        const categoriesResponse = await api.get('/categories');
        const stationeryCategoriesResponse = await api.get('/stationery-categories');
        const stationeryResponse = await api.get('/stationery');
        setBooks(booksResponse.data);
        setCategories(categoriesResponse.data);
        setStationeryCategories(stationeryCategoriesResponse.data);
        setStationeryItems(stationeryResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name: newCategory });
      alert('Category added successfully');
      setNewCategory('');
      // Refresh categories
      const categoriesResponse = await api.get('/categories');
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleStationeryCategoryChange = (e) => {
    setNewStationeryCategory(e.target.value);
  };

  const handleStationeryCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/stationery-categories', { name: newStationeryCategory });
      alert('Stationery category added successfully');
      setNewStationeryCategory('');
      // Refresh stationery categories
      const stationeryCategoriesResponse = await api.get('/stationery-categories');
      setStationeryCategories(stationeryCategoriesResponse.data);
    } catch (error) {
      console.error('Error adding stationery category:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBook({
      ...newBook,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setNewBook({
      ...newBook,
      images: [...e.target.files]
    });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newBook.title);
    formData.append('author', newBook.author);
    formData.append('price', newBook.price);
    formData.append('stock', newBook.stock);
    formData.append('categoryId', newBook.categoryId);
    newBook.images.forEach(image => {
      formData.append('images', image);
    });
    formData.append('preorder', newBook.preorder);

    try {
      await api.post('/books', formData);
      alert('Book added successfully');
      setNewBook({
        title: '',
        author: '',
        price: '',
        stock: '',
        categoryId: '',
        images: [],
        preorder: false
      });
      // Refresh books
      const booksResponse = await api.get('/books');
      setBooks(booksResponse.data);
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleStationeryInputChange = (e) => {
    const { name, value } = e.target;
    setNewStationery({
      ...newStationery,
      [name]: value
    });
  };

  const handleStationeryFileChange = (e) => {
    setNewStationery({
      ...newStationery,
      image: e.target.files[0]
    });
  };

  const handleStationerySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newStationery.title);
    formData.append('price', newStationery.price);
    formData.append('stock', newStationery.stock);
    formData.append('categoryId', newStationery.categoryId);
    formData.append('image', newStationery.image);

    try {
      await api.post('/stationery', formData);
      alert('Stationery item added successfully');
      setNewStationery({
        title: '',
        price: '',
        stock: '',
        categoryId: '',
        image: null
      });
      // Refresh stationery items
      const stationeryResponse = await api.get('/stationery');
      setStationeryItems(stationeryResponse.data);
    } catch (error) {
      console.error('Error adding stationery item:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Add New Category</h3>
      <form onSubmit={handleCategorySubmit}>
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={newCategory}
          onChange={handleCategoryChange}
          required
        />
        <button type="submit">Add Category</button>
      </form>

      <h3>Add New Stationery Category</h3>
      <form onSubmit={handleStationeryCategorySubmit}>
        <input
          type="text"
          name="name"
          placeholder="Stationery Category Name"
          value={newStationeryCategory}
          onChange={handleStationeryCategoryChange}
          required
        />
        <button type="submit">Add Stationery Category</button>
      </form>

      <h3>Add New Book</h3>
      <form onSubmit={handleBookSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newBook.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={newBook.author}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newBook.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={newBook.stock}
          onChange={handleInputChange}
          required
        />
        <select
          name="categoryId"
          value={newBook.categoryId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input type="file" name="images" onChange={handleFileChange} multiple required />
        {/* <label>
          Preorder
          <input
            type="checkbox"
            name="preorder"
            checked={newBook.preorder}
            onChange={handleInputChange}
          />
        </label> */}
        <button type="submit">Add Book</button>
      </form>

      <h3>Add New Stationery Item</h3>
      <form onSubmit={handleStationerySubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newStationery.title}
          onChange={handleStationeryInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newStationery.price}
          onChange={handleStationeryInputChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={newStationery.stock}
          onChange={handleStationeryInputChange}
          required
        />
        <select
          name="categoryId"
          value={newStationery.categoryId}
          onChange={handleStationeryInputChange}
          required
        >
          <option value="">Select Category</option>
          {stationeryCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input type="file" name="image" onChange={handleStationeryFileChange} required />
        <button type="submit">Add Stationery Item</button>
      </form>

      <h3>Books</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Preorder</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>${book.price}</td>
              <td>{book.stock}</td>
              <td>{categories.find(cat => cat.id === book.category_id)?.name}</td>
              <td>{book.preorder ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Stationery</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {stationeryItems.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>LKR {item.price}</td>
              <td>{item.stock}</td>
              <td>{stationeryCategories.find(cat => cat.id === item.category_id)?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
