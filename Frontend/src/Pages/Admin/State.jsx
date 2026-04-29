import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { userApi,productsApi} from '../../JS/Variables';
import '../../CSS/State.css'; 

const State = () => {
    const [products, setProducts] = useState([]);
    const [sumOfAllSales, setSumOfAllSales] = useState(0);
    const [users, setUsers] = useState([]);
    const [userBuyMex, setUserBuyMex] = useState(null);
    


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(productsApi);
                setProducts(response.data.data);
            } catch (error) {
                console.log("Error fetching products:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get(userApi);
                const usersData = response.data.data;
                setUsers(usersData); 
                let sum = 0;
                let maxUser = null;
                let maxTotal = 0;

                usersData.forEach(user => {
                    sum += user.total;
                    if (user.total > maxTotal) {
                        maxTotal = user.total;
                        maxUser = user;
                    }
                });

                setSumOfAllSales(sum);
                setUserBuyMex(maxUser);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
        fetchProducts();
    }, []);

    return (
       <div className="statepage-container">
    <div className="statepage-total-sales">
      <p><strong>Total Sales:</strong> {sumOfAllSales}</p>
    </div>

    <div>
      <p>count of users: {users.length}</p>
    </div>
    <div>
      <p>count of products: {products.length}</p>
    </div>

    {userBuyMex ? (
      <div className="statepage-top-buyer">
        <h3>Top Buyer</h3>
        <p><strong>Name:</strong> {userBuyMex.name}</p>
        <p><strong>Email:</strong> {userBuyMex.email}</p>
        <p><strong>Total Spent:</strong> {userBuyMex.total}</p>
      </div>
    ) : (
      <p>No user data available.</p>
    )}
  </div>
    );
};

export default State;
