$(document).ready(function(){

    var socket=io();
    const paramOne=func(window.location.pathname);
    
    var newParam=paramOne.split('.');
    $('#receiver_name').text('@'+newParam[0]);
   
    swap(newParam);

    var paramTwo=newParam[0]+'.'+newParam[1];

    socket.on('connect',function(){

        
        var params={
            room1:paramOne,
            room2:paramTwo
        }
        socket.emit('join pvtchat',params);
        socket.on('message display',function(){
            $('#reload').load(location.href + ' #reload');
        });
    }); 
    socket.on('new pvtmsg',function(data){
        var template=$('#message-template').html();
        var message=Mustache.render(template,{
            text:data.text,
            sender:data.sender
        });

        $('#messages').append(message);
    });

    $('#message_form').on('submit',function(e){
        var sender=$('#name-user').val();
        e.preventDefault();
        var msg=$('#msg').val();
        socket.emit('pvtmsg',{
            test:msg,
            room:paramOne,
            sender:sender
        },function(){
            $('#msg').val('');
        })
    });

    $('#send-message').on('click',function(){
        var msg=$('#msg').val();
        $.ajax({
            url:'/chat/'+paramOne,
            type:'POST',
            data:{
                message:msg
            },
            success:function(){
                $('#msg').val('');
            }
        });
    });
        


    
});


function func(uri)
{
    if(uri===undefined)
        {
            uri=window.location.pathname;
        }
        var value1=window.location.pathname;
        var value2=value1.split('/');
        var value3=value2.pop();

        return value3;
        
    
}
function swap(input)
{
    var temp=input[0];
    input[0]=input[1];
    input[1]=temp;
}