$(document).ready(function(){
    var socket=io();

    socket.on('connect',function(){
        

        var room='GlobalRoom';
        var name=$('#name-user').val();
        var img=$('#user-image').val();
        
        socket.emit('global room',{
            room:room,
            name:name,
            img:img
        });

        socket.on('message display',function(){
            $('#reload').load(location.href + ' #reload');
        });


    });

    socket.on('loggedInUser',function(val){
        
        var friends=$('.friend').text();
        var friend=friends.split('@');
        var name=$('#name-user').val();
        var ol=$('<div></div>');
        var arr=[];
        

        for(var i=0;i<val.length;i++)
        {
            if(friend.indexOf(val[i].name)>-1)
            {
                arr.push(val[i]);
                var userName=val[i].name;

                var list='<img src="https://placehold.it/300x300" class="pull-left img-circle" style="width:50px; margin-right:10px;"/></p>' +
                '<a id="val1" href="/chat/'+userName+'.'+name+'"><h3 style="padding-top:15px;color:gray;font-size:14px;">' + '@'+val[i].name+'<span class="fa fa-circle online_friend"></span></h3></a></p>'

                ol.append(list);
            }
        }

        $('#numOfFriends').text('('+arr.length+')');

        $('.onlineFriends').html(ol);
    });
});