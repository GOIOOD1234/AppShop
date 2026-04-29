import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { userApi,productsApi } from '../../../JS/Variables';

const BarChartExample = () => {
  const [salesData, setSalesData] = useState([]);

  const fetchSalesData = async () => {
    try {
      const usersResponse = await axios.get(userApi);
      const users = usersResponse.data.data;

      const productsResponse = await axios.get(productsApi);
      const products = productsResponse.data.data;

      const productNames = {};
      products.forEach(product => {
        productNames[product._id] = product.name;
      });

      const productSales = {};

      users.forEach(user => {
        user.productsBought.forEach(product => {
          const { product_id, amount } = product;
          if (productNames[product_id]) {
            if (productSales[product_id]) {
              productSales[product_id] += amount;
            } else {
              productSales[product_id] = amount;
            }
          }
        });
      });

      const data = Object.keys(productSales).map(productId => ({
        name: productNames[productId] || `Product ${productId}`,
        sales: productSales[productId],
      }));

      setSalesData(data);
    } catch (error) {
      console.log('Error fetching sales data:', error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Sales by product</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartExample;
