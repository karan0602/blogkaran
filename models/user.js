const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        lowercase:true
    },
    organisation:{
        type:String,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        trim:true
    },
    posts:[{
        title:{
            type:String,
            trim:true
        },
        about:{
            type:String,
            trim:true
        },
        date:{
            type:String
        }
    }],
    tokens:[{
        token:{
            type:String
        }
    }]
})


userSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({id:this._id.toString()}, 'MyBlogSite')
        this.tokens = this.tokens.concat({token:token})
        await this.save()

        return token 
    } catch (error) {
        res.status(501).send("ERROR"  + error)
    }
}


userSchema.pre('save' , async function(next){
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password ,10)
    }
})


const User = new mongoose.model('User' , userSchema)

module.exports = User