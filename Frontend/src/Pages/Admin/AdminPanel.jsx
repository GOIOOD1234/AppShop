import React, { useState,useEffect } from 'react';
import UserTable from "./User/UserTable"
import ManagerAdmin from "./ManagerAdmin";
import ProductsOutStock from "./Product/ProductsOutStock";
import State from './State';
import BarChartExample from './Graph/BarChartExample';
import ProductTable from './Product/ProductTabel';
import UserRequest from './User/UserRequest';
import CreateProduct from "../Products/CreateProduct"
import "../../CSS/AdminPanel.css"

const AdminPanel = () => {
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("charts"); 

  const flipRefresh = () => setRefresh(!refresh);


  return (
     <div className="admin-panel-container">
    {/* Sidebar */}
    <div className="admin-panel-sidebar">
      <button onClick={() => setActiveTab("charts")}>📊 Charts</button>
      <button onClick={() => setActiveTab("users")}>👥 Users</button>
      <button onClick={() => setActiveTab("admins")}>🔧 Manage Admins</button>
      <button onClick={() => setActiveTab("outOfStock")}>📦 Out of Stock</button>
      <button onClick={() => setActiveTab("State")}>⭐ State</button>
      <button onClick={() => setActiveTab("listOfProducts")}>🛒 list of products</button>
      <button onClick={() => setActiveTab("UserRequest")}>📩 list of Users Request</button>
      <button onClick={() => setActiveTab("CreateProduct")}>➕ Create Product</button>
    </div>

    {/* Dynamic Content */}
    <div className="admin-panel-content">
      <h1>Admin Panel</h1>

      {activeTab === "charts" && (
        <>
          <br />
          <br />
          <BarChartExample />
        </>
      )}

      {activeTab === "users" && (
        <>
          <UserTable refresh={refresh} flipRefresh={flipRefresh} />

        </>
      )}

      {activeTab === "admins" && <ManagerAdmin refresh={refresh} flipRefresh={flipRefresh} />}
      {activeTab === "outOfStock" && <ProductsOutStock />}
      {activeTab === "State" && <State />}
      {activeTab === "listOfProducts" && <ProductTable />}
      {activeTab === "UserRequest" && <UserRequest />}
      {activeTab === "CreateProduct" && <CreateProduct />}
    </div>
  </div>
  );
};

export default AdminPanel;
