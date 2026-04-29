import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { productsApi } from "../../../JS/Variables";
import "../../../CSS/ProductTabel.css"

const ProductTable = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(productsApi);
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-table-container">
      <h2 className="PHEAD">👥 List of Products</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Image</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Categories</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>₪ {product.price}</td>
                <td>
                  <Link to={`/EditProduct/${product._id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </Link>
                </td>
                <td>{product.description}</td>
                <td>{product.amount}</td>
                <td>{product.categories.join(", ")}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
