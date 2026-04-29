import React, { useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { IsPasswordStrength } from '../JS/Functions.js';
import { userApi } from '../JS/Variables.js';
import "../CSS/SingUp.css"

const SingUp = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    creditCard: '',
    password: '',
    address: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const [PasswordStrength,setPasswordstrength] = useState("")
  const navigate = useNavigate();

  const FlilpShowPassword= () => {
    setShowPassword((prev) => !prev);
  };

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "creditCard" ) {
      if (!/^\d+$/.test(value)) {
        // Swal.fire("A credit card must contain only digits!");
        return;
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  
    IsPasswordStrength(formData.password,setPasswordstrength)

  };

  const sendVerificationCode = () => {

      if (formData.address == null || String(formData.address).trim() === '' || formData.name == null || String(formData.name).trim() === '' ||
    formData.password == null || String(formData.password).trim() === '' ) {
              Swal.fire("Please Do not remain empty fields.");
               return;
          }
    if(formData.creditCard.length !=16){
       Swal.fire('your creditCard is not creditCard 16 ')
       return
    } 
    if(IsPasswordStrength(formData.password,setPasswordstrength)){
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      const templateParams = {
        
        to_email: formData.email,
        message: `Your verification code is: ${code}`,
      };
      
  
      emailjs.send(
        'service_fil4uhg', 
        'template_d6mqbzt', 
        templateParams,
        '5A09uV7b71XYCJ69e' 
      )
      .then(() => {
        setIsCodeSent(true);
        Swal.fire('Verification code sent to your email.');
      })
      .catch((error) => {
        console.log('Error sending verification email:', error);
         Swal.fire('Error sending verification email:', error);
      });
      console.log("code " + code);
    }else{
      Swal.fire('Your password is weak!!!!!')
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputCode !== verificationCode) {
      Swal.fire('Incorrect verification code. Please try again.');
      return;
    }
    
    try {
      if(IsPasswordStrength(formData.password,setPasswordstrength)){
        const dataToSend = { 
          ...formData, 
          creditCard: Number(formData.creditCard),
        };
        const response = await axios.post(userApi, dataToSend);
        if (response.data.success) {
          localStorage.setItem('currentUser', JSON.stringify(response.data.data));
          onLogin(response.data.data);
          navigate('/');
        }
      }else{
        Swal.fire('Your password is weak!!!!!')
      }
    
    } catch (error) {
      Swal.fire('Error registering user:' +error.message)
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

        <label>name</label>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <label>email</label>

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />

        
        <label>creditCard {formData.creditCard.length}</label>
        <input type="text" name="creditCard" placeholder="Credit Card" maxLength={16} value={formData.creditCard} onChange={handleChange} required />
        
        <label>password</label>
        <div className="password-field-container">
          <input
          type={showPassword ? "text" : "password"} 
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
             required
          />
          <button type="button" onClick={FlilpShowPassword}>
           {showPassword ? "👁️" : "🙈"} 
           </button>
         </div>
        <label>{PasswordStrength}</label>


        <br></br>
        <label>address</label>
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
        {!isCodeSent ? (
          <button type="button" onClick={sendVerificationCode}>Send Verification Code</button>
        ) : (
          <>
            <label>Verification Code</label>
            <input type="text" placeholder="Enter Verification Code" value={inputCode} onChange={(e) => setInputCode(e.target.value)} required />
            <button type="submit">Verify & Sign Up</button>
          </>
        )}
      </form>
    </div>
  );
};


export default SingUp
