'use strict';

const passport=require('passport');
const User=require('../models/user');
const googlestrategy=require('passport-google-oauth').OAuth2Strategy;
const secret=require('../secret/secretfile');

passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});



passport.use(new googlestrategy({
    clientID:secret.google.clientID,
    clientSecret:secret.google.clientSecret,
    callbackURL:'http://localhost:3000/auth/google/callback',
    passReqToCallback:true

},function(req,accessToken,refreshToken,profile,done){
    User.findOne({google:profile.id},function(err,user){
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
            newuser.google=profile.id;;
            newuser.fullname=profile.displayName;
            newuser.username=profile.displayName;
            newuser.email=profile.emails[0].value;
            newuser.userImage=profile._json.image.url;
            
            newuser.save(function(err){
               
                return done(null,user);
            })
        }

        
    });
}));


