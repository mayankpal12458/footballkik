$(document).ready(function(){
    $('.add-btn').on('click',function(){
        $('#add-input').click();
    });

    $('#add-input').on('change',function(){
        var addInput=$('#add-input');

        if(addInput.val()!='')
        {
            var formdata=new FormData();
            formdata.append('upload',addInput[0].files[0]);

            $('#completed').html('File Uploaded Successfully');
            $.ajax({
                url:'/userupload',
                type:'POST',
                data:formdata,
                processData:false,
                contentType:false,
                success:function(){
                    addInput.val('');
                }
                
            });
        }
        saveimg(this);
    });


    $('#profile').on('click',function(){
        var username=$('#username').val();
        var fullname=$('#fullname').val();
        var country=$('#country').val();
        var gender=$('#gender').val();
        var mantra=$('#mantra').val();
        var userimg=$('#add-input').val();
        var image=$('#user-img').val();

        var valid=true;

        if(userimg==='')
        {
            $('#add-input').val(image);
        }



        if(username=='' || fullname=='' || country=='' || gender=='' || mantra==''){
            valid=false;
            $('#error').html('<div class="alert alert-danger">Cannot submit empty field</div>')
        }else{
            userimg=$('#add-input').val();
            $('#error').html('');
        }
        if(valid===true){
            $.ajax({
                url:'/settings/profile',
                type:'POST',
                data:{
                    username:username,
                    fullname:fullname,
                    gender:gender,
                    country:country,
                    mantra:mantra,
                    upload:userimg
                },
                success:function(){
                    setTimeout(function(){
                        window.location.reload();
                    },200)
                }
            })
        }else{
            return false;
        }

    })
});

function saveimg(input){
    if(input.files && input.files[0])
    {
        var reader=new FileReader();
        reader.onload=function(e){
            $('#show_img').attr('src',e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}