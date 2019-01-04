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
    socket.on('new refresh',function(){
        $('#reload').load(location.href + ' #reload');
    });
    });

   

    $(document).on('click','#messagelink',function(){
        var chatId=$(this).data().value;

        
        $.ajax({
            url:'/chat/'+paramOne,
            type:'POST',
            data:{
                chatId:chatId
            },
            success:function(){
                $(this).parent().eq(1).remove();
            }
        });
       socket.emit('refresh',{});
    })

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