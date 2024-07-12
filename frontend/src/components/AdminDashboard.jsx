import React, { useState, useEffect } from 'react';
import { Nav, Tab, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth from AuthContext
import api from '../api';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get logout function from useAuth

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
      const stationeryResponse = await api.get('/stationery');
      setStationeryItems(stationeryResponse.data);
    } catch (error) {
      console.error('Error adding stationery item:', error);
    }
  };

  const handleSelect = (key) => {
    if (key === 'orders') {
      navigate('/admin/orders');
    } else if (key === 'stock') {
      navigate('/admin/stock');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDeleteBook = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
      alert('Book deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  const handleDeleteStationery = async (id) => {
    try {
      await api.delete(`/stationery/${id}`);
      setStationeryItems(stationeryItems.filter(item => item.id !== id));
      alert('Stationery item deleted successfully');
    } catch (error) {
      console.error('Error deleting stationery item:', error);
      alert('Failed to delete stationery item');
    }
  };

  const handleUpdateBookPrice = async (id, newPrice) => {
    try {
      await api.put(`/books/price/${id}`, { price: newPrice });
      setBooks(books.map(book => (book.id === id ? { ...book, price: newPrice } : book)));
      alert('Book price updated successfully');
    } catch (error) {
      console.error('Error updating book price:', error);
      alert('Failed to update book price');
    }
  };

  const handleUpdateStationeryPrice = async (id, newPrice) => {
    try {
      await api.put(`/stationery/price/${id}`, { price: newPrice });
      setStationeryItems(stationeryItems.map(item => (item.id === id ? { ...item, price: newPrice } : item)));
      alert('Stationery price updated successfully');
    } catch (error) {
      console.error('Error updating stationery price:', error);
      alert('Failed to update stationery price');
    }
  };

  return (
    <Container className="mt-5">
      <Tab.Container defaultActiveKey="dashboard" onSelect={handleSelect}>
        <Nav variant="pills" className="justify-content-between mb-4">
          <div className="d-flex">
            <Nav.Item>
              <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="orders">Orders</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="stock">Stock</Nav.Link>
            </Nav.Item>
          </div>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Nav>
        <Row>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <h2 className="text-center mb-4">Admin Dashboard</h2>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h3>Add New Category</h3>
                    <form onSubmit={handleCategorySubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Category Name"
                          value={newCategory}
                          onChange={handleCategoryChange}
                          required
                        />
                      </div>
                      <button className="btn btn-primary" type="submit">Add Category</button>
                    </form>
                  </div>

                  <div className="col-md-6 mb-4">
                    <h3>Add New Stationery Category</h3>
                    <form onSubmit={handleStationeryCategorySubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Stationery Category Name"
                          value={newStationeryCategory}
                          onChange={handleStationeryCategoryChange}
                          required
                        />
                      </div>
                      <button className="btn btn-primary" type="submit">Add Stationery Category</button>
                    </form>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h3>Add New Book</h3>
                    <form onSubmit={handleBookSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          placeholder="Title"
                          value={newBook.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          name="author"
                          className="form-control"
                          placeholder="Author"
                          value={newBook.author}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="number"
                          name="price"
                          className="form-control"
                          placeholder="Price"
                          value={newBook.price}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="number"
                          name="stock"
                          className="form-control"
                          placeholder="Stock"
                          value={newBook.stock}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <select
                          name="categoryId"
                          className="form-control"
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
                      </div>
                      <div className="form-group">
                        <input type="file" name="images" onChange={handleFileChange} multiple required className="form-control-file" />
                      </div>
                      <button className="btn btn-primary" type="submit">Add Book</button>
                    </form>
                  </div>

                  <div className="col-md-6 mb-4">
                    <h3>Add New Stationery Item</h3>
                    <form onSubmit={handleStationerySubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          placeholder="Title"
                          value={newStationery.title}
                          onChange={handleStationeryInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="number"
                          name="price"
                          className="form-control"
                          placeholder="Price"
                          value={newStationery.price}
                          onChange={handleStationeryInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="number"
                          name="stock"
                          className="form-control"
                          placeholder="Stock"
                          value={newStationery.stock}
                          onChange={handleStationeryInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <select
                          name="categoryId"
                          className="form-control"
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
                      </div>
                      <div className="form-group">
                        <input type="file" name="image" onChange={handleStationeryFileChange} required className="form-control-file" />
                      </div>
                      <button className="btn btn-primary" type="submit">Add Stationery Item</button>
                    </form>
                  </div>
                </div>

                <h3 className="mt-5">Books</h3>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Preorder</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map(book => (
                        <tr key={book.id}>
                          <td>{book.title}</td>
                          <td>{book.author}</td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={book.price}
                              onChange={(e) => handleUpdateBookPrice(book.id, parseFloat(e.target.value))}
                              className="form-control"
                            />
                          </td>
                          <td>{book.stock}</td>
                          <td>{categories.find(cat => cat.id === book.category_id)?.name}</td>
                          <td>{book.preorder ? 'Yes' : 'No'}</td>
                          <td>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteBook(book.id)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="mt-5">Stationery</h3>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Category</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stationeryItems.map(item => (
                        <tr key={item.id}>
                          <td>{item.title}</td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={item.price}
                              onChange={(e) => handleUpdateStationeryPrice(item.id, parseFloat(e.target.value))}
                              className="form-control"
                            />
                          </td>
                          <td>{item.stock}</td>
                          <td>{stationeryCategories.find(cat => cat.id === item.category_id)?.name}</td>
                          <td>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteStationery(item.id)}>Delete</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      <style>
        {`
          .form-group {
            margin-bottom: 1rem;
          }
          h3 {
            margin-top: 2rem;
          }
          .table-responsive {
            margin-top: 1rem;
          }
          .nav-pills .nav-link {
            margin: 0 5px;
          }
          .nav-pills .nav-link.active {
            background-color: #007bff;
          }
        `}
      </style>
    </Container>
  );
};

export default AdminDashboard;
