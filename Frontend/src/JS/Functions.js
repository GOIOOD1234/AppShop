import axios from 'axios';
const getAllProducts = "http://localhost:5000/api/products"


//מביא לי את כל המוצרים
export const fetchProducts = async (setProducts) => {
    try {
      const response = await axios.get(getAllProducts);
      setProducts(response.data.data);  
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


export const IsPasswordStrength  = (password,setPasswordstrength) => {
    let message = ""
    let isPasswordStrength = false
    setPasswordstrength()
    if(password.length < 7){
      message = "Password is too short"
      message+="\n"
    }
    let hasNumber = false;
    let current =  0
    let enoughNumber = 3
    for (let i = 0; i < password.length; i++) {
      if (password[i] >= '0' && password[i] <= '9') {
        current++
       
      }
      if(current >= enoughNumber){
        hasNumber = true;
        break;
      }
    }
    if (!hasNumber) {
      message+="The password must contain at least 3 numbers"
      message+="\n"

    }

    let hasSpecialChar = false;
    const specialChars = "!@#$%^&*(),.?\":{}|<>"; 
    for (let i = 0; i < password.length; i++) {
      if (specialChars.indexOf(password[i]) !== -1) {
        hasSpecialChar = true;
        break;
      }
    }
  
    if (!hasSpecialChar) {
      message += "The password must contain at least a special character";
    }
    if(message == ""){
      message = "Password is Strength"
      isPasswordStrength = true
    }
    setPasswordstrength(message)
    return isPasswordStrength
};
