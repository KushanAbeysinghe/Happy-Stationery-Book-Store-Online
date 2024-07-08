import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    price: '',
    stock: '',
    categoryId: '',
    image: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await api.get('/books');
        setBooks(booksResponse.data);
        const categoriesResponse = await api.get('/categories');
        setCategories(categoriesResponse.data);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setNewBook({
      ...newBook,
      image: e.target.files[0]
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
    formData.append('image', newBook.image);

    try {
      await api.post('/books', formData);
      alert('Book added successfully');
      setNewBook({
        title: '',
        author: '',
        price: '',
        stock: '',
        categoryId: '',
        image: null
      });
      // Refresh books
      const booksResponse = await api.get('/books');
      setBooks(booksResponse.data);
    } catch (error) {
      console.error('Error adding book:', error);
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
        <input type="file" name="image" onChange={handleFileChange} required />
        <button type="submit">Add Book</button>
      </form>

      <h3>Books</h3>
      {books.map(book => (
        <div key={book.id}>
          <h4>{book.title}</h4>
          <p>Author: {book.author}</p>
          <p>Price: ${book.price}</p>
          <p>Stock: {book.stock}</p>
          <p>Category: {categories.find(cat => cat.id === book.category_id)?.name}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
