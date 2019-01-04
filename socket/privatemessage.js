module.exports=function(io){
    io.on('connection',function(socket){

        socket.on('join pvtchat',function(pvtdata){
            socket.join(pvtdata.room1);
            socket.join(pvtdata.room2);
            
        });

        socket.on('pvtmsg',function(pvtdata1,callback){
            io.to(pvtdata1.room).emit('new pvtmsg',{
                text:pvtdata1.test,
                room:pvtdata1.room,
                sender:pvtdata1.sender
            });

            io.emit('message display',{});
            callback();
        });
        socket.on('refresh',function(){
            io.emit('new refresh',{});
        })

    });
}