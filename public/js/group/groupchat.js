$(document).ready(function(){
    var socket=io();

    var grpname=$('#grpname').val();
    var sender=$('#sender').val();
    var userpic=$('#user-image').val();

    socket.on('connect',function(){
        console.log('client connected');

        var params={
            room:grpname,
            name:sender
        }

        socket.emit('join',params,function(){
            console.log('user connected to room');
        });
    });
    socket.on('userslist',function(users){
        var ol=$('<ol></ol>');
        for(var i=0;i<users.length;i++)
        {
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
        }

        $(document).on('click','#val',function(){
            $('#name').text('@'+$(this).text());
            $('#receiverName').val($(this).text());
            $('#nameLink').attr('href','/profile/'+$(this).text());
        });

        $('#numValue').text('('+users.length+')');
        $('#users').html(ol);
    })

    socket.on('newmessage',function(data){
        var template=$('#message-template').html();
        var message=Mustache.render(template,{
            text:data.text,
            sender:data.sender,
            userimage:data.image
        });

        $('#messages').append(message);
    });


    $('#message-form').on('submit',function(e){
        e.preventDefault();
        var msg=$('#msg').val();
        socket.emit('createmessage',{
            test:msg,
            room:grpname,
            sender:sender,
            userpic:userpic
        },function(){
            $('#msg').val('');
        });

        $.ajax({
            url:'/group/'+grpname,
            type:'POST',
            data:{
                message:msg,
                groupName:grpname
            },
            success:function(){
                $('#msg').val('');
            }

        })
    });



    
});