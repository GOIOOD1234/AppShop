import { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { UserRequestApi } from "../JS/Variables";
import "../CSS/Help.css";

const Help = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
  });

  const sentRequest = async () => {
    try {
          
      if (formData.description == null || String(formData.description).trim() === '' || formData.name == null || String(formData.name).trim() === '' 
      || formData.email == null || String(formData.email).trim() === '' 
    ) {
        Swal.fire("Please Do not remain empty fields.");
          return;
         }




      const dataToSend = { ...formData };
      const response = await axios.post(UserRequestApi, dataToSend);
      if (response.data.success) {
        Swal.fire('Request sent successfully!');
      }
    } catch (error) {
      console.error('Error sending request:', error.response);
    }
  };

  return (
    <div className="help-container">
      <h2 className="help-title">Need Help?</h2>

      <label className="help-label">Enter name:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        className="help-input"
      />

      <label className="help-label">Enter email:</label>
      <input
        type="text"
        name="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        className="help-input"
      />

      <label className="help-label">Enter description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        className="help-textarea"
      />

      <button onClick={sentRequest} className="help-button">Submit</button>
    </div>
  );
};

export default Help;
