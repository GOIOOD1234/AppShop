const mongoose = require('mongoose');

// הגדרת סכימה למשתמש
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    creditCard: {
        type: Number,
        required: true,
        unique: true,
     
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    },
    total:{
        type: Number,
        required: false,
        default: 0
    },
    productsBought: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            date: {
                type: [String],
                default: [null] 
            }
          
        }
    ]
}, {
    timestamps: true 
});


const User = mongoose.model('User', userSchema);

module.exports = User;
