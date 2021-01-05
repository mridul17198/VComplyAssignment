var express = require('express');
var router = express.Router();
var passport = require('passport');
const bodyParser = require('body-parser');
var User = require('../models/user');
var Approval = require('../models/Approval');
var authenticate = require('../authenticate');
router.use(bodyParser.json());
const config=require('../config');


// Get the Final WorkFlow Result

router.get('/',authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) =>{
    var SequentialFlag=0,RoundRobinFlag=0,AnyOneFlag=1;
    Approval.SequentialApproval.find({})
    .then((approval) =>{
        approval.forEach(data => {
            if(data.workFlow == "Terminated")
            {
                SequentialFlag=1;
                return;
            }
        });
        Approval.RoundRobinApproval.find({})
        .then((approval) =>{
            approval.forEach(data => {
                if(data.workFlow == "Terminated")
                {
                    RoundRobinFlag=1;
                    return;
                }
            });
            Approval.AnyOneApproval.find({})
            .then((approval) =>{
                approval.forEach(data => {
                    if(data.workFlow == "Active")
                    {
                        AnyOneFlag=0;
                        return;
                    }
                });
                if(SequentialFlag==0 && RoundRobinFlag==0 && AnyOneFlag==0)
                {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true,status: 'Workflow Executed Successfullly'});
                }
                else{
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: false,status: 'Workflow Not Executed'});
                }
            })
        })
    });
});

module.exports= router;