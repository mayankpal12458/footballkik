module.exports=function(async,Club,Users){
    return {
        setRouting:function(router){
            router.get('/results',this.getresults);
            router.get('/members',this.getmembers);


            router.post('/results',this.postresults);
            router.post('/members',this.postmembers);
        },

        getresults:function(req,res)
        {
            res.redirect('/home');
        },
        getmembers:function(req,res){
            async.parallel([
                function(callback){
                    
                    Users.find({},function(err,result){
                        callback(err,result);
                    });
                    
                }
            ],function(err,results){
                const res1=results[0];

                const datachunk=[];
                const chunksize=4;
                for(var i=0;i<res1.length;i+=chunksize)
                {
                    datachunk.push(res1.slice(i,i+chunksize));
                }

                return res.render('members',{
                    chunks:datachunk,
                    title:'Footballkik-Members',
                    user:req.user
                });
            });
            
        },
        postmembers:function(req,res){
            const regex=new RegExp((req.body.memberssearch) ,'gi');
           
            async.parallel([
                function(callback){
                    
                    Users.find({'username':regex},function(err,result){
                        callback(err,result);
                    });
                    
                }
            ],function(err,results){
                const res1=results[0];

                const datachunk=[];
                const chunksize=4;
                for(var i=0;i<res1.length;i+=chunksize)
                {
                    datachunk.push(res1.slice(i,i+chunksize));
                }

                return res.render('members',{
                    chunks:datachunk,
                    title:'Footballkik-Members',
                    user:req.user
                });
            });
        },

        postresults:function(req,res){
            async.parallel([
                function(callback){
                    const regex=new RegExp((req.body.country) ,'gi');
                    Club.find({'$or':[{'country':regex},{'name':regex}]},function(err,result){
                        callback(err,result);
                    })
                    
                }
            ],function(err,results){
                const res1=results[0];
                const datachunk=[];
                const chunksize=3;
                for(var i=0;i<res1.length;i+=chunksize)
                {
                    datachunk.push(res1.slice(i,i+chunksize));
                }

                return res.render('results',{
                    chunks:datachunk,
                    title:'Footballkik-Results',
                    user:req.user
                });
            });
        }

    }
}