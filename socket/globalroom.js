module.exports=function(io,Global,_){

    const globalclass=new Global();
    io.on('connection',function(socket){
        socket.on('global room',function(global){
            socket.join(global.room);

            globalclass.EnterRoom(socket.id,global.name,global.room,global.img);

            const nameprop=globalclass.Getroomlist(global.room);

            const arr=_.uniqBy(nameprop,'name');
            

            io.to(global.room).emit('loggedInUser',arr);
            
        });

        socket.on('disconnect',function(){
            const user=globalclass.Removeuser(socket.id);
            if(user){
                var userdata=globalclass.Getroomlist(user.room);

                const arr=_.uniqBy(userdata,'name');
                const removedata=_.remove(arr,{
                     'name':user.name
                });
                
            io.to(user.room).emit('loggedInUser',arr);}
        });
    });
}