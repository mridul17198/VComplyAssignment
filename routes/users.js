var express = require('express');
var router = express.Router();
var passport = require('passport');
const bodyParser = require('body-parser');
var User = require('../models/user');
var authenticate = require('../authenticate');
router.use(bodyParser.json());
const config=require('../config');

//Get All User

router.get('/',authenticate.verifyUser,authenticate.verifyAdmin,function(req,res,next){
    User.find({},(err,user)=>{
        if(err)
        {
          res.statusCode=500;
          res.setHeader('Content-type','application/json');
          res.json({err:err});
        }
        else{
          res.statusCode=200;
          res.setHeader('Content-type','application/json');
          res.json({success:true,data:user,status:'List Of User Fetched'})
        }
    });
});

router.post('/',function(req,res,next){
    User.register(new User({username:req.body.username,phonenumber:req.body.phonenumber,email:req.body.email}),
        req.body.password, (err,user)=>{
            if(err){
                res.statusCode=500;
                res.setHeader('Content-type','application/json');
                res.json({err:err});
            }
            else{
                if(req.body.hasOwnProperty('admin'))
                {
                    user.admin=req.body.admin;
                    user.save((err,user)=>{
                        if(err)
                        {
                            res.statusCode=500;
                            res.setHeader('Content-type','application/json');
                            res.json({err:err});
                        }
                        else{
                            passport.authenticate('local',{failureRedirect: '/user/signup_error'})(req,res,()=>{
                                var token = authenticate.getToken({_id: req.user._id});
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ success: true,token:token,status: 'Registration Successful!' });
                            })
                        }
                    })
                }
                else{
                    passport.authenticate('local',{failureRedirect: '/user/signup_error'})(req,res,()=>{
                                var token = authenticate.getToken({_id: req.user._id});
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({ success: true,token:token,status: 'Registration Successful!' });
                            })
                }
            }
        });
});

router.post('/login',passport.authenticate('local',{failureRedirect: '/users/login_error'}), (req, res) => {

    var token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

router.get('/signup_error',(req,res)=>{
    res.statusCode=500
    res.setHeader('Content-Type','application/json');
    err={
      success:"false",
      message:"Signup Not Successful!! Please Try Again With different Username or Mobile Number"
    }
    res.json({err:err});
});

router.get('/login_error',(req,res) =>{
    res.statusCode=500;
    res.setHeader('Content-Type', 'application/json');
    err={
      success:"false",
      message:"Login Not Successful!! Username or password is not correct"
    }
    res.json({err:err});
});

module.exports=router;