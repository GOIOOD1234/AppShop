import React from 'react';
import { Link } from 'react-router-dom';
import defaultImage from './Untitled.png';
import '../../CSS/ProductCard.css';

const ProductCard = ({ product, currentUser, handleDeleteProduct, handleAddToCart, handleRemoveFromCart, shoppingCart }) => {
  return (
    <div className="custom-product-card">
      <Link to={`/ShowProduct/${product._id}`}>
        <img
          className="product-thumbnail"
          src={product.image || defaultImage}
          alt={product.name}
        />
      </Link>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">
          {product.description.split(" ").slice(0, 20).join(" ") +
            (product.description.split(" ").length > 20 ? "..." : "")}
        </p>
        <div className="product-price">
          <span className="price">₪{product.price}</span>
          <br />
          {product.amount > 0 ? (
            <span className="price">amount: {product.amount}</span>
          ) : (
            <span className="out-of-stock">was out of stock</span>
          )}
        </div>
        <div className="product-buttons">
          {currentUser ? (
  <div>
    {/*  !currentUser.admin && אדמין לא יכול לראות*/}
    {product.amount > 0 && (
      <>
        <button onClick={() => handleAddToCart(product)}>➕ Add to Cart</button>
        <button onClick={() => handleRemoveFromCart(product._id)}>➖ Remove from cart</button>
        <span>
          Amount in the shopping cart:{" "}
          {shoppingCart.find(item => item.id === product._id)?.quantity || 0}
        </span>
        <br/>
      </>
    )}

    {currentUser.admin && (
      <>
        <Link to={`/EditProduct/${product._id}`}>
          <button className="edit-btn">Edit</button>
        </Link>
        <button
          className="delete-btn"
          onClick={() => handleDeleteProduct(product._id)}
      
        >
          Delete
        </button>
      </>
    )}
  </div>
) : (
  <div>
    <br />
    <Link to={'/SignUp/'}>Sign up to purchase</Link>
    <br />
    <Link to={'/Login/'}>Login to purchase</Link>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default ProductCard;
