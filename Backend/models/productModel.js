const mongoose = require('mongoose')


const productSchema= new mongoose.Schema({
    id:{
        type: Number,
        unique:true
    },
    title:String,
    price:Number,
    description:String,
    category:String,
    image:String,
    sold:Boolean,
    dateOfSale:Date
})

const Product = mongoose.model("Product",productSchema)

module.exports= Product