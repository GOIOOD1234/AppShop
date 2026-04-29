const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    money: [
            {
            sum: {
                type: [Number],
                required: true,
                default: [0] 
            },
            date: {
                type: [String], 
                default: [ new Date().toLocaleDateString("he-IL")] 
            }
          
        }
    ]
       
}, {
    timestamps: true 
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
