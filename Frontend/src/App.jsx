import React, { useState, useEffect } from "react";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import CreateProduct from "./Pages/Products/CreateProduct";
import HomPage from "./Pages/HomPage";
import EditProduct from "./Pages/Products/EditProduct";
import SingUp from "./Pages/SingUp";
import Login from "./Pages/Login";
import HistoryofShopping from "./Pages/User/HistoryofShopping";
import EditUser from "./Pages/User/EditUser";
import ShowProduct from "./Pages/Products/showProduct";
import AnswerToUserRequest from "./Pages/Admin/User/AnswerToUserRequest";
import Help from "./Pages/Help";
import AdminPanel from "./Pages/Admin/AdminPanel";
import FakeAdmin from "./Pages/FakeA/FakeAdmin";
import "./CSS/App.css"

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigate('/');  
    window.location.reload(); 
  };

  return (
    <div>
      

     <div>
      <nav className="nav">
      <button
  className={`toggle-btn2 ${darkMode ? 'dark-mode' : ''}`}
  onClick={() => setDarkMode(prev => !prev)}>
  {darkMode ? 'Light' : 'Dark'} 
</button>
        <Link to="/">Home</Link>
        <Link to="/Help">Help</Link>

        {/* {currentUser && !currentUser.admin && (
          <>
            <Link to={`/HistoryofShopping/${currentUser._id}`}>History of Shopping</Link>
          </>
        )} */}
        {currentUser && currentUser.admin && (
          <>
            <Link to="/CreateProduct">Create Product</Link>
            <Link to="/AdminPanel">Admin Panel</Link>

          </>

        )}
        {currentUser ? (
          <>
            <Link to={`/HistoryofShopping/${currentUser._id}`}>History of Shopping</Link>
            <Link to={`/EditUser/${currentUser._id}`}>Edit User</Link>
            <span className="email-display">{currentUser.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/SignUp">SignUp</Link>
            <Link to="/Login">Login</Link>
          </>
        )}
      </nav>
    </div>

      <Routes>
        <Route path="/" element={<HomPage />} />
        {currentUser && currentUser.admin ? (
          <>
           <Route path="/AdminPanel" element={<AdminPanel />} />
           <Route path="/CreateProduct" element={<CreateProduct />} />
          </>
        

        ) : (
          <>
            <Route path="/AdminPanel" element={<FakeAdmin/>} />
            <Route path="/CreateProduct" element={<FakeAdmin/>} />
          </>
        )}
      
        <Route path="/HistoryofShopping/:id" element={<HistoryofShopping />} />
        <Route path="/EditUser/:id" element={<EditUser onLogin={handleLogin} />} />
        <Route path="/SignUp" element={<SingUp onLogin={handleLogin} />} />
        <Route path="/Login" element={<Login onLogin={handleLogin} />} />
        <Route path="/EditProduct/:id" element={<EditProduct />} />
        <Route path="/ShowProduct/:id" element={<ShowProduct />} />
        <Route path = "/AnswerToUserRequest/:id" element={<AnswerToUserRequest/>}/>
        <Route path = "/Help" element={<Help/>}/>
        <Route path="*" element={<HomPage />} />

      </Routes>
    </div>
  );
};

export default App;
