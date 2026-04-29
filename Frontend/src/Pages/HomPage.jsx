import { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "emailjs-com";
import { Link } from "react-router-dom";
import ProductCard from "./Products/ProductCard";
import Cleave from 'cleave.js/react';
import Swal from 'sweetalert2';
import {productsApi,userBuyApi,amountApi,findByEmailApi,productsApiByID} from "../JS/Variables"

const HomPage = () => {
  const [updatePage,setUpdatePage] = useState(0)
  const [selectedCategories, setSelectedCategories] = useState([]);  
  const [products, setProducts] = useState([]);  
  
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });  
  const categoriesList = ["Electronics", "Clothing", "Toys", "Books", "Home", "Sports"]; 
  const [search, setSearch] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const[buy,setBuy] = useState(false)
  const [showModalOrder,setShowModalOrder] = useState(false)
  const [userDetails, setUserDetails] = useState({
    email: '',
    creditCard:"",
    creditDate:"",
    CreditThree_figure:""
  });
  const [order,setOrder] = useState({
    products:"",
    sum:"",
    address:""
  })
  const currentUserID = JSON.parse(localStorage.getItem('currentUser')); 
  
  const fullSetDetatils = () =>{
    setUserDetails({ email: currentUser.email,creditCard:currentUser.creditCard})
    console.log(userDetails)
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(productsApiByID + productId);
      setUpdatePage(prev => prev + 1);
      Swal.fire("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire("Failed to delete product.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(productsApi);
      setProducts(response.data.data);  
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));

    }
    fetchProducts();
  }, [updatePage,buy]);
  //---
  useEffect(() => {

    if (showModal && currentUser) {
      setUserDetails({
        email: currentUser.email ,
        creditCard: String(currentUser.creditCard || ""),
        creditDate:  '',
        CreditThree_figure:  ''
      });
    }
  }, [showModal, currentUser]);


  const handleAddToCart = (product) => {
    setShoppingCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product._id);

      if (existingItem && existingItem.quantity >= product.amount) {
        Swal.fire("You have reached the maximum amount of the product");
        return prevCart;
      }

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { id: product._id, name: product.name, price: product.price, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productId) => {
    setShoppingCart((prevCart) => {
      const updatedCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0); 
      
  
      return updatedCart;
    });
  };
  


  const calculateTotal = () => {
    return shoppingCart.reduce((total, item) => total + item.price * item.quantity, 0);
  };


  const sendInvoice = (email, cart) => {

    const productList = cart.map(item => `${item.name} - ${item.quantity} x ₪${item.price}`).join("\n");


    const totalAmount = calculateTotal();
  setOrder({
    products: productList,
    sum: totalAmount,
    address: currentUser.address
  });

  console.log(order);  
  console.log(order)

  const today = new Date().toLocaleDateString("he-IL")
    const templateParams = {
    to_email: email,
    message: `Thank you for buying with us! \n\nYou have purchased the following items:\n\n${productList}\n\nTotal amount: ₪${totalAmount}
    \n
    your address ${currentUser.address}
    \n
    Order date is: ${today}
    `,
  };


    emailjs.send(
      'service_fil4uhg',
      'template_d6mqbzt',
      templateParams,
      '5A09uV7b71XYCJ69e'
    )
      .then((response) => {
        
      })
      .catch((error) => {
        Swal.fire('Failed to send invoice.');
      });
  };

  const openModal = () => setShowModal(true);

  const closeModal = () =>{
    setShowModal(false);
    setBuy(true)
  } 

  const filteredProducts = products.filter((product) => {
    const isPriceInRange =
      (priceRange.min ? product.price >= priceRange.min : true) &&
      (priceRange.max ? product.price <= priceRange.max : true);
  
    const isCategoryMatch =
      selectedCategories.length === 0 || selectedCategories.some((category) => product.categories.includes(category));
  
    const isSearchMatch = product.name.toLowerCase().includes(search.toLowerCase());
    
    if (isSearchMatch.length == 0 && isPriceInRange.label == 0 && isCategoryMatch.label == 0){
      console.log("this not fond")
    }
    return isSearchMatch && isPriceInRange && isCategoryMatch;
  });
  
  
  const handlePurchase = async () => {
  console.log("Card:",  userDetails.creditCard.length , "length:"); 
    if (!userDetails.email || !userDetails.creditCard || !userDetails.CreditThree_figure  || userDetails.creditCard.length !==16||
      userDetails.CreditThree_figure.length !=3 || !userDetails.creditDate || userDetails.creditDate.length != 5) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: '<span style="font-size: 36px;">Please enter all user Details</span>',
        showConfirmButton: false,
        timer: 3000
      });
      console.log(userDetails);
      return;
    }
  
    try {
      
  
      const purchaseData = shoppingCart.map(item => ({
        product_id: item.id,
        amount: item.quantity
      }));
  
      let apiUser2 = findByEmailApi + userDetails.email;
      const user = await axios.get(apiUser2);
      let buyApi = userBuyApi + user.data.data._id;
      await axios.post(buyApi, { products: purchaseData });
  
      const updatedUser = await axios.get(apiUser2);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser.data.data));
      for (const item of shoppingCart) {
        const dataToSend = { amount: item.quantity };

        if(dataToSend.amount <=0){
           Swal.fire({
           position: 'top-end',
           icon: 'warning',
            title: '<span style="font-size: 36px;">this item out of stock </span>',
            showConfirmButton: false,
           timer: 3000
          });
          return;
        }

        console.log(item.id);
        await axios.put(amountApi  +item.id, dataToSend);
                                console.log(userDetails);

      }
      setCurrentUser(updatedUser.data.data);
      closeModal();
      sendInvoice(userDetails.email, shoppingCart);
      setShoppingCart([]);
      setUpdatePage(1);
      setShowModalOrder(true);
      setBuy(true)
      

    } catch (error) {
      console.error('Error updating products or sending invoice:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: '<span style="font-size: 36px;">There was an error completing your purchase. Please Refresh the page.</span>',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };
  

  return (
    <div>
<div className="filters-container">
 <div className="price-filter">
  <input 
    type="text" 
    placeholder="Min Price" 
    value={priceRange.min} 
    min={0}
    onChange={(e) => 
      setPriceRange({ ...priceRange, min: e.target.value.replace(/\D/g, '') })
    } 
    className="price-input"
  />
    <input 
    type="text" 
    placeholder="Max Price" 
    min={0}
    value={priceRange.max} 
    onChange={(e) => 
      setPriceRange({ ...priceRange, max: e.target.value.replace(/\D/g, '') })
    }
    className="price-input"
  />
</div>
  <input 
    type="text" 
    placeholder="Look for a product by name" 
    value={search} 
    onChange={(e) => setSearch(e.target.value)} 
    className="search-input"
  />
<div className="product-container categories">
  {categoriesList.map((category) => (
    <label key={category} className="product-card">
      <input
        type="checkbox"
        checked={selectedCategories.includes(category)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedCategories((prev) => [...prev, category]);
          } else {
            setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
          }
        }}
        className="category-checkbox"
      />
      <span className="category-button">{category}</span>
    </label>
  ))}
</div>

</div>

      {
        currentUser  && 
        <div style={{ position: "relative", padding: "10px" }}>
          <button className="cart-btn" onClick={openModal}>
            🛒 shopping cart ({shoppingCart.reduce((total, item) => total + item.quantity, 0)})
          </button>
        </div>
      }

      <h1>Products List</h1>

      <div className="product-container">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          
          <ProductCard 
      key={product._id} 
      product={product} 
      currentUser={currentUser} 
      handleDeleteProduct={handleDeleteProduct} 
      handleAddToCart={handleAddToCart} 
      handleRemoveFromCart={handleRemoveFromCart} 
      shoppingCart={shoppingCart} 
    />
        ))
      ) : (
        <p>not found product</p>
      )}
      </div>

      {showModalOrder && (
  <div className="modelOrder">
    <div className="modal-content">
      <h2>The order was successful</h2>
      <h3>order products</h3>
      <div className="shopping-cart-items">
        <select>
        {order.products.split('\n').map((line, i) => (
          <option  key={i}>
            {line}
          </option >
        ))}
        </select>
     
      </div>
      <p><strong>Total Payment:</strong> ₪{order.sum}</p>
      <p><strong>Sent to address:</strong> {order.address}</p>
      <p><strong>order date:</strong> {new Date().toLocaleDateString("he-IL")}</p>
      <button onClick={() => setShowModalOrder(false)}>closed</button>
    </div>
  </div>
)}
      {/* Modal for Checkout */}
      {showModal && (

        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Purchase</h2>
            <div className="shopping-cart-items">
              <h3>Your Cart:</h3>
               <select>
               {shoppingCart.length > 0 ? (
                shoppingCart.map(item => (
                  <option  key={item.id}>
                    {item.name} - {item.quantity} x ₪{item.price}
                  </option >
                ))
              ) : (
                <option >Your cart is empty.</option >
              )}
               </select>
               </div>


            <h3>Enter your email:</h3>
            <input 
              type="email" 
              value={userDetails.email} 
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              placeholder="Email" 
              required 
            />
            <h3>Enter your credit Card: {userDetails.creditCard.length}</h3>
            <input 
              maxLength={16}
              type="text" 
              value={userDetails.creditCard} 
             onChange={(e) => {const rawValue = e.target.value;
               const filteredValue = rawValue.replace(/\D/g, ''); 
              setUserDetails({ ...userDetails, creditCard: filteredValue });
            }}
              placeholder="creditCard" 
              required 
            />
            <h3>Enter your credit Date: 4 number</h3>
            <Cleave
              options={{
              date: true,
             datePattern: ['m', 'y']
                 }}
            placeholder="MM/YY"
             value={userDetails.creditDate}
            onChange={(e) =>
            setUserDetails({ ...userDetails, creditDate: e.target.value })
           }
          />
            <h3>Enter your  Credit Three_figure:</h3>
            <input 
          type="tel"
          inputMode="numeric"
          pattern="\d{3,4}"
           maxLength="3"
          placeholder="CVV"
           value={userDetails.CreditThree_figure}
          onChange={(e) => {
           const value = e.target.value.replace(/\D/g, ''); 
            if (value.length <= 3) {
             setUserDetails({ ...userDetails, CreditThree_figure: value });
              }
            }}
             required
          />

            <button onClick={handlePurchase}>Complete Purchase</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomPage;
