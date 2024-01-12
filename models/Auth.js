const mongoose=require('mongoose')

const authSchema=new mongoose.Schema({
    user_name:{
        type:String,
    },
    user_email:{
        type:String,
    },
    token:{
        type:String,
    },
    user_password:{
        type:String
    }
})

module.exports= mongoose.model('Auth',authSchema)