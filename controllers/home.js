'use strict'

module.exports=function(_,async,Club,Users,Message,friendrequesthelper){
    return {
        setRouting: function(router)
        {
            router.get('/home',this.homepage);
            router.get('/logout',this.logout);

            router.post('/home',this.homepostpage);
        },

        homepage:function(req,res)
        {
            async.parallel([
                function(callback){
                    Club.find({},function(err,results){
                        callback(err,results);
                    })
                },function(callback){
                    Club.aggregate([{
                        $group:{
                            _id:"$country"
                        }
                    }],function(err,newresult){
                        callback(err,newresult); 
                    });
                },
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
            ],function(err,result){
                const res1=result[0];
                const res2=result[1];
               // console.log(res2);
                const res3=result[2];
                const res4=result[3];


                const datachunk=[];
                const chunksize=3;
                for(var i=0;i<res1.length;i+=chunksize)
                {
                    datachunk.push(res1.slice(i,i+chunksize));
                }

                const countrysort=_.sortBy(res2,'_id');
                
                return res.render('home',{
                    title:'Footballkik | home',
                    chunks:datachunk,
                    data:res3,
                    chat:res4,
                    user:req.user,
                    country:countrysort
                });
            })
            
        },

        homepostpage:function(req,res)
        {
            async.parallel([
                function(callback){
                    Club.update({
                        '_id':req.body.id,
                        'fans.username':{$ne:req.user.username}
                    },
                    {
                        $push:{fans:{
                            username:req.user.username,
                            email:req.user.email
                        }}
                        
                    },function(err,count)
                    {
                        callback(err,count);
                    });
                }
            ],function(err,results){
                
                res.redirect('/home');
            });

            friendrequesthelper.friendhelper(req,res,'/home');
        },
        logout:function(req,res){
            req.logout();
            req.session.destroy(function(){
    
                
                res.redirect('/');
            });
    
        }

        
    }
}