var express = require('express');
var router = express.Router();
var passport = require('passport');
const bodyParser = require('body-parser');
var User = require('../models/user');
var Approval = require('../models/Approval');
var authenticate = require('../authenticate');
router.use(bodyParser.json());
const config=require('../config');


// Posting Actions

router.post('/Sequential/:level',authenticate.verifyUser,(req,res,next)=>{
    Approval.SequentialApproval.findOne({level:req.params.level})
    .then((approval)=>{
        if(approval.workFlow=="Active" || approval.workFlow=='')
        {
            if(approval.nextUser==req.body.user)
            {
                approval.actions.push(req.body);
                if(approval.users.indexOf(req.body.user)+1 < approval.users.length)
                {
                    approval.nextUser = approval.users[approval.users.indexOf(req.body.user)+1];
                }
                if(req.body.action=="Active")
                {
                    approval.workFlow="Active";
                }
                else if(req.body.action=="Reject & Remove from workflow")
                {
                    approval.workFlow="Active";
                }
                else{
                    approval.workFlow="Terminated";
                }
                approval.save()
                .then((data)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true,status: 'Action Logged Succesfully!'});
                })
                .catch((err) =>{
                    res.statusCode=500;
                    res.setHeader('Content-type','application/json');
                    res.json({err:err});
                })
            }
            else{
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                err={
                success:"false",
                message:"You are Not in Proper Sequence"
                }
                res.json({err:err});
            }
        }
        else{
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            err={
            success:"false",
            message:"WorkFlow is Already Terminated"
            }
            res.json({err:err});
        }
    },(err)=>{
        res.statusCode=500;
        res.setHeader('Content-type','application/json');
        res.json({err:err});
    })
    .catch((err) =>{
        res.statusCode=500;
        res.setHeader('Content-type','application/json');
        res.json({err:err});
    });
});

router.post('/RoundRobin/:level',authenticate.verifyUser,(req,res,next)=>{
    Approval.RoundRobinApproval.findOne({level:req.params.level})
    .then((approval) =>{
        if(approval.workFlow=="Active" || approval.workFlow=="")
        {
            if(!approval.processedUser.includes(req.body.user))
            {
                approval.actions.push(req.body);
                approval.processedUser.push(req.body.user);
                if(req.body.action=="Active")
                {
                    approval.workFlow="Active";
                }
                else if(req.body.action=="Reject & Remove from workflow")
                {
                    approval.workFlow="Active";
                }
                else{
                    approval.workFlow="Terminated";
                }
                approval.save()
                .then((data)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true,status: 'Action Logged Succesfully!'});
                })
                .catch((err) =>{
                    res.statusCode=500;
                    res.setHeader('Content-type','application/json');
                    res.json({err:err});
                })
            }
            else{
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                err={
                success:"false",
                message:"You have Already Performed a action"
                }
                res.json({err:err});
            }
        }
        else{
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            err={
            success:"false",
            message:"WorkFlow is Already Terminated"
            }
            res.json({err:err});
        }
    },(err) =>{
        res.statusCode=500;
        res.setHeader('Content-type','application/json');
        res.json({err:err});
    })
    .catch((err) =>{
        res.statusCode=500;
        res.setHeader('Content-type','application/json');
        res.json({err:err});
    });
});

router.post('/AnyOne/:level',authenticate.verifyUser,(req,res,next) =>{
    console.log(req.params);
    Approval.AnyOneApproval.findOne({level:req.params.level})
    .then((approval) =>{
        if(!approval.processedUser.includes(req.body.user))
        {
            approval.actions.push(req.body);
            approval.processedUser.push(req.body.user);
            if(req.body.action=="Active")
            {
                approval.workFlow="Active";
            }
            else if(req.body.action=="Reject & Remove from workflow")
            {
                approval.workFlow="Active";
            }
            else{
                if(approval.workFlow=="")
                {
                    approval.workFlow="Terminated"
                }
            }
            approval.save()
                .then((data)=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true,status: 'Action Logged Succesfully!'});
                })
                .catch((err) =>{
                    res.statusCode=500;
                    res.setHeader('Content-type','application/json');
                    res.json({err:err});
                })
        }
        else{
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            err={
            success:"false",
            message:"You have Already Performed a action"
            }
            res.json({err:err});
        }
    },(err) =>{
        res.statusCode=500;
        res.setHeader('Content-type','application/json');
        res.json({err:err});
    })
    .catch((err) =>{
        res.statusCode=500;
        res.setHeader('Content-type','application/json');
        res.json({err:err});
    });
});

module.exports = router;