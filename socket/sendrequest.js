module.exports=function(io){
    io.on('connection',function(socket){
        socket.on('joinRequest',function(myreq,callback){
            socket.join(myreq.sender);
            
            callback();
        });

        socket.on('friendRequest',function(friend,callback){
            io.to(friend.receiver).emit('newlymessage',{
                from:friend.sender,
                to:friend.receiver
            });
            callback();
        });
    });
}