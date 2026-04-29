import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { productsApiByID } from '../../JS/Variables';
import "../../CSS/ShowProduct.css"

const ShowProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

    const moveToApp= () =>{
        navigate("/");
    }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let api = productsApiByID + id
        const response = await axios.get(api);
        setProduct(response.data.data);  
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
   <div className="show-product-container">
  <img className="show-product-image" src={product.image} alt={product.name} onClick={moveToApp} />
  <div className="show-product-info">
    <h3 className="show-product-name">{product.name}</h3>
    <p className="show-product-description">{product.description}</p>
    <div className="show-product-price">
      <span>₪{product.price}</span>
      <br />
      <span>Amount: {product.amount}</span>
    </div>
    <p className="show-product-categories-title">Categories:</p>
    <ul className="show-product-categories-list">
      {product.categories.map((category, index) => (
        <li key={index}>{category}</li>
      ))}
    </ul>
  </div>
</div>

  );
};

export default ShowProduct;
