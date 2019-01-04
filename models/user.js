const mongoose= require('mongoose');
const bcrypt=require('bcrypt-nodejs');

const userSchema=mongoose.Schema({
    username:{
        type:String,
        unique:true,
        default:''
    },
    fullname:{
        type:String,
        unique:true,
        default:''
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        default:''
    },
    userImage:{
        type:String,
        default:'default.png'
    },
    facebook:{
        type:String,
        default:''
    },
    fbtokens:Array,
    google:{
        type:String,
        default:''
    },
    sentRequest:[{
        username:{type:String,default:''}
    }],
    request:[{
        userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        username:{type:String,default:''}
    }],
    friendsList:[{
        friendId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        friendname:{type:String,default:''}
    }],
    totalRequests:{ype:Number,default:0},
    gender:{
        type:String,
        default:''
    },
    country:{
        type:String,
        default:''
    },
    mantra:{
        type:String,
        default:''
    },
    favNationalTeam:[{
        teamName:{type:String,default:''}
    }],
    favPlayer:[{
        playerName:{type:String,default:''}
    }],
    favClub:[{
        clubName:{type:String}
    }]
   
});


userSchema.methods.setPassword=function(password)
{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
};

userSchema.methods.validuserpassword=function(password)
{
    return bcrypt.compareSync(password,this.password);
};

const User=module.exports=mongoose.model('User',userSchema);