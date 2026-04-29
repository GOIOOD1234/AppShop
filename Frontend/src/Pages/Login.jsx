import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emailjs from "emailjs-com";
import Swal from 'sweetalert2';
import { IsPasswordStrength } from '../JS/Functions.js';
import { loginApi,findByEmailApi,Resume_PasswordApi } from '../JS/Variables.js';
import "../CSS/Login.css"


const Login = ({ onLogin }) => {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [PasswordStrength,setPasswordstrength] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    if (forgotPassword) {
      SendEmail();
    }
  }, [forgotPassword]);

  const setNewPasswordInput = (e) =>{
    setNewPassword(e.target.value)
    IsPasswordStrength(newPassword, setPasswordstrength)
  }

  const FlilpShowPassword= () => {
    setShowPassword((prev) => !prev);
  };

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
   

  };

  const ResumePassword = () => {
    console.log(formData.email)
    if (!formData.email) {
      Swal.fire("Please enter your email first.");
      return;
    }
    setForgotPassword(true);
  };

  const SendEmail = async () => {
      const code = Math.floor(1000000 + Math.random() * 9000000).toString();
      setVerificationCode(code);
      console.log(verificationCode)
      console.log(code)

      
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
        Swal.fire("Verification code has been sent to your email.");
      })
      .catch((error) => {
        console.log('Error sending verification email:', error);
        Swal.fire("Failed to send email.");
      });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(loginApi, formData);
      if (response.data.success) {
        localStorage.setItem("currentUser", JSON.stringify(response.data.data));
        onLogin(response.data.data);
        navigate('/');
      } else {
        Swal.fire(response.data.message);
      }
    } catch (error) {
      Swal.fire("Your user was not found");
    }
  };

  const verifyCode = async () => {


    if (!formData.email) {
      Swal.fire("Please enter your email address.");
      return;
    }

    if(!IsPasswordStrength(newPassword, setPasswordstrength)){
      Swal.fire('Your password is weak!!!!!')
      return
    }


    if (inputCode === verificationCode) {
      Swal.fire("Code verified successfully!");
      
      if (!formData.email) {
        Swal.fire("Please enter your email before verifying the code.");
        return;
      }
  
      const user = await axios.get(findByEmailApi+formData.email);
      if (user.data.success) {
        const userId = user.data.data._id;
        await axios.post(Resume_PasswordApi+userId, { password: newPassword });
        Swal.fire("Password has been updated successfully.");
        setFormData({
          ...formData,
          password: newPassword,  
        });
        setForgotPassword(false)  
      } else {
        Swal.fire("User not found.");

      }
    } else {
      Swal.fire("Invalid code. Please try again.");
      console.log(verificationCode)
    }
  };


  
  return (
   <div className="login-container">
  <h2 className="login-title">Login</h2>

  <label className="login-label">Email</label>
  <input 
    type="email" 
    placeholder="Email" 
    value={formData.email} 
    onChange={handleChange}
    name="email"
    className="login-input"
  />
  
  <label className="login-label">Password</label>
  <input 
    type="password" 
    placeholder="Password" 
    value={formData.password} 
    onChange={handleChange}
    name="password"
    className="login-input"
  />

  <button onClick={handleSubmit} className="login-button">Login</button>

  <p>
    <button onClick={ResumePassword} className="forgot-password-button">I forgot my password</button>
  </p>

  {forgotPassword && (
    <>
      <label className="login-label">Enter Code:</label>
      <input
        type="text"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
        className="login-input"
      />
      <label className="login-label">Enter new password:</label>
      <input
        type={showPassword ? "text" : "password"} 
        value={newPassword}
        onChange={(e) => setNewPasswordInput(e)}
        className="login-input"
      />
      <label className="password-strength">{PasswordStrength}</label>
      <button type="button" onClick={FlilpShowPassword} className="toggle-password-button">
        {showPassword ? "👁️" : "🙈"} 
      </button>
      <button onClick={verifyCode} className="login-button">Verify Code</button>
    </>
  )}
</div>

  );
};

export default Login;
