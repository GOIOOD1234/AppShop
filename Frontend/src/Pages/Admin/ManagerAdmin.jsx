import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { userApi,productsApi,findByEmailApi,adminDeleteAdminByID,adminAddAdminAdminByID} from '../../JS/Variables';
import "../../CSS/ManagerAdmin.css"

const ManagerAdmin = ({ refresh, flipRefresh }) => {
  const [users, setUsers] = useState([]);
  const [listsAdmin,setlistsAdmin] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(userApi);
        setUsers(response.data.data);
       const admins = response.data.data.filter((user) => user.admin);
        
       setlistsAdmin(admins);
      } catch (error) {
        console.error("error in log users", error);
      }
    };
    fetchUsers();
  }, [refresh]);

  const handleRemoveAdmin = async () => {
    try {
      const user = await axios.get(findByEmailApi+email);
      if (user.data.success) {
        const userId = user.data.data._id;
        await axios.post(adminDeleteAdminByID+userId);
        setMessage(`User with email ${email} is no longer an admin.`);
        setUsers(users.map(user => 
          user.email === email ? { ...user, admin: false } : user
        ));
      } else {
        setMessage("User not found.");
      }
    } catch (error) {
      setMessage("Error removing admin.");
      console.error(error.message);
    }
    flipRefresh();
  };

  const handleAddAdmin = async () => {
    try {
      const user = await axios.get(findByEmailApi+email);
      if (user.data.success) {
        const userId = user.data.data._id;
        await axios.post(adminAddAdminAdminByID+userId);
        setMessage(`User with email ${email} is now an admin.`);
        setUsers(users.map(user => 
          user.email === email ? { ...user, admin: true } : user
        ));
      } else {
        setMessage("User not found.");
      }
    } catch (error) {
      setMessage("Error adding admin.");
      console.error(error.message);
    }
    flipRefresh();
  };

  return (
   <div className="manager-admin-container">
  <div className="manager-admin-controls">
    <p className="manager-admin-header">Email to Add/Remove Admin</p>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter user email"
      className="manager-admin-input"
    />
    <div className="manager-admin-buttons">
      <button onClick={handleAddAdmin} className="add-btn">Add Admin</button>
      <button onClick={handleRemoveAdmin} className="remove-btn">Remove Admin</button>
    </div>
  </div>

  <div className="manager-admin-table-container">
    <label className="manager-admin-table-title">Table Admins</label>
    <table className="manager-admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {listsAdmin.length > 0 ? (
          listsAdmin.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" style={{ textAlign: "center" }}>
              No admins found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

  );
}

export default ManagerAdmin;
