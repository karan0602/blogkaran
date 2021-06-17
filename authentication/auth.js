const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Post = require('../models/post')

const auth = async (req, res,next)=>{
    try {
        console.log("Authentication Area")
        const tmp = await req.headers.cookie
        // console.log(tmp)
        const token = tmp.substring(4)
        const verifyUser = jwt.verify(token,'MyBlogSite')
        const user = await User.findOne({_id:verifyUser._id})

        req.token = token
        req.user = user 
        // return;
        next()
    } catch (error) {
        const upost = await Post.find()
        console.log("Authentication Error " + error)
        res.render('home', {upost:upost})
    }
}

module.exports = auth 