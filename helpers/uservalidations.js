'use strict'

module.exports=function()
{
    return {
        signupvalidation:function(req,res,next)
        {
            req.checkBody('username',"Username is required").notEmpty();
            req.checkBody('email',"Email is required").notEmpty();
            req.checkBody('email',"Email is invalid").isEmail();
            req.checkBody('password',"Username is required").notEmpty();
            req.checkBody('password',"password must be greater than 5").isLength({min:5});

            req.getValidationResult().then(function(result){
                const errors=result.array();
                const messages=[];
                errors.forEach((error) => {
                    messages.push(error.msg);
                });

                req.flash('error',messages);
                res.redirect('/signup');
            })
            .catch(function(err){
                return next();
            })
        },

        loginvalidation:function(req,res,next)
        {
            
            req.checkBody('email',"Email is required").notEmpty();
            req.checkBody('email',"Email is invalid").isEmail();
            req.checkBody('password',"Username is required").notEmpty();
            req.checkBody('password',"password must be greater than 5").isLength({min:5});

            req.getValidationResult().then(function(result){
                const errors=result.array();
                const messages=[];
                errors.forEach((error) => {
                    messages.push(error.msg);
                });

                req.flash('error',messages);
                res.redirect('/');
            })
            .catch(function(err){
                return next();
            })
        }
    }
}