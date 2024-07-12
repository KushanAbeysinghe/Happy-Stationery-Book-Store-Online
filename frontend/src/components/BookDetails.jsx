import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import QuantityPopup from './QuantityPopup';
import { GlassMagnifier } from 'react-image-magnifiers';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookDetails = ({ books, updateCart }) => {
  const { id } = useParams();
  const book = books.find(book => book.id.toString() === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  if (!book) {
    return <div>Book not found</div>;
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

  return (
    <div className="container book-details mt-5">  {/* Added mt-5 for margin-top */}
      <div className="row">
        <div className="col-md-6">
          <GlassMagnifier
            imageSrc={book.images[selectedImage]}
            imageAlt={book.title}
            magnifierSize="50%"
            magnifierBorderSize={2}
            magnifierBorderColor="rgba(255, 255, 255, 0.5)"
            magnifierOffsetX={0}
            magnifierOffsetY={0}
            magnifierZoom={2}
            style={{ width: '100%' }}
          />
          <div className="image-thumbnails mt-2">
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
        <div className="col-md-6">
          <h2>{book.title}</h2>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Price:</strong> LKR {book.price}</p>
          <p><strong>Stock:</strong> {book.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
          {book.stock === 0 && book.preorder && (
            <p><strong>Available from:</strong> {new Date(book.preorder_date).toLocaleDateString()}</p>
          )}
          <button
            className="btn btn-primary mr-2"
            onClick={() => setIsPopupOpen(true)}
            disabled={book.stock === 0}
            style={{ cursor: book.stock === 0 ? 'not-allowed' : 'pointer' }}
          >
            Add to Cart
          </button>
        </div>
      </div>
      {isPopupOpen && (
        <QuantityPopup
          item={book}
          onClose={() => setIsPopupOpen(false)}
          onAddToCart={addToCart}
        />
      )}
      <style>
        {`
          .book-details .image-thumbnails img {
            margin-right: 5px;
            width: 50px;
            height: auto;
            cursor: pointer;
            border: 1px solid transparent;
          }

          .book-details .image-thumbnails img.selected {
            border: 1px solid #007bff;
          }

          .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .popup-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            width: 80%;
            max-width: 400px;
          }

          .popup-content input {
            width: 50px;
            margin-top: 10px;
          }

          .popup-content button {
            margin-top: 10px;
          }

          .book-details .btn-outline-secondary {
            margin-right: 10px;
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  thumbnail: {
    marginRight: '5px',
    width: '50px',
    height: 'auto',
    cursor: 'pointer',
    border: '1px solid transparent',
  },
};

export default BookDetails;
