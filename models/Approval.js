var mongoose=require('mongoose');
const passport= require('passport');
var Schema=mongoose.Schema;

var ActionSchema = new Schema({
    user:{
        type:String,
        required:true
    },
    action:{
        type:String,
        required:true
    }
});

var SequentialApproval = new Schema({
    level:{
        type:Number,
        unique:true,
        required:true
    },
    users:{
        type:[String],
        default:[]
    },
    actions:{
        type:[ActionSchema],
        default:[]
    },
    nextUser:{
        type:String,
        default:""
    },
    workFlow:{
        type:String,
        default:""
    }
});

var RoundRobinApproval = new Schema({
    
    level:{
        type:Number,
        unique:true,
        required:true
    },
    users:{
        type:[String],
        default:[]
    },
    actions:{
        type:[ActionSchema],
        default:[]
    },
    processedUser:{
        type:[String],
        default:[]
    },
    workFlow:{
        type:String,
        default:""
    }
});

var AnyOneApproval = new Schema({

    level:{
        type:Number,
        unique:true,
        required:true
    },
    users:{
        type:[String],
        default:[]
    },
    actions:{
        type:[ActionSchema],
        default:[]
    },
    processedUser:{
        type:[String],
        default:[]
    },
    workFlow:{
        type:String,
        default:""
    }

});

module.exports={
    SequentialApproval: mongoose.model('SequentialApproval',SequentialApproval),
    RoundRobinApproval: mongoose.model('RoundRobinApproval',RoundRobinApproval),
    AnyOneApproval    : mongoose.model('AnyOneApproval',AnyOneApproval)
};