const mongoose = require('mongoose');


const userRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    description:{
        type:String,
        required:true,
    }
}, {
    timestamps: true // מוסיף את השעה שזה נוצר לאובייקט
});


const UserRequestSchema = mongoose.model('userRequest', userRequestSchema);

module.exports = UserRequestSchema;
