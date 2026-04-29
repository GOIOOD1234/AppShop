import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {userApi} from "../../../JS/Variables"
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import HistoryofUser from "./HistoryofUser";
import { findByEmailApi } from "../../../JS/Variables";
import "../../../CSS/UserTable.css"


const UserTable = ({ refresh, flipRefresh }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isAdminFiltered, setIsAdminFiltered] = useState(false); 
  const [state, setState] = useState("");  
  const [emailToHistory, setEmailToHistory] = useState(null); 
  const [SearchHistory, setSearchHistory] = useState(false); 


    const getID = async (searchEmail) => {
    try {
      const response = await axios.get(`${findByEmailApi}${searchEmail}`);
      if (response.data.success) {
        setEmailToHistory(response.data.data); 
        setSearchHistory(true);
      } else {
        setEmailToHistory(null); 
        Swal.fire("User not found");
      }
    } catch (error) {
      setEmailToHistory(null);
      Swal.fire("Error retrieving user history");
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(userApi);
        setUsers(response.data.data);
        setFilteredUsers(response.data.data); 
      } catch (error) {
        console.error("Error loading users", error);
      }
    };
    fetchUsers();
  }, [refresh]);

  const sortUsers = (field, order = 'desc') => {
    const sortedUsers = [...filteredUsers]; 

    if (field === 'total') {
      if (order === 'desc') {
        sortedUsers.sort((a, b) => b.total - a.total); 
        setState("down");
      } else {
        sortedUsers.sort((a, b) => a.total - b.total); 
        setState("up");
      }
    }

    setFilteredUsers(sortedUsers); 
  };

  const filterAdmins = () => {
    const newIsAdminFiltered = !isAdminFiltered;
    setIsAdminFiltered(newIsAdminFiltered);
    
    if (newIsAdminFiltered) {
      const adminUsers = users.filter(user => user.admin);
      setFilteredUsers(adminUsers);
    } else {
      setFilteredUsers(users);
    }
  };



  return (
     <div>
    <div className="user-table-buttons">
      <button onClick={() => sortUsers('total', 'desc')}>Sort by Total max</button>
      <button onClick={() => sortUsers('total', 'asc')}>Sort by Total min</button>
      <button onClick={filterAdmins}>
        {isAdminFiltered ? 'Show All Users' : 'Show Only Admins'}
      </button>
    </div>

    <h2 className="user-table-heading">👥 List of Users</h2>

    <table className="user-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Address</th>
          <th>Admin</th>
          <th>Total Purchase Price</th>
        </tr>
      </thead>
      <tbody>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <tr key={user._id}>
              <td>
                {user.name}
                {user.total === 0 ? " w(ﾟДﾟ)w" : null}
                {state === 'down' && index === 0 ? "👑" : null}
              </td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.admin ? "✅ Yes" : "❌ No"}</td>
              <td>₪ {user.total}</td>
          <td>
  <button onClick={() => getID(user.email)} className="data-users-button">
    Search History
  </button>
</td>

            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="user-table-empty">No users found</td>
          </tr>
        )}
      </tbody>
    </table>

    {SearchHistory && emailToHistory && <HistoryofUser id={emailToHistory._id} />}

  </div>
  );
};

export default UserTable;
