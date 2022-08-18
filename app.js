var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const pool=require('./db');

//var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/signup', indexRouter);
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/// sign up 

app.post('/signup',async (req,res,next)=>{
  const name=req.body.name;
  const pass=req.body.pass;
  const data= await pool.query("SELECT * FROM user_info WHERE user_name=$1;",[name])
  const arr=data.rows;
  if(arr.length!=0){
    res.json("user already exist");
  }
  else{
    const newUser = await pool.query(
      "INSERT INTO user_info (user_name,user_pass) VALUES ($1,$2) RETURNING *",
      [name,pass]
  );
  res.json(newUser.rows) 
    

  }

})

//log in


app.get('/log',(req,res,next)=>{
  res.render('signin');
})

app.post('/login',async (req,res,next)=>{
  const name=req.body.name;
  const pass=req.body.pass;
  const data= await pool.query("SELECT * FROM user_info WHERE user_name=$1;",[name])
    console.log(pass) 
  console.log(data.rows[0].user_pass)  
  const arr=data.rows;
  if(arr.length==0){
    console.log("please register")
    res.redirect('/');
  }
  if(pass==data.rows[0].user_pass){    
 res.send("<h1>logged in</h1>")   
}

})

module.exports = app;
