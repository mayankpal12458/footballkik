module.exports=function(io,Users){
    const users=new Users();
    
    io.on('connection',function(socket){
        console.log("server connected");

        socket.on('join',function(params,callback){
           socket.join(params.room);
           users.Adduserdata(socket.id,params.name,params.room);
           io.to(params.room).emit('userslist',users.Getuserslist(params.room));
            callback();
        });

        socket.on('createmessage',function(message,callback){
            io.to(message.room).emit('newmessage',{
                text:message.test,
                room:message.room,
                sender:message.sender,
                image:message.userpic
            });
            callback();
        });

        socket.on('disconnect',function(){
            var user=users.Removeuser(socket.id);
            if(user){
            io.to(user.room).emit('userslist',users.Getuserslist(user.room));}
        });
    });
}