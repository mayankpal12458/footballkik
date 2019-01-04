'use strict'

module.exports=function(Users,async,Message,friendrequesthelper,aws,formidable){
    return {
        setRouting:function(router){
           router.get('/settings/profile',this.getprofile);
           router.get('/profile/:name',this.getoverview);

           router.post('/userupload',aws.Upload.any(),this.uploadprofile);

           router.post('/settings/profile',this.postprofile);
           router.post('/profile/:name',this.postoverview);
        },

        getprofile:function(req,res){
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
                
                
                res.render('user/profile',{
                    title:'Footballkik- Profile',
                    data:result1,
                    chat:result2,
                    user:req.user
                });

            });
        
        },
        

        postprofile:function(req,res){
            friendrequesthelper.friendhelper(req,res,'/settings/profile');

            async.waterfall([
                function(callback){
                    Users.findOne({
                        '_id':req.user._id
                    },function(err,result){
                        callback(err,result);
                    });
                },
                function(result,callback){
                    if(req.body.upload===null || req.body.upload===''){
                        Users.update({
                            '_id':req.user._id
                        },{
                            username:req.body.username,
                            fullname:req.body.fullname,
                            gender:req.body.gender,
                            mantra:req.body.mantra,
                            userImage:result.userImage,
                            country:req.body.country
                            
                        },{
                            upsert:true
                        },function(err,result){
                            //console.log(result);
                            callback(err,result);
                        });

                    }else if(req.body.upload!==null || req.body.upload!==''){
                        Users.update({
                            '_id':req.user._id
                        },{
                            username:req.body.username,
                            fullname:req.body.fullname,
                            gender:req.body.gender,
                            mantra:req.body.mantra,
                            userImage:req.body.upload,
                            country:req.body.country
                            
                        },{
                            upsert:true
                        },function(err,result){
                            //console.log(result);
                            callback(err,result);
                        });

                    }
                }
            ],function(err,results){
                res.redirect('/settings/profile');
            })
        },
        uploadprofile:function(){
            const form=new formidable.IncomingForm();
            

            form.on('file',function(field,file){
               
            });

            form.on('error',function(err){
                console.log(err);
            });

            form.on('end',function(){
                console.log('File upload is successfull');
            });

            form.parse(req);
        },

        getoverview:function(req,res){

            async.parallel([
                function(callback){
                    Users.findOne({'username':req.params.name}).populate('request.userId').exec(function(err, result){
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
               /* function(callback){
                    Users.findOne({'username':req.params.name}).populate('request.userId').exec(function(err, result){
                        callback(err,result);
                    });
                },*/
                
            ],function(err,results){
                const result1=results[0];
                const result2=results[1];
               // const result3=results[2];
                
                
                res.render('user/overview',{
                    title:'Footballkik- Overview',
                    data:result1,
                    //data1:result3,
                    chat:result2,
                    user:req.user
                });

            });
        },

        postoverview:function(req,res){
            friendrequesthelper.friendhelper(req,res,'/profile/'+req.params.name);

        }
        
    }
}