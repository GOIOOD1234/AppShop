import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { userByID, productsApi } from "../../../JS/Variables";
import "../../../CSS/HistoryofUser.css"



const HistoryofUser = ({ id }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!id) {
      Swal.fire("Email not found");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse = await axios.get(`${userByID}${id}`);
        if (!userResponse.data.success) {
          setError('User not found.');
          setLoading(false);
          return;
        }

        const user = userResponse.data.data;
        setCurrentUser(user);

        const productIds = (user.productsBought || [])
          .map(item => item.product_id)
          .filter(Boolean);

        if (productIds.length === 0) {
          setError('No products found in your purchase history.');
          setLoading(false);
          return;
        }

        const productResponse = await axios.get(productsApi, {
          params: { ids: productIds.join(',') }
        });

        if (!productResponse.data.success) {
          setError('Failed to fetch purchased products.');
          setLoading(false);
          return;
        }

        const matchingProducts = productResponse.data.data
          .filter(product => productIds.includes(product._id.toString()));

        setProducts(matchingProducts);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to fetch purchase history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);


 

  return (
    <div className="history-container">
      <h2 className="history-title">Your Purchase History</h2>

      {loading ? (
        <p className="history-loading">Loading...</p>
      ) : error ? (
        <p className="history-error">{error}</p>
      ) : products.length > 0 ? (
        <div className="history-products">
          {products.map(product => {
            const productInHistory = currentUser?.productsBought.find(
              item => item.product_id?.toString() === product._id.toString()
            );

            return (
              <div key={product._id} className="history-product-card">
                <img src={product.image} alt={product.name} className="history-product-img" />
                <div>
                  <h3 className="history-product-name">{product.name}</h3>
                  <p className="history-product-desc">{product.description}</p>
                  <p className="history-product-price">Price: ₪{product.price}</p>
                  <p className="history-product-quantity">Quantity: {productInHistory?.amount ?? 'N/A'}</p>

                  {productInHistory?.date?.length > 0 && (
                    <div>
                      <span className="history-product-dates-label">Purchase Dates:</span>
                      <select className="history-product-dates-select">
                        {productInHistory.date.slice().reverse().map((d, i) => (
                          <option key={i}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
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

export default HistoryofUser;
