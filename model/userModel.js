const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        trim:true
    },
    email: {
        type:String,
        required: true,
        trim:true,
        unique: true
    },
    mobile: {
        type:String,
        required: true,
        trim:true,
        unique: true
    },
    password: {
        type:String,
        required: true,
        trim:true
    },
    role: {
        type:String,
       default: "student",
       enum:["student","trainer","superadmin"]
    },
    address:{
        type:Object,
        default:{}
    },
    image:{
        type:Object,
        default:{
            url: "https://www.freeiconspng.com/img/23494"
        }
    }
   
},{
    collection :"users",
    timestamps: true
})

module.exports = mongoose.model("User",UserSchema)