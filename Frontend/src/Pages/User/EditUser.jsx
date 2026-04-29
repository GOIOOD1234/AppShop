import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import emailjs from "emailjs-com";
import Swal from 'sweetalert2';
import { IsPasswordStrength } from "../../JS/Functions";
import { userByID } from "../../JS/Variables";
import "../../CSS/EditUser.css"


const EditUser = ({ onLogin }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", address: "", creditCard: "", password: "" });
    const [verificationCode, setVerificationCode] = useState("");
    const [copyEmail, setCopyEmail] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [pendingEmail, setPendingEmail] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(true);
    const [PasswordStrength, setPasswordstrength] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [update,setUpdate] = useState(false)

    const FlilpShowPassword = () => {
        setShowPassword((prev) => !prev);
    };



    useEffect(() => {
        axios.get(userByID + id)
            .then((res) => {
                if (res.data.success) {
                    const data = res.data.data;

                // שמור את כל השדות כמו שהם, אבל הכרטיס יהפוך למחרוזת
                setFormData({
                    ...data,
                    creditCard: data.creditCard ? String(data.creditCard) : ""
                });

                    setCopyEmail(res.data.data.email);
                    
                }
            })
            .catch(error => console.error("Error fetching user data:", error));
    }, [id]);




    const sendVerificationCode = () => {
        const code = Math.floor(1000000 + Math.random() * 9000000).toString();
        setVerificationCode(code);
        setIsCodeSent(true);
        const templateParams = {
            to_email: pendingEmail,
            message: `Your verification code is: ${code}`,
        };
        emailjs.send(
            'service_fil4uhg',
            'template_d6mqbzt',
            templateParams,
            '5A09uV7b71XYCJ69e'
        ).catch((error) => {
            console.error('Error sending verification email:', error);
        });
    };

    const handleChange = (field, value) => {
        if (field === "email") {
            setPendingEmail(value);
            setIsCodeSent(false);
            setIsEmailVerified(false);

        } else {
              if (field === "creditCard" ) {
                  if (!/^\d+$/.test(value)) {
                    // Swal.fire("A credit card must contain only digits!");
                    return;
                  }
                }
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        if (field === "password") {
            IsPasswordStrength(value, setPasswordstrength);
        }
        setUpdate(true)
    };

    const verifyAndUpdateEmail = async () => {
        if (inputCode !== verificationCode) {
            Swal.fire("Incorrect verification code");
            return;
        }
    
        setFormData(prev => ({ ...prev, email: pendingEmail }));
        setIsEmailVerified(true);
        setIsCodeSent(false);
    
        Swal.fire("Email verified! Click Update Details to save.");
    
        try {
            await axios.post(userByID + id, {
                ...formData,
                email: pendingEmail
            });
    
            const response = await axios.get(userByID + id);
            if (response.data.success) {
                localStorage.setItem('currentUser', JSON.stringify(response.data.data));
                onLogin(response.data.data);
                navigate("/");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleSubmit = async () => {

         if (formData.address == null || String(formData.address).trim() === '' || formData.name == null || String(formData.name).trim() === '' ) {
           Swal.fire("Please Do not remain empty fields.");
            return;
        }
        if(update == false){
            Swal.fire('you not update any details!!!!!');
            navigate("/");
            return
        }
        if (!IsPasswordStrength(formData.password, setPasswordstrength)) {
            Swal.fire('Your password is weak!!!!!');
            return;
        }
        if(formData.creditCard.length !=16){
            Swal.fire('Your creditCard not right');
            console.log(formData.creditCard.length)
            return;

        }

        if (pendingEmail && pendingEmail !== formData.email && !isEmailVerified) {
            Swal.fire("Please verify your email before updating.");
            return;
        }

       
        
        if (pendingEmail && pendingEmail !== formData.email && isEmailVerified) {
            formData.email = pendingEmail;
        }


        try {
            await axios.post(userByID + id, formData);
            const response = await axios.get(userByID + id);
            if (response.data.success) {
                localStorage.setItem('currentUser', JSON.stringify(response.data.data));
                Swal.fire('The details were successfully updated!!!!!');
                onLogin(response.data.data);
                navigate("/");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
       <div className="edit-user-container">
  <h2 className="edit-user-title">Edit User</h2>

  <label className="edit-user-label">Name:</label>
  <input className="edit-user-input" type="text" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />

  <label className="edit-user-label">Email:</label>
  <input className="edit-user-input" type="email" value={pendingEmail || formData.email} onChange={(e) => handleChange("email", e.target.value)} />

  {pendingEmail !== formData.email && !isCodeSent && (
    <button className="edit-user-button" onClick={sendVerificationCode}>Send Verification Code</button>
  )}

  {isCodeSent && (
    <>
      <label className="edit-user-label">Enter Code:</label>
      <input className="edit-user-input" type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} />
      <button className="edit-user-button" onClick={verifyAndUpdateEmail}>Verify & Update Email</button>
    </>
  )}

  <label className="edit-user-label">Address:</label>
  <input className="edit-user-input" type="text" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} />

  <label className="edit-user-label">Credit Card: {formData.creditCard.length}</label>
  <input className="edit-user-input" maxLength={16} type="text" value={formData.creditCard} onChange={(e) => handleChange("creditCard", e.target.value)} />

  <label className="edit-user-label">Password:</label>

<div className="password-field-container">
    <input className="edit-user-input" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => handleChange("password", e.target.value)} />
    <button className="edit-user-password-toggle"  type="button" onClick={FlilpShowPassword} style={{ height: "40px" }}>
      {showPassword ? "👁️" : "🙈"}
    </button>
</div>
  <label className="edit-user-password-strength">{PasswordStrength}</label>

  <button className="edit-user-button" onClick={handleSubmit}>Update Details</button>
</div>
    );
};

export default EditUser;
