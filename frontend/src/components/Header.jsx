import React from 'react';
import { FaSearch, FaShoppingCart, FaHome } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../components/Logo.png'; // Adjust the path as necessary

const Header = ({ totalItems, searchTerm, setSearchTerm, currentPath }) => {
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const hideCartIcon = currentPath === '/checkout' || currentPath === '/cart';

  return (
    <div>
      <header className="header" style={styles.header}>
        <div className="container d-flex align-items-center" style={styles.container}>
          <div className="logo d-flex align-items-center mx-auto" style={styles.logo}>
            <img src={logo} alt="Happy Store" style={styles.logoImg} />
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
            {!hideCartIcon && (
              <div className="icon cart-icon" style={styles.icon} onClick={() => navigate('/cart')}>
                <FaShoppingCart />
                <span className="icon-count" style={styles.iconCount}>{totalItems}</span>
              </div>
            )}
          </div>
        </div>
      </header>
      <nav className="container mt-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link className="nav-link" to="/">Book Store</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/stationery">Stationery Store</Link>
          </li>
        </ul>
      </nav>
      <style>
        {`
          @media (max-width: 991px) {
            .header .container {
              flex-direction: column;
            }
            .header .logo {
              margin-bottom: 10px;
            }
            .header .icons {
              position: fixed;
              bottom: 10px;
              right: 10px;
              background: yellow;
              border-radius: 50%;
              padding: 10px;
              z-index: 1000; /* Ensure the cart icon is above other elements */
            }
          }
          .icon-count {
            top: -10px !important; /* Adjust to ensure the count is visible */
            right: -10px !important; /* Adjust to ensure the count is visible */
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  header: {
    padding: '10px 0',
    backgroundColor: '#FFDE59',
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
    width: 'auto',
    height: '60px',
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
