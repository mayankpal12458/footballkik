$(document).ready(function(){

    $('#favClubBtn').on('click',function(){
        var favClub=$('#favClub').val();
        
        var valid=true;

        if(favClub===''){
            valid=false;
            $('#error').html('<div class="alert alert-danger">Cannot submit empty field</div>')
        }else{
            $('#error').html('');
        }

        if(valid===true){
            $.ajax({
                url:'/settings/interests',
                type:'POST',
                data:{
                    favClub:favClub
                },
                success:function(){
                    setTimeout(function(){
                        window.location.reload();
                    },200)
                }
            });
        }else{
            return false;
        }
    });

    $('#favPlayerBtn').on('click',function(){
        var favPlayer=$('#favPlayer').val();
        
        var valid=true;

        if(favPlayer===''){
            valid=false;
            $('#error').html('<div class="alert alert-danger">Cannot submit empty field</div>')
        }else{
            $('#error').html('');
        }

        if(valid===true){
            $.ajax({
                url:'/settings/interests',
                type:'POST',
                data:{
                    favPlayer:favPlayer
                },
                success:function(){
                    setTimeout(function(){
                        window.location.reload();
                    },200)
                }
            });
        }else{
            return false;
        }
    });
   

    $('#favNatTeamBtn').on('click',function(){
        var favNatTeam=$('#favNatTeam').val();
        
        var valid=true;

        if(favNatTeam===''){
            valid=false;
            $('#error').html('<div class="alert alert-danger">Cannot submit empty field</div>')
        }else{
            $('#error').html('');
        }

        if(valid===true){
            $.ajax({
                url:'/settings/interests',
                type:'POST',
                data:{
                    favNatTeam:favNatTeam
                },
                success:function(){
                    setTimeout(function(){
                        window.location.reload();
                    },200)
                }
            });
        }else{
            return false;
        }
    });
   
});