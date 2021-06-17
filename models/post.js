const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const postSchema = new mongoose.Schema({
    email:{
        type:String,
        trim:true,
        required:true
    },
    heading:{
        type:String,
        trim:true,
        required:true
    },
    details:{
        type:String,
        trim:true,
        required:true
    },
    token:{
        type:String,
        default:'1'
    },
    date:{
        type:String
    },
    slug:{
        type:String, 
        unique:true,
        required:true
    }
})



const Post = new mongoose.model('Post' , postSchema)

module.exports = Post