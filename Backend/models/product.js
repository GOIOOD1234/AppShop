const mongoose = require('mongoose');

const producSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:
    {
        type:Number,
        required:true,
         min: 0
    },
    image:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:false,
    },
    amount:{
        type:Number,
        required:true,
        min: 0
    },
    categories:{
        type: [String], 
        required: true,  
        default: []      
    },
    


},{
    timestamps:true
})

const Product = mongoose.model('Product', producSchema);

module.exports = Product;
