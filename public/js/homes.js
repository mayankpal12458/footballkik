$(document).ready(function(){

   $('#favorite').on('submit',function(e){
       e.preventDefault();

       var id=$('#id').val();
       var clubname=$('#clubname').val();
   
       $.ajax({
           url:'/home',
           type:'POST',
           data:{
               id:id,
               clubname:clubname
           },
           success:function(){
               console.log(clubname);
           }
       });
   });
});