import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import emailjs from "emailjs-com";
import Swal from 'sweetalert2';
import { UserRequestApiByID } from "../../../JS/Variables";
import "../../../CSS/AnswerToUserRequest.css"; // 

const AnswerToUserRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [answer, setAnswer] = useState("");


  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(UserRequestApiByID + id);
        setRequest(response.data.data);
      } catch (error) {
        console.error("Error loading request:", error);
      }
    };
    fetchRequest();
  }, [id]);

  const deleteRequest = async () => {
    if (!request ||!answer || String(answer).trim() === '')  {
      Swal.fire("Request data is not available.");
      return;
    }

    try {
      const templateParams = {
        to_email: request.email,
        message: `Answer is:\n${answer}`,
      };

      await emailjs.send(
        'service_fil4uhg',
        'template_d6mqbzt',
        templateParams,
        '5A09uV7b71XYCJ69e'
      );

      await axios.delete(UserRequestApiByID + id);

      Swal.fire("Request deleted successfully!");
      navigate("/AdminPanel");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire('Failed to send email or delete request.');
    }
  };

  if (!request) return <div className="answer-loading">Loading...</div>;

  return (
    <div className="answer-container">
      <h2 className="answer-title">Answer to User Request</h2>
      <div className="answer-field"><strong>Name:</strong> {request.name}</div>
      <div className="answer-field"><strong>Email:</strong> {request.email}</div>
      <div className="answer-field"><strong>Description:</strong> {request.description}</div>

      <label className="answer-label" htmlFor="answer">Your Answer</label>
      <input
        type="text"
        id="answer"
        name="answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="answer-input"
        placeholder="Write your answer here..."
      />

      <button className="answer-button" onClick={deleteRequest}>Send Answer & Delete Request</button>
    </div>
  );
};

export default AnswerToUserRequest;
