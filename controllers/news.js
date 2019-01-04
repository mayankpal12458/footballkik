
module.exports=function(){

    return{
        setRouting: function(router){
            router.get('/latest-football-news',this.latestfootballnews);
        },

        latestfootballnews:function(req,res){
            return res.render('news/footballnews',{
                title:'Football - latest News',
                user:req.user
            });
        }
    }
}