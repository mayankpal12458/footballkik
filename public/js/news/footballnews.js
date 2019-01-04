$(document).ready(function(){
    loaddata('.paginate');
    return GetResults();
});
function GetResults(){
    $.ajax({
        url:'https://content.guardianapis.com/football?page-size=100&order-by=newest&show-fields=all&api-key=3f625a1a-e075-47c3-bbf2-806b093a56d9',
        type:'GET',
        dataType:'json',
        success:function(data){
            var results='';
            $.each(data.response.results,function(i){
                results+='<form class="paginate">';
                results+='<div class="col-md-12 news-post">';
                results+='<div class="row">';
                results+='<a href='+data.response.results[i].webUrl+' target="_blank" style="color:#4aa1f3; text-decoration:none;">';
                results+='<div class="col-md-2">';

                results+='<img src='+data.response.results[i].fields.thumbnail+' class="img-responsive"/>'
                results+='</div>'

                results+='<div class="col-md-10">';
                results+='<h4 class="news-date">'+new Date(Date.parse(data.response.results[i].webPublicationDate)).toDateString()+'</h4>';
                results+='<h3>'+data.response.results[i].webTitle+'</h3>'
                results+='<p class="news-text">'+data.response.results[i].fields.standfirst+'</p>'
                results+='</div>';


                results+='</a>';

                
                results+='</div>';
                results+='</div>';
                results+='</form>';

            });

            $('#newsResults').html(results);
            $('.paginate').slice(0,4).show();
        }

    })
}

function loaddata(form_id)
{
    $('#loadmore').on('click',function(e){
        e.preventDefault();
        $(form_id+":hidden").slice(0,4).slideDown();
        $('html,body').animate({
            scrollTop:$(this).offset().top
        },2000);
    });

    $('#linktop').on('click',function(){
        $('html,body').animate({
            scrollTop:0
        },500);
    })
}