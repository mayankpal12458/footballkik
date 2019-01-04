const express=require('express');
const bodyparser=require('body-parser');
const ejs=require('ejs');
const http=require('http');
const container=require('./container');

const cookieparser=require('cookie-parser');
const expressvalidator=require('express-validator');
const session=require('express-session');
const mongostore=require('connect-mongo')(session);
const mongoose=require('mongoose');
const flash=require('connect-flash');
const passport=require('passport');
const socketio=require('socket.io');
const {Users}=require('./helpers/UsersClass');
const {Global}=require('./helpers/Global');
const compression=require('compression');
const helmet=require('helmet');



container.resolve(function(users,_,admin,home,group,results,privatechat,news,profile,interest){
    mongoose.Promise=global.Promise;
    
    //mongoose.connect('mongodb://dbuserfootball:mayankpal19@ds149344.mlab.com:49344/footballkik',{ useNewUrlParser: true });
    mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true });

    const app=setupexpress();

    function setupexpress()
    {
        const app=express();
        const server=http.createServer(app);

        const io=socketio(server);
        server.listen(process.env.PORT || 3000,function(){
            console.log('Listening on port 3000');
        });

        configureexpress(app);

        require('./socket/groupchat')(io,Users);
        require('./socket/sendrequest')(io);
        require('./socket/globalroom')(io,Global,_);
        require('./socket/privatemessage')(io);


        const router=require('express-promise-router')();

        users.setRouting(router);
        admin.setRouting(router);
        home.setRouting(router);
        group.setRouting(router);
        results.setRouting(router);
        privatechat.setRouting(router);
        news.setRouting(router);
        profile.setRouting(router);
        interest.setRouting(router);


        app.use(router);

        app.use(function(req,res){
            res.render('404');
        })
        

        function configureexpress(app)
        {

            app.use(compression());
            app.use(helmet());
           
            require('./passport/passport-local');
            require('./passport/passport-facebook');
            require('./passport/passport-google');

            app.use(express.static('public'));
            app.use(cookieparser());
            app.set('view engine','ejs');
           // app.use(bodyparser.json());
            app.use(bodyparser.urlencoded({extended:true}));

            app.use(expressvalidator());
            app.use(session({
                secret:'process.env.SECRET_KEY',
                resave:true,
                saveUninitialized:false,
                store:new mongostore({mongooseConnection:mongoose.connection})
            }))
            app.use(flash());

            app.use(passport.initialize());
            app.use(passport.session());

            app.locals._ = _;

           
        }
    }
})