'use strict';

const passport=require('passport');
const User=require('../models/user');
const fbstrategy=require('passport-facebook').Strategy;
const secret=require('../secret/secretfile');

passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});


passport.use(new fbstrategy({
    clientID:secret.facebook.clientID,
    clientSecret:secret.facebook.clientSecret,
    profileFields:['email','displayName','photos'],
    callbackURL:'http://localhost:3000/auth/facebook/callback',
    passReqToCallback:true

},function(req,token,refreshToken,profile,done){
    User.findOne({facebook:profile.id},function(err,user){
        if(err){
            return done(err);
        }
        if(user)
        {
            return done(null,user);
        }

        else
        {
            const newuser=new User();
            newuser.facebook=profile.id;
            newuser.username=profile.displayName;
            newuser.fullname=profile.displayName;
            newuser.email=profile._json.email;
            newuser.userImage='https://graph.facebook.com/'+profile.id+'/picture?type=large';
            newuser.fbtokens.push({token:token});
            newuser.save(function(err){
                return done(null,user);
            })
        }
    });
}));


