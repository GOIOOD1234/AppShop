import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import HistoryofUser from "./HistoryofUser";
import { findByEmailApi } from "../../../JS/Variables";
import '../../../CSS/DataUsers.css';

const DataUsers = () => {
  const [searchEmail, setSearchEmail] = useState(""); 
  const [emailToHistory, setEmailToHistory] = useState(null); 

  const getID = async () => {
    try {
      const response = await axios.get(`${findByEmailApi}${searchEmail}`);
      if (response.data.success) {
        setEmailToHistory(response.data.data); 
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

  return (
    <div className="data-users-container">
      <h3 className="data-users-title">Search Purchase History</h3>
      <div className="data-users-search-box">
        <input 
          type="email" 
          value={searchEmail} 
          onChange={(e) => setSearchEmail(e.target.value)} 
          placeholder="Enter user email to search" 
          className="data-users-input"
        />
        <button onClick={getID} className="data-users-button">Search</button>
      </div>

      {emailToHistory && <HistoryofUser id={emailToHistory._id} />}
    </div>
  );
};

export default DataUsers;
