'use strict';

module.exports=function(_,passport,uservalidations){
    return{
        setRouting:function(router)
        {
            router.get('/',this.indexpage);
            router.get('/signup',this.getsignup);
            
            router.get('/auth/facebook',this.getfacebooklogin);
            router.get('/auth/facebook/callback',this.facebookcallback);
            router.get('/auth/google',this.getgooglelogin);
            router.get('/auth/google/callback',this.googlecallback);




            router.post('/signup',uservalidations.signupvalidation,this.postsignup);
            router.post('/',uservalidations.loginvalidation,this.postlogin);
        },
        indexpage: function(req,res)
        {
            const errors=req.flash('error');
            return res.render('index',{
                title:'Footballkik | Login',
                messages:errors,
                haserrors:errors.length > 0
            });
        },
        postlogin: passport.authenticate('local.login',{
            successRedirect:'/home',
            failureRedirect:'/',
            failureFlash:true
        }),

        getfacebooklogin:passport.authenticate('facebook',{
            scope:'email'
        }),
        facebookcallback:passport.authenticate('facebook',{
            successRedirect:'/home',
            failureRedirect:'/signup',
            failureFlash:true
        }),

        getgooglelogin:passport.authenticate('google',{
            scope:['https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read']
        }),
        googlecallback:passport.authenticate('google',{
            successRedirect:'/home', 
            failureRedirect:'/signup',
            failureFlash:true
        }),
        getsignup: function(req,res)
        {

            const errors=req.flash('error');
            return res.render('signup',{
                title:'Footballkik | SignUp',
                messages:errors,
                haserrors:errors.length > 0
            });
        },
        postsignup: passport.authenticate('local.signup',{
            successRedirect:'/home',
            failureRedirect:'/signup',
            failureFlash:true
        })
    }
}
