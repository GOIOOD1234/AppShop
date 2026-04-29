const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const UserRequest = require("../models/userRequest")


// ID להשיג בקשה לפי ה
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const userRequestID = await UserRequest.findById(id);
        if (!userRequestID) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: userRequestID });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


//כל הבקשות
router.get("/", async (req, res) => {
    try {
        const userRequests = await UserRequest.find({});
        res.status(200).json({ success: true, data: userRequests });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



//להוסיף בקשה
router.post("/", async (req, res) => {
    const { name, email, description} = req.body;

    if (!name || !email || !description) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const newUserRequest = new UserRequest({ 
        name, 
        email, 
        description, 
    });

    try {
        await newUserRequest.save();
        res.status(201).json({ success: true, data: newUserRequest });
    } catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// // חיפוש בקשה לפי אימייל
router.get("/findByEmail/:email", async (req, res) => {
    const { email } = req.params;
    try {
        const userRequests = await UserRequest.find({ email: email }); 
        if (userRequests.length === 0) {
            return res.status(404).json({ success: false, message: "No requests found for this email" });
        }
        res.status(200).json({ success: true, data: userRequests });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const deletedUserRequest = await UserRequest.findByIdAndDelete(id);
        if (!deletedUserRequest) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;
