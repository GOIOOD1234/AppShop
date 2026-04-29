import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { productsApi } from "../../../JS/Variables";
import "../../../CSS/ProductsOutStock.css"

const ProductsOutStock = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(productsApi);
        const outOfStock = response.data.data.filter(
          (product) => product.amount <= 0
        );
        setProducts(outOfStock);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-outstock-container">
      <h3 className="PHEAD">These products are out of stock:</h3>
      {products.length > 0 ? (
        <ul className="product-list">
          {products.map((product) => (
            <li key={product._id} className="product-item">
              <span className="product-name">{product.name}</span>
              <Link to={`/EditProduct/${product._id}`}>
                <button className="edit-btn">Edit</button>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-products-message">No products are out of stock.</p>
      )}
    </div>
  );
};

export default ProductsOutStock;
