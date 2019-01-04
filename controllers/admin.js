'use strict'


module.exports=function(formidable,Club,aws){
    return {
        setRouting: function(router){
            router.get('/dashboard',this.adminpage);

            router.post('/uploadFile',aws.Upload.any(),this.uploadFile);
            router.post('/dashboard',this.adminpostpage);
        },

        adminpage:function(req,res){
            res.render('admin/dashboard');
        },
        adminpostpage:function(req,res){
            const newclub=new Club();
            newclub.name=req.body.club;
            newclub.country=req.body.country;
            newclub.image=req.body.upload;
            

            newclub.save(function(err){
                if(err)
                {
                    console.log('error saving data to aws');
                }
                res.redirect('/dashboard');
            })
        },

        uploadFile:function(req,res){
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
        }


    }
}