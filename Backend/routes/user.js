const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const mongoose = require("mongoose");


//חידוש סיסמה
router.post("/ResumePassword/:id", async (req, res) =>{
    const { id } = req.params;
    const {password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid User ID" });
    }
    
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.password = password;
        await user.save();

        console.log("Password updated successfully for user:", user.email);
        res.status(200).json({ success: true, message: "Password updated successfully" });
    
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

//התחברות משתמש
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide both email and password" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// השרת שלך - API להחזרת המוצרים לפי מזהים
router.get("/products", async (req, res) => {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({ success: false, message: "No product IDs provided" });
    }
  
    // המרת המזהים למערך של אובייקטי ObjectId
    const productIds = ids.split(',').map(id => mongoose.Types.ObjectId(id));
  
    try {
      const products = await Product.find({ '_id': { $in: productIds } });
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error("Error fetching products:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
});

// ID להשיג משתמש לפי ה
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


//כל המשתמשים
router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


//לעדכן את פרטי המשתמש
router.post("/:id",async(req, res)=>{
    const { id } = req.params;
    const user = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
})


//להוסיף מוצרים למערך המוצרים
//!!!!!!!!KEY אני שולח ששם ה
// products הוא 
router.post("/buy/:id", async (req, res) => {
    const { id } = req.params;
    const { products } = req.body; 
        
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid User ID" });
    }
    
    // בדיקה אם המערך של המוצרים ריק
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ success: false, message: "Products array is required and should not be empty" });
    }
    
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    
        for (const { product_id, amount} of products) {
           
            // המרת המזהה ל-ObjectId עם new
            const productId = new mongoose.Types.ObjectId(product_id);
            //השגת המוצר עצמו
            const product = await Product.findById(productId)
            // חיפוש אם המוצר כבר קיים
            const existingProduct = user.productsBought.find(p => p.product_id.toString() === productId.toString()); 
            console.log("Existing Product Found:", existingProduct);

           
            if (existingProduct) {
                // אם המוצר קיים, הוסף כמות
                existingProduct.amount += amount;
                
                existingProduct.date.push(new Date().toLocaleString("he-IL")+ " amount: "+ amount.toString())
            } else {
                // אם המוצר לא קיים, הוסף אותו
                user.productsBought.push({ 
                    product_id: productId, 
                    amount, 
                    date: [new Date().toLocaleString("he-IL") + " amount: "+ amount.toString()],
                });                

            }

            user.total+=product.price* amount

        }
        
        await user.save();
    
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


//להוסיף משתמש
router.post("/", async (req, res) => {
    const { name, email, creditCard, address, password } = req.body;

    if (!name || !email || !creditCard || !address || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const newUser = new User({ 
        name, 
        email, 
        creditCard, 
        address, 
        password,
        productsBought: []  
    });

    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error creating user:", error.message);
         const { email } = req.body;
         if(! email){
                const user = await User.findOne({ email: email });
                if(user){
                      res.status(400).json({ success: false, message: "email is existed " });

            }

         }
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// חיפוש משתמש לפי אימייל
router.get("/findByEmail/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});




// // ID למחוק משתמשים לפי
//
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
