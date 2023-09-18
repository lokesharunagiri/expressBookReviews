const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
let users=[]
const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))
//let users=[]
const doesExist=(username)=>{
    let userswithsamename=users.filter((user)=>{
        return user.username===username
    });
    if(userswithsamename.length>0)
    {
        return true;
    }
    else{
        return false;
    }
}
const authenticatedUser=(username,password)=>{
    let validusers=users.filter((user)=>{
        return (user.username===username&&user.password===password)
    });
    if(validusers.length>0)
    {
        return true;
    }
    else{
        return false;
    }
}
app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
if(req.session.authorization){
    token=req.session.authorization['accessToken'];
    jwt.verify(token,"access",(err,user)=>{
        if(!err)
        {
            req.user=user;
            next();
        }
        else{
            return res.status(403).json({message:"User is not authenticated to access"})
        }
    });
}
else{
    return res.status(403).json({message:"User not logged in!"})
}
});
 
const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
