var mongoose=require('mongoose');
const passport= require('passport');
var Schema=mongoose.Schema;


var passportLocalMongoose=require('passport-local-mongoose');

var User=new Schema({
    phonenumber:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    admin:{
        type:Boolean,
        default:false,
    }
});
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);