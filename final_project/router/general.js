const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
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


public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if(username&&password)
  {
      if(!doesExist(username))
      {
          users.push({"username":username,"password":password});
          return res.status(200).json({message:"User Got registered Successfully. Now you can login to the website"});
      }
      else{
          return res.status(404).json({message:"Username already exists"});
      }
  }
  return res.status(404).json({message:"Unable to register user"});
 
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
 // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN=req.params.isbn;
  res.send(books[ISBN])
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let ans=[]
  for(const [key,values] of Object.entries(books)){
      const book=Object.entries(values);
      for(let i=0;i<book.length;i++){
          if(book[i][0]=='author'&&book[i][1]==req.params.author)
          {
              ans.push(books[key]);
          }
      }
  }
  if(ans.length==0)
  {
     return res.status(300).json({message: `No books of this author ${req.params.author} exist`}); 
  }
  res.send(ans);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let ans=[]
  for(const [key,values] of Object.entries(books)){
      const book=Object.entries(values);
      for(let i=0;i<book.length;i++){
          if(book[i][0]=='title'&&book[i][1]==req.params.title)
          {
              ans.push(books[key]);
          }
      }
  }
  if(ans.length==0)
  {
     return res.status(300).json({message: `No book of this title ${req.params.title} exist`}); 
  }
  res.send(ans);

  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN=req.params.ISBN;
  res.send(books[ISBN].reviews)
  //return res.status(300).json({message: "Yet to be implemented"});
});
function getBookList(){
    return new Promise((resolve,reject)=>{
        resolve(books);
    })
}
public_users.get('/',function(req,res){
            getBookList().then(
                (bk)=>res.send(JSON.stringify(bk,null,4)),(error)=>res.send("denied")
            );
});
function getfromISBN(isbn){
    let book_s=books[isbn];
    return new Promise((resolve,reject)=>{
        if(book_s)
        {
            resolve(book_s);
        }
        else{
            reject(book_s);
        }
    })
}
public_users.get('/isbn/:isbn',function(req,res){
    const isbn=req.params.isbn;
    getfromISBN(isbn).then(
        (bk)=>res.send(JSON.stringify(bk,null,4)),(error)=>res.send(error)
    )
});
function getfromauthor(author){
    let output=[];
    return new Promise((resolve,reject)=>{
        for(var isbn in books){
            let book_s=books[isbn];
            if(book_s.author===author){
                result.push(book_s);
            }
        }
        resolve(output);
    })

}
public_users.get('/author/:author',function(req,res){
    const author=req.params.author;
    getfromauthor(author).then(
        result=>res.send(JSON.stringify(result,null,4))
    );
});
function getfromtitle(title){
    let output=[];
    return new Promise((resolve,reject)=>{
        for(var isbn in books){
            let book_s=books[isbn];
            if(book_s.title===title)
            {
                output.push(book_s);
            }
        }
        resolve(output);
    })
}
public_users.get('/title/:title',function(req,res){
    const title=req.params.title;
    getfromtitle(title).then(
        result=>res.send(JSON.stringify(result,null,4))
    );
});
module.exports.general = public_users;
