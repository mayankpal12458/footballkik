'use strict';

const passport=require('passport');
const User=require('../models/user');
const localstrategy=require('passport-local').Strategy;

passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});

passport.use('local.signup',new localstrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    User.findOne({'email':email},function(err,user){
        if(err){
            return done(err);
        }
        if(user)
        {
            return done(null,false,req.flash('error','User with email already exists'));
        }

        const newuser=new User();
        newuser.fullname=req.body.username;
        newuser.username=req.body.username;
        newuser.email=req.body.email;
        newuser.password=newuser.setPassword(req.body.password);

        newuser.save(function(err){
            if(err)
            {
                console.log(err);
                return;
            }
            done(null,newuser);
        });
    });
}));


passport.use('local.login',new localstrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},function(req,email,password,done){
    User.findOne({'email':email},function(err,user){
        if(err){
            return done(err);
        }
        const messages=[];

        if(!user || !user.validuserpassword(password))
        {
            messages.push('email does not exist or password is invalid');
            return done(null,false,req.flash('error',messages));
        }
        return done(null,user);

    });
}));
