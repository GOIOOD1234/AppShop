const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const Admin = require("../models/Admin")
const mongoose = require("mongoose");



router.get("/", async (req, res) => {
    try {
        const Admins = await Admin.find({});
        res.status(200).json({ success: true, data: Admins });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


//ID מוחק אדמין לאותו משתמש לפי
router.post("/deleteAdmin/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.admin = false;
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
  
});



// ID מוסיף אדמין לאותו משתמש לפי 
router.post("/addAdmin/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.admin = true;
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



//מביא לי את כל האדמינים
router.get("/AllAdmins", async (req, res) => {
    try {
        const users = await User.find({admin: true});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



// //להוסיף אדמין לפעיל רק פעם אחת
router.post("/", async (req, res) => {
    
    const newAdmin = new Admin({
        money: [
            {
                sum: [0], 
                date: [new Date().toLocaleDateString("he-IL")]
            }
        ]
    });

    await newAdmin.save();
    try {
        await newAdmin.save();
        res.status(201).json({ success: true, data: newAdmin });
    } catch (error) {
        console.error("Error creating newAdmin", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});




// // //התחברות משתמש
// router.post("/AddMoney", async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ success: false, message: "Please provide both email and password" });
//     }

//     try {
//         const user = await User.findOne({ email });
//         if (!user || user.password !== password) {
//             return res.status(401).json({ success: false, message: "Invalid credentials" });
//         }
        
//         res.status(200).json({ success: true, data: user });
//     } catch (error) {
//         console.error("Error logging in:", error.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });


// // השרת שלך - API להחזרת המוצרים לפי מזהים
// router.get("/products", async (req, res) => {
//     const { ids } = req.query;
    
//     if (!ids) {
//       return res.status(400).json({ success: false, message: "No product IDs provided" });
//     }
  
//     // המרת המזהים למערך של אובייקטי ObjectId
//     const productIds = ids.split(',').map(id => mongoose.Types.ObjectId(id));
  
//     try {
//       const products = await Product.find({ '_id': { $in: productIds } });
//       res.status(200).json({ success: true, data: products });
//     } catch (error) {
//       console.error("Error fetching products:", error.message);
//       res.status(500).json({ success: false, message: "Server error" });
//     }
// });

// // ID להשיג משתמש לפי ה
// router.get("/:id", async (req, res) => {
//     const { id } = req.params;
//     try {
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "Product not found" });
//         }
//         res.status(200).json({ success: true, data: user });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });


// //כל המשתמשים
// router.get("/", async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.status(200).json({ success: true, data: users });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });


// //לעדכן את פרטי המשתמש
// router.post("/:id",async(req, res)=>{
//     const { id } = req.params;
//     const user = req.body;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ success: false, message: "Invalid Product ID" });
//     }
    
//     try {
//         const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
//         if (!updatedUser) {
//             return res.status(404).json({ success: false, message: "Product not found" });
//         }
//         res.status(200).json({ success: true, data: updatedUser });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// })


// //להוסיף מוצרים למערך המוצרים
// //!!!!!!!!KEY אני שולח ששם ה
// // products הוא 
// router.post("/buy/:id", async (req, res) => {
//     const { id } = req.params;
//     const { products } = req.body; 
//     // מערך של מוצרים עם מזהה וכמות [{ product_id, amount }]
    

    
//     // בדיקה אם ה-ID של המשתמש תקין
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ success: false, message: "Invalid User ID" });
//     }
    
//     // בדיקה אם המערך של המוצרים ריק
//     if (!Array.isArray(products) || products.length === 0) {
//         return res.status(400).json({ success: false, message: "Products array is required and should not be empty" });
//     }
    
//     try {
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }
    
//         for (const { product_id, amount} of products) {
//             console.log("Product ID:", product_id, "Amount:", amount);
            
//             // המרת המזהה ל-ObjectId עם new
//             const productId = new mongoose.Types.ObjectId(product_id);
        
//             // חיפוש אם המוצר כבר קיים
//             const existingProduct = user.productsBought.find(p => p.product_id.toString() === productId.toString()); 
//             console.log("Existing Product Found:", existingProduct);
        
//             if (existingProduct) {
//                 // אם המוצר קיים, הוסף כמות
//                 existingProduct.amount += amount;
//                 existingProduct.date.push(new Date().toLocaleString("he-IL")+ " amount: "+ amount.toString())
//             } else {
//                 // אם המוצר לא קיים, הוסף אותו
//                 user.productsBought.push({ 
//                     product_id: productId, 
//                     amount, 
//                     date: [new Date().toLocaleString("he-IL") + " amount: "+ amount.toString()],
//                 });                

//             }
          
           
//         }
    
//         // שמירת השינויים במשתמש
//         await user.save();
    
//         res.status(200).json({ success: true, data: user });
//     } catch (error) {
//         console.error("Error:", error.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });





// // // ID למחוק משתמשים לפי
// //
// router.delete("/:id", async (req, res) => {
//     const { id } = req.params;
    
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ success: false, message: "Invalid Product ID" });
//     }

//     try {
//         const deletedUser = await User.findByIdAndDelete(id);
//         if (!deletedUser) {
//             return res.status(404).json({ success: false, message: "Product not found" });
//         }
//         res.status(200).json({ success: true, message: "Product deleted successfully" });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

module.exports = router;
