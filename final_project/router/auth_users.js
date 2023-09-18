const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"username":"Loki","password":"Loki123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const matchedUsers=users.filter((user)=>user.username===username);
return matchedUsers.length>0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const validusers=users.filter((user)=>user.username===username && user.password===password);
return validusers.length>0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  console.log("login:",req.body);
  const username=req.body.username;
  const password=req.body.password;
  if(!username||!password)
  {
      return res.status(404).json({message:"Invalid Credentials"})
  }
  if(authenticatedUser(username,password)){
      let accessToken=jwt.sign({
          data:password  
      },'access',{expiresIn:60*60});
      req.session.authorization={
          accessToken,username
      }
      return res.status(200).send("Successfully logged in");
  }else{
  return res.status(208).json({message: "Invalid log in"});
}});

// Add a book review
regd_users.get("/regd_users",(req,res)=>{
    res.send(JSON.stringify(users,null,4))
})
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn=req.params.isbn;
  const review=req.body.review;
  const username=req.session.authorization.username;
  console.log("Add review:",req.params,req.body,req.session);
  if(books[isbn])
  {
      let book=books[isbn];
      book.reviews[username]=review;
      return res.status(200).send("Review was added successfully");

  }
  else{
      return res.status(404).json({message:`ISBN ${isbn} is not found in the databse`})
  }
//  return res.status(300).json({message: "Yet to be implemented"});
});
regd_users.delete("/auth/review/:isbn",(req,res)=>{
    const isbn=req.params.isbn;
    const username=req.session.authorization.username;
    if(books[isbn]){
        let book=books[isbn];
        delete book.reviews[username];
        return res.status(200).send("Review is successfully deleted!");
    }
    else{
        return res.status(404).json({message:`ISBN ${ISBN} is not found`});
    }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
