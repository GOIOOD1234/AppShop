const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const Admin = require("../models/Admin")

// עדכון הכמות של המוצר והוספת הכסף
router.put("/amount/:id", async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;  
    
    console.log(amount)
        console.log(id)

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        // חיפוש המוצר במאגר
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

    //      if (product.amount<0) {
    //     return res.status(400).json({
    //     success: false,
    //     message: `Not enough stock for ${product.name}. Only ${product.amount} left.`
    //  });
    // }

        const admins = await Admin.find({});
        if (!admins || admins.length === 0) {
            return res.status(404).json({ success: false, message: "No admins found" });
        }
        const today = new Date().toLocaleDateString("he-IL")
    
        // const today =  "19.5.2025"
        const saleMoney = amount * product.price;
        for (let admin of admins) {
            // חיפוש אינדקס של תאריך קיים במערך ה- `date`
            let recordIndex = admin.money.findIndex(rec => rec.date.includes(today));

            if (recordIndex !== -1) {
                // אם התאריך קיים - עדכון הסכום הקיים
                admin.money[recordIndex].sum = admin.money[recordIndex].sum.map(value => value + saleMoney);
            } else {
                // אם התאריך לא קיים - מוסיפים אותו למערך date ואת הסכום ל-sum
                if (admin.money.length > 0) {
                    admin.money[0].date.push(today);
                    admin.money[0].sum.push(saleMoney);
                } else {
                    // אם המערך ריק לחלוטין, יוצרים רשומה ראשונית
                    admin.money.push({ sum: [saleMoney], date: [today] });
                }
            }
            await admin.save();
        }

        // עדכון הכמות על פי הערך שנשלח
        product.amount -= amount;
          
        // שמירת השינויים
        // await Product.findByIdAndUpdate(id, { $inc: { amount: -amount } });

        await product.save();
        // await newAdmin.save();

        
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error"  +error.message});
    }
});



//עדכון המוצר
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ID להשיג מוצר לפי ה
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


//כל המוצרים
router.get("/", async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



//להוסיף מוצר
router.post("/", async (req, res) => {
    const { name, price, image, description,amount,categories} = req.body;
    if (!name || !price || !image ||!amount ||!categories ) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const newProduct = new Product({ name, price, image,description,amount,categories});

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// ID למחוק מוצר לפי 
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
