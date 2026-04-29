import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import defaultImage from './Untitled.png';
import axios from 'axios';
import { productsApiByID } from '../../JS/Variables';
import '../../CSS/EditProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productOriginal, setProductOriginal] = useState(null);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    amount: '',
    categories: [],
  });

  const categoriesList = ["Electronics", "Clothing", "Toys", "Books", "Home", "Sports"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let api = productsApiByID + id;
        const response = await axios.get(api);
        const fetchedProduct = {
          ...response.data,
          categories: response.data.categories || [],
          price: response.data.price || '',
          amount: response.data.amount || '',
        };
        setProduct(fetchedProduct);
        setProductOriginal(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value === "" ? "" : value
    }));
  };

  const handleCategoryChange = (category) => {
    if (product.categories.includes(category)) {
      setProduct({
        ...product,
        categories: product.categories.filter((cat) => cat !== category),
      });
    } else {
      setProduct({
        ...product,
        categories: [...product.categories, category],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...product,
        price: product.price !== '' ? Number(product.price) : undefined,
        amount: product.amount !== '' ? Number(product.amount) : undefined,
      };
      let api = productsApiByID + id;

      await axios.put(api, productData);
      navigate('/');
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="edit-product-container">
      <h1>Edit Product</h1>
      <form className="edit-product-card" onSubmit={handleSubmit}>
        <div>
          <label>Product Name</label>
          <input
            type="text"
            name="name"
            value={product.name || (productOriginal ? productOriginal.name : '')}
            onChange={handleInputChange}
            placeholder="Product Name"
          />
        </div>
        <div>
          <label>Product Price</label>
          <input
            type="number"
            name="price"
            min={0}
            value={product.price || (productOriginal ? productOriginal.price : '')}
            onChange={handleInputChange}
            placeholder="Price"
          />
        </div>
        <div>
          <label>Product Image URL</label>
          <input
            type="text"
            name="image"
            value={product.image || (productOriginal ? productOriginal.image : '')}
            onChange={handleInputChange}
            placeholder="Image URL"
          />
        </div>
        <div>
          <img
            className="product-textImage"
            src={product.image || (productOriginal ? productOriginal.image : defaultImage)}
            alt={product.name}
          />
        </div>
        <div>          
          
          <label> Product Description (Optional)</label>
          <textarea
            name="description"
            value={product.description || (productOriginal ? productOriginal.description : '')}
            onChange={handleInputChange}
            placeholder="Description"
            style={{ minHeight: '150px' }}
          />
        </div>
        <div>
          <label>Product Amount</label>
          <input
            type="number"
            name="amount"
            min={0}
            value={product.amount || (productOriginal ? productOriginal.amount : '')}
            onChange={handleInputChange}
            placeholder="Amount"
          />
        </div>
        <div>
          <h5>Categories</h5>
          <div className="product-container">
            {categoriesList.map((category, index) => (
              <label key={index} className="product-card" htmlFor={`category-${category}`}>
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={product.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="btn-primary" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
