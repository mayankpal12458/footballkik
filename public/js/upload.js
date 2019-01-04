$(document).ready(function(){
    $('.upload-btn').on('click',function(){
        $('#upload-input').click();
    });

    $('#upload-input').on('change',function(){
        var uploadInput=$('#upload-input');

        if(uploadInput.val()!='')
        {
            var formdata=new FormData();
            formdata.append('upload',uploadInput[0].files[0]);

            $.ajax({
                url:'/uploadFile',
                type:'POST',
                data:formdata,
                processData:false,
                contentType:false,
                success:function(){
                    uploadInput.val('');
                }
                
            })
        }
    })
})