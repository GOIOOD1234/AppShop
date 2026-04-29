import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {UserRequestApi} from "../../../JS/Variables"
import "../../../CSS/UserRequest.css"


const UserRequest = () => {
    const [allRequest,setAllRequest] = useState([])
    

    useEffect(() => {
        const fetchRequest = async () => {
          try {
            const response = await axios.get(UserRequestApi);
            setAllRequest(response.data.data)

          } catch (error) {
            console.error("Error loading users", error);
          }
        };
        fetchRequest()
      }, []);


    return (
        <div className="user-request-container">
      <h2 className="user-request-heading">User Requests</h2>
      <div className="user-request-table-wrapper">
        <table className="user-request-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Description</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allRequest.map((request) => (
              <tr key={request._id}>
                <td>{request.name}</td>
                <td>{request.email}</td>
                <td>{request.description}</td>
                <td>{new Date(request.createdAt).toLocaleString()}</td>
                <td>
                  <Link to={`/AnswerToUserRequest/${request._id}`} className="user-request-link">
                    Answer to request
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserRequest
