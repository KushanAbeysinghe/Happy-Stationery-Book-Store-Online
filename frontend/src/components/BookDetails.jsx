import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import QuantityPopup from './QuantityPopup';
import { GlassMagnifier } from 'react-image-magnifiers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaShoppingCart, FaTruck, FaLock, FaHeadset } from 'react-icons/fa';

const BookDetails = ({ books, updateCart }) => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const selectedBook = books.find(book => book.id.toString() === id);
      if (selectedBook) {
        setBook(selectedBook);
      }
      setLoading(false);
    };
    fetchBook();
  }, [id, books]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
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

  if (!book) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
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

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const addToCart = (item, quantity) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === 'book');
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity, type: 'book' });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart(cart);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // Formats the date as YYYY-MM-DD
  };

  return (
    <div className="container book-details mt-5">
      <Helmet>
        <meta property="og:title" content={book.title} />
        <meta property="og:description" content={book.description} />
        <meta property="og:image" content={book.images[selectedImage]} />
        <meta property="og:url" content={`https://karateonline.lk/books/${id}`} />
      </Helmet>
      <div className="row book-details-container">
        <div className="col-md-5 d-flex flex-column align-items-center">
          <div className="image-container mb-3">
            <GlassMagnifier
              imageSrc={book.images[selectedImage]}
              imageAlt={book.title}
              magnifierSize="50%"
              magnifierBorderSize={2}
              magnifierBorderColor="rgba(255, 255, 255, 0.5)"
              magnifierOffsetX={0}
              magnifierOffsetY={0}
              magnifierZoom={2}
              style={{ width: '100%', height: 'auto', borderRadius: '15px' }}
            />
          </div>
          <div className="image-thumbnails d-flex justify-content-center">
            {book.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Book ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'selected' : ''}`}
                onClick={() => handleImageClick(index)}
                style={styles.thumbnail}
              />
            ))}
          </div>
        </div>
        <div className="col-md-7">
          <div className="book-info p-4">
            <h2 className="book-title">{book.title}</h2>
            <h4><strong>Price:</strong> LKR {book.price}</h4>
            <p><strong>Stock:</strong> {book.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
            {book.stock === 0 && book.preorder && (
              <p><strong>Available from:</strong> {new Date(book.preorder_date).toLocaleDateString()}</p>
            )}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
              <div className="icons mb-3 mb-md-0">
                <FaShoppingCart className="icon" title="Shopping Cart" />
                <FaTruck className="icon" title="Fast Delivery" />
                <FaLock className="icon" title="Secure" />
                <FaHeadset className="icon" title="24/7 Customer Support" />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setIsPopupOpen(true)}
                disabled={book.stock === 0}
                style={{ cursor: book.stock === 0 ? 'not-allowed' : 'pointer' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <div className="book-specifications mt-4 p-4">
            <h5 className="specifications-header">Product Specifications</h5>
            <p><strong>Book Description:</strong> {book.description || 'No description available for this product.'}</p>
            <div className="row">
              <div className="col-md-6">
                <p><strong>ISBN-13:</strong> {book.isbn13}</p>
                <p><strong>Language:</strong> {book.language}</p>
                <p><strong>Binding:</strong> {book.binding}</p>
                <p><strong>Author:</strong> {book.author}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Publisher:</strong> {book.publisher}</p>
                <p><strong>Publishing Date:</strong> {formatDate(book.publishing_date)}</p>
                <p><strong>Product Edition:</strong> {book.product_edition}</p>
                <p><strong>Product Weight:</strong> {book.weight} Kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br></br><br></br><br></br><br></br>

      {isPopupOpen && (
        <QuantityPopup
          item={book}
          onClose={() => setIsPopupOpen(false)}
          onAddToCart={addToCart}
        />
      )}
      <style>
        {`
          .book-details-container {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .book-title {
            font-size: 2rem;
            font-weight: bold;
          }
          .book-info p {
            font-size: 1.1rem;
            margin: 5px 0;
          }
          .book-specifications {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .specifications-header {
            font-size: 1.5rem;
            font-weight: bold;
            color: #343a40;
          }
          .image-container {
            width: 80%;
            max-width: 300px;
            border: 2px solid #ccc;
            border-radius: 15px;
            padding: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .image-thumbnails img {
            margin: 5px;
            width: 50px;
            height: auto;
            cursor: pointer;
            border: 1px solid transparent;
            border-radius: 5px;
          }

          .image-thumbnails img.selected {
            border: 1px solid #007bff;
          }

          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
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

          .icons {
            display: flex;
            gap: 15px;
          }

          .icon {
            font-size: 1.5rem;
            color: #007bff;
          }

          @media (max-width: 768px) {
            .d-flex.flex-column.flex-md-row {
              flex-direction: column !important;
              align-items: start !important;
            }
            .btn.btn-primary {
              width: 100%;
              margin-top: 15px;
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  thumbnail: {
    margin: '5px',
    width: '50px',
    height: 'auto',
    cursor: 'pointer',
    border: '1px solid transparent',
    borderRadius: '5px',
  },
};

export default BookDetails;
