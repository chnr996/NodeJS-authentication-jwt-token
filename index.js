const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const Auth=require('./models/Auth')
const bodyParser = require('body-parser')
const app = express()
const ejs = require('ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine','ejs')
app.use(express.static('public'))
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

  const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/narayana',
    collection: 'mySessions',
})
app.use(session({
    secret: 'this is narayana',
    resave: false,
    saveUninitialized: false,
    store:store
    
  }))
  const checkauth=(req,res,next)=>{
    if(req.session.isAunthticated){
        next()
    }else{
        res.redirect('/login')
    }

  }
const connectDB=async()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/narayana')
        
        console.log('connected successfully')
    }catch(err){
        console.log('error',err)
    }
}

connectDB()


  app.get('/register',(req, res) => {
    res.render('register')
})

app.get('/login',(req, res) => {
    res.render('login')
})
app.get('/dashboard',checkauth,(req,res) => {
    res.render('welcome')
})
app.post('/register',async(req,res)=>{
    const {user_name,user_email,user_password}=req.body
   
    let auth= await Auth.findOne({user_email})
   
    if(auth){
       
        return res.redirect('/register')
    }else{
        
    }
    const hashpassword= await bcrypt.hash(user_password,12)
   
    auth=new Auth({
        user_name,
        user_email,
      
        user_password:hashpassword
    })
    const token=jwt.sign({ id:auth._id }, 'gdhfhduh3uhjfieujjdf$fjg&bhvbf@*$ggghjgwwemkhcbgkk%bh3nrjrjr$TR%^^G^&T^&^R$',{
        expiresIn:1500000
       
    })
    
  await auth.save()
  auth.token = token;
  await auth.save();
  res.redirect('/login')
})
app.post('/login',async(req,res)=>{
    const{user_email,user_password}=req.body
    const auth= await Auth.findOne({user_email})
    if(!auth){
        return res.redirect('/register')
    }    
    const isMatch = await bcrypt.compare(user_password,auth.user_password);
    const token=jwt.sign({ id:auth._id }, 'gdhfhduh3uhjfieujjdf$fjg&bhvbf@*$ggghjgwwemkhcbgkk%bh3nrjrjr$TR%^^G^&T^&^R$',{
      
        expiresIn:1500000
       
    })
    if(auth && isMatch){
    res.cookie('jwt',token,{
        maxAge:6000000,
        httpOnly:true
    })
}
    //console.log('token')
    if(!isMatch){
        return res.redirect('/register')

    }

    req.session.isAunthticated=true
   
    
    res.redirect('/dashboard')
})
app.post('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/login')
    })
})
app.listen(3000,console.log('serverconnected....'))