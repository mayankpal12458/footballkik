module.exports=function(async,Users,Message,friendrequesthelper){
    return {
        setRouting:function(router){
            router.get('/chat/:name',this.getpvtchat);

            router.post('/chat/:name',this.postpvtchat);
        },

        getpvtchat:function(req,res){
            async.parallel([
                function(callback){
                    Users.findOne({'username':req.user.username}).populate('request.userId').exec(function(err, result){
                        callback(err,result);
                    });
                },
                function(callback){
                    Message.aggregate([
                        {$match:{$or:[{'senderName':req.user.username},{'receiverName':req.user.username}]}},
                        {$sort:{'createdAt':-1}},
                        {
                            $group:{"_id":{
                                "last-message-between":{
                                    $cond:[
                                        {
                                            $gt:[
                                                {$substr:["$senderName",0,1]},
                                                {$substr:["$receiverName",0,1]}]
                                        },
                                        {$concat:["$senderName"," and ","$receiverName"]},
                                        {$concat:["$receiverName"," and ","$senderName"]}
                                    ]
                                }
                            },"body":{$first:"$$ROOT"}
                        }
                        }],function(err,newresult){
                            const arr=[
                                {path:'body.sender',model:'User'},
                                {path:'body.receiver',model:'User'}
                            ];

                            Message.populate(newresult,arr,function(err,newresult1){
                                callback(err,newresult1);
                            });
                        }
                    )
                },

                function(callback){
                    Message.find({'$or':[{'senderName':req.user.username},{'receiverName':req.user.username}]})
                    .populate('sender').populate('receiver').exec(function(err,newresult3){
                        callback(err,newresult3);
                    })
                }
                
            ],function(err,results){
                const result1=results[0];
                const result2=results[1];
                const result3=results[2];

                const params=req.params.name.split('.');
                const nameparam=params[0];
                
                res.render('private/privatechat',{
                    title:'Footballkik- PrivateChat',
                    data:result1,
                    user:req.user,
                    chat:result2,
                    retrive:result3,
                    name:nameparam
                });

            });

        },

        postpvtchat:function(req,res,next){

            const params=req.params.name.split('.');
            const nameparam=params[0];

            async.waterfall([
                function(callback){
                   if(req.body.message){
                       Users.findOne({'username':nameparam},function(err,data){
                           
                           callback(err,data);
                       })
                   }
                },
                function(data,callback){
                    if(req.body.message){
                        const newmsg=new Message();
                        newmsg.sender=req.user._id;
                        newmsg.receiver=data._id;
                        newmsg.senderName=req.user.username;
                        newmsg.receiverName=data.username;
                        newmsg.message=req.body.message;
                        newmsg.userImage=req.user.userImage;
                        newmsg.createdAt=new Date();
                        

                        newmsg.save(function(err,result){
                            if(err)
                            {
                                return next(err);
                            }
                            
                            callback(err,result);
                        });
                    }

                }
            ],function(err,results){
                res.redirect('/chat/'+req.params.name);
            });

           
            

            friendrequesthelper.friendhelper(req,res,'/chat/'+req.params.name);
        }
    }
}