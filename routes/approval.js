var express = require('express');
var router = express.Router();
var passport = require('passport');
const bodyParser = require('body-parser');
var User = require('../models/user');
var Approval = require('../models/Approval');
var authenticate = require('../authenticate');
router.use(bodyParser.json());
const config=require('../config');

// Create Different Levels

router.post('/Sequential/:level',authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    req.body.level=req.params.level;
    req.body.nextUser=req.body.users[0];
    Approval.SequentialApproval.create(req.body)
    .then((data)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    },(err) =>{
        res.statusCode=500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:err});
    })
    .catch((err)=>{
        res.statusCode=500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:err});
    });
});

router.post('/RoundRobin/:level',authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    req.body.level=req.params.level;
    Approval.RoundRobinApproval.create(req.body)
    .then((data)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    },(err) =>{
        res.statusCode=500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:err});
    })
    .catch((err)=>{
        res.statusCode=500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:err});
    });
});

router.post('/AnyOne/:level',authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    req.body.level=req.params.level;
    Approval.AnyOneApproval.create(req.body)
    .then((data)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(data);
    },(err) =>{
        res.statusCode=500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:err});
    })
    .catch((err)=>{
        res.statusCode=500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err:err});
    });
});

module.exports=router;
