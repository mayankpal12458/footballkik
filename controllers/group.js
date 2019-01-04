'use strict'

module.exports=function(Users,async,Message,friendrequesthelper,Group){
    return {
        setRouting:function(router){
            router.get('/group/:name',this.grouppage);
            router.get('/logout',this.logout);
            

            router.post('/group/:name',this.postfrienddatasave);
        },

        grouppage:function(req,res){
            var name=req.params.name;

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
                   Group.find({}).populate('sender').exec(function(err,result){
                       callback(err,result);
                   });
                }
            ],function(err,results){
                const result1=results[0];
                const result2=results[1];
                const result3=results[2];
                
                res.render('groupchat/group',{
                    title:'Footballkik- Group',
                    grpname:name,
                    retrivegrp:result3,
                    data:result1,
                    chat:result2,
                    user:req.user
                });

            });

            
        },

        postfrienddatasave:function(req,res){
            
            friendrequesthelper.friendhelper(req,res,'/group/'+req.params.name);

            async.parallel([
                function(callback){
                    if(req.body.message){
                    const newgroup=new Group();
                    newgroup.sender=req.user._id;
                    newgroup.body=req.body.message;
                    newgroup.name=req.body.groupName;
                    newgroup.createdAt=new Date();
                    newgroup.save(function(err,newresult){
                        console.log(newresult);
                        callback(err,newresult)
                    });
                }

                }
            ],function(err,results){
               
               res.redirect('/group/'+req.params.name);
            })
        
        },
        logout:function(req,res){
            req.logout();
            req.session.destroy(function(){
    
                
                res.redirect('/');
            });
    
        }
    }
}