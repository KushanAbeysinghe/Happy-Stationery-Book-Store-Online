import React, { useState } from 'react';
import { FaSearch, FaShoppingCart, FaHome } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ totalItems, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <header className="header bg-warning" style={styles.header}>
        <div className="container d-flex align-items-center" style={styles.container}>
          <div className="logo d-flex align-items-center" style={styles.logo}>
            <img src="path/to/your/logo.png" alt="Happy Store" style={styles.logoImg} />
            <span style={styles.logoText}>Happy Store</span>
            <span style={styles.logoSubtext}>Stationery and Books</span>
          </div>
          <div className="search-bar d-flex align-items-center flex-grow-1 mx-3" style={styles.searchBar}>
            <FaHome style={styles.homeIcon} onClick={() => navigate('/')} />
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              style={styles.searchInput}
            />
            <button className="btn btn-info" style={styles.searchBtn}>
              <FaSearch />
            </button>
          </div>
          <div className="icons d-flex align-items-center" style={styles.icons}>
            <div className="icon" style={styles.icon} onClick={() => navigate('/cart')}>
              <FaShoppingCart />
              <span className="icon-count" style={styles.iconCount}>{totalItems}</span>
            </div>
          </div>
        </div>
      </header>
      <nav className="container mt-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link className="nav-link" to="/bookstore">Book Store</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/stationery">Stationery Store</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const styles = {
  header: {
    padding: '10px 0',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImg: {
    width: '40px',
    height: '40px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginLeft: '10px',
  },
  logoSubtext: {
    fontSize: '14px',
    color: '#555',
    marginLeft: '5px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '5px',
    width: '100%',
  },
  homeIcon: {
    fontSize: '24px',
    color: '#000',
    marginRight: '10px',
    cursor: 'pointer',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    padding: '5px 10px',
  },
  searchBtn: {
    border: 'none',
    borderRadius: '50%',
    padding: '5px 10px',
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'relative',
    fontSize: '24px',
    marginLeft: '20px',
    cursor: 'pointer',
  },
  iconCount: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
  },
};

export default Header;
