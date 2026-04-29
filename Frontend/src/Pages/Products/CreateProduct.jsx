import { useState } from "react";
import axios from "axios";
import defaultImage from './Untitled.png';
import Swal from 'sweetalert2';
import { productsApi } from "../../JS/Variables";
import '../../CSS/EditProduct.css'; 

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    amount: "",
    categories: [],
  });

  const categoriesList = ["Electronics", "Clothing", "Toys", "Books", "Home", "Sports"];

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.amount || newProduct.categories.length === 0) {
      Swal.fire("Please fill in all fields and add at least one category.");
      return;
    }
    
    try {
      const productData = {
        ...newProduct,
        price: Number(newProduct.price),
        amount: Number(newProduct.amount),
      };

      await axios.post(productsApi, productData);

      setNewProduct({
        name: "",
        price: "",
        image: "",
        description: "",
        amount: "",
        categories: [],
      });

      Swal.fire("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      Swal.fire("Failed to add product.");
    }
  };

  const handleCategoryChange = (category) => {
    if (newProduct.categories.includes(category)) {
      setNewProduct({
        ...newProduct,
        categories: newProduct.categories.filter((cat) => cat !== category),
      });
    } else {
      setNewProduct({
        ...newProduct,
        categories: [...newProduct.categories, category],
      });
    }
  };

  return (
    <div className="create-product-container">
      <h1>Create New Product</h1>
      <div className="create-product-card">
        <div>
          <label>Product Name</label>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
        </div>
        <div>
          <label>Product Price</label>
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          />
        </div>
        <div>
          <label>Product Image URL</label>
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
          />
        </div>
        <div>
          <img
            className="product-textImage"
            src={newProduct.image ? newProduct.image : defaultImage}
            alt={newProduct.name}
          />
        </div>
        <div>

          <label> Product Description (Optional)</label>
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            style={{ minHeight: '150px' }}
          />
        </div>
        <div>
          <label>Product Amount</label>
          <input
            type="number"
            placeholder="Amount"
            value={newProduct.amount}
            onChange={(e) => setNewProduct({ ...newProduct, amount: e.target.value })}
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
                  checked={newProduct.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="btn-primary" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>
    </div>
  );
};

export default CreatePage;
