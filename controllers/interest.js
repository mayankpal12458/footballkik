'use strict'

module.exports=function(Users,async,Message,friendrequesthelper){
    return {
        setRouting:function(router){
           router.get('/settings/interests',this.getinterest);

            router.post('/settings/interests',this.postinterest);
        },

        getinterest:function(req,res){
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
                }
            ],function(err,results){
                const result1=results[0];
                const result2=results[1];
                
                
                res.render('user/interest',{
                    title:'Footballkik- Profile',
                    data:result1,
                    chat:result2,
                    user:req.user
                });

            });
        
        },

        postinterest:function(req,res){
            friendrequesthelper.friendhelper(req,res,'/settings/interests');

            async.parallel([
                function(callback){
                    if(req.body.favClub){
                        Users.update({
                            '_id':req.user._id,
                            'favClub.clubName':{$ne:req.body.favClub}
                        },{
                            $push:{favClub:{
                                clubName:req.body.favClub
                            }
                            }}
                            ,function(err,result1){
                                console.log(result1);
                                callback(err,result1);
                        })
                    }
                }
            ],function(err,results){
                res.redirect('/settings/interests');
            });


            async.parallel([
                function(callback){
                    if(req.body.favPlayer){
                        Users.update({
                            '_id':req.user._id,
                            'favPlayer.playerName':{$ne:req.body.favPlayer}
                        },{
                            $push:{favPlayer:{
                                playerName:req.body.favPlayer
                            },function(err,result1){
                                callback(err,result1);
                            }}
                        })
                    }
                }
            ],function(err,results){
                res.redirect('/settings/interests');
            });

            async.parallel([
                function(callback){
                    if(req.body.favNatTeam){
                        Users.update({
                            '_id':req.user._id,
                            'favNationalTeam.teamName':{$ne:req.body.favNatTeam}
                        },{
                            $push:{favNationalTeam:{
                                teamName:req.body.favNatTeam
                            },function(err,result1){
                                callback(err,result1);
                            }}
                        })
                    }
                }
            ],function(err,results){
                res.redirect('/settings/interests');
            });
        }
        

       
    }
}