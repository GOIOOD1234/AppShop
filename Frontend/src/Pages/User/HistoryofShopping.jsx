import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { productsApi } from '../../JS/Variables';
import "../../CSS/HistoryofShopping.css"

const HistoryofShopping = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('currentUser')); 

  //
    //מביא כמה מוצרים יש לי
    const countP = ()=>{
      if (!currentUser || !currentUser.productsBought) return 0;
          let sum = 0;
        for(const i of currentUser.productsBought){
            sum+=i.amount
          }
          return sum
    }

  useEffect(() => {
    if (!currentUser) {
      setError('You must be logged in to view your purchase history.');
      setLoading(false);
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const productIds = currentUser.productsBought.map(item => item.product_id); 
        if (productIds.length > 0) {
          const response = await axios.get(productsApi, {
            params: { ids: productIds.join(',') }
          });

          const purchasedProducts = response.data.data.filter(product =>
            currentUser.productsBought.some(item => item.product_id.toString() === product._id.toString())
          );
          
          let sum = 0;
          
          setProducts(purchasedProducts); 
         
        } else {
          setError('No products found in your purchase history.');
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to fetch purchase history. Please try again later.');
      } finally {
        setLoading(false); 
      }
    };

    fetchProductDetails();
  }, [currentUser]);

  if (loading) {
    return <div className="history-loading">Loading...</div>;
  }

  if (error) {
    return <div className="history-error">{error}</div>;
  }

  


  return (
    <div className="history-container">
      <h2 className="history-title">Your Purchase History</h2>
         <h3 className="history-product-name">count of product {countP()}</h3>
      
      {products.length > 0 ? (
        <div className="history-products">
          {products.map(product => {
            const productInHistory = currentUser.productsBought.find(item => item.product_id.toString() === product._id.toString());
            return (
              <div key={product._id} className="history-product-card">
                <h3 className="history-product-name">{product.name}</h3>
                <img src={product.image} alt={product.name} className="history-product-img" />
                <p className="history-product-desc">{product.description}</p>
                <p className="history-product-price">Price: ₪{product.price}</p>
                <p className="history-product-quantity">Quantity: {productInHistory ? productInHistory.amount : 'N/A'}</p>
                <label className="history-product-dates-label">Purchase Dates:</label>
                <select className="history-product-dates-select">
                  {productInHistory?.date?.slice().reverse().map((d, i) => (
                    <option key={i}>{d}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="history-no-products">No purchases found.</p>
      )}
    </div>
  );
};

export default HistoryofShopping;
