$(document).ready(function() {
    var recipeObj = new Array();
    var recipeInfo = new Array();    
    var elementNames = new Array();
    var curView;
    elementNames = ["#home","#search", "#results", "#recipe", "#about"];
   
    $('#search-button').click(function(){
       	var keywords = $('#input-text').val();
        var url = "http://api.yummly.com/v1/api/recipes?q="+keywords+"&_app_id=4bcf4728&_app_key=b10229904b6cd56f18b8f3264bb29b48&";
	var recipes =  $.getJSON(url+"callback=?", function(data) {
            var j=0;
             $.each(data, function (i, item){ 
                //console.log (item);
                recipeObj[j] = item;
                j++;
             });   
	});

        recipes.complete (function (){
            $('#thumbnails').empty();
            $('#noresult-text').empty();
            show ("#results");
            
            $.each(recipeObj[3], function (i){
                var imgLink = (recipeObj[3][i]["smallImageUrls"][0]);
                if (imgLink != undefined){
                    if (imgLink.search(".jpg") != -1) {
                        imgLink = imgLink.replace(".s.jpg", ".l.jpg");
                    }
                    else if (imgLink.search(".png") != -1){
                        imgLink = imgLink.replace(".s.png", ".l.png");
                    }
                    createThumbnail (imgLink, i);
                }
            });
            console.log (recipeObj);
            if (recipeObj[1] == 0){
                $("#noresult-text").append ("<h2 style=\"text-align: center;\">No results were found! Try again.</h2>");
            }
        });
    });

     function createThumbnail (imgLink, i) {
         var appendThumb = ("<li class=\"span4\", id=\"imgThumb\", value=\"img"+i+"\"> <a href=\"#\"> <img src=\""+imgLink +"\"> </a> </li>");
         $(appendThumb).appendTo('#thumbnails');
     }
    
    $('#imgThumb').button().live('click',function(){
        var imgToShow = (this["attributes"].value.value).replace("img", "");
        var id = recipeObj[3][imgToShow]["id"];
        var url = "http://api.yummly.com/v1/api/recipe/"+id+"?&_app_id=4bcf4728&_app_key=b10229904b6cd56f18b8f3264bb29b48&";
        recipeInfo = new Array();
        var getData = $.getJSON(url+"callback=?", function(data){
            var j=0;
            $.each(data, function(i, item){
                recipeInfo[j] = item;
                j++;
            });
        });

        getData.complete (function() {
            console.log(recipeInfo);
            $('#recipePic').empty();
            $('#nutritionalList').empty();
            $('#ingredients').empty();

            $('#recipeTitle').text(recipeInfo[5]);
            var imgLink = recipeInfo[4][0]["hostedLargeUrl"];
            var appendPic = ("<div style=\"background:url(\""+imgLink+")\"> <img src=\""+recipeInfo[4][0]["hostedLargeUrl"]+"\"></div>");
            $(appendPic).appendTo('#recipePic');
            $.each(recipeInfo[1], function (i, item) {
                var appendRecipe = ("<li>"+recipeInfo[1][i]+"</li>");
                $(appendRecipe).appendTo('#ingredients');
            });

            $.each(recipeInfo[3], function (i, item) {
                var appendRecipe = ("<li>"+recipeInfo[3][i]["description"]+": "+recipeInfo[3][i]["value"]+"</li>");
                $(appendRecipe).appendTo('#nutritionalList');
            });
            
            $.each(recipeInfo, function(i, item){
                if (recipeInfo[i] != null){
                    $.each(recipeInfo[i], function (j){
                        if (recipeInfo[i]["sourceDisplayName"] != null) {
                            //alert ("alert");
                            $('#yes-button').attr("href", recipeInfo[i]["sourceRecipeUrl"]);
                        }
                    });
                }
            });
        });
        
        show ("#recipe");
    });

    $('#goback-button').click(function () {
        show('#search');
    });

    $('#brand').click(function(){
        show('#home');
    });

    $('#no-button').click(function() {
        show("#results");
    }); 
    $('#btn-search').click(function() {
        show("#search"); 
    });

    $('#start-search').click(function() {
        show("#search");
    });
    
    $('#btn-home').click(function(){
        show("#home");
    });

    $('#btn-about').click (function(){
        show('#about');
    });
    
    hideAll('quick');
    $("#home").show('slow');
    
    function show (id){
        if (curView != id){
            hideAll();
            $(id).show('slow');
            curView = id;
        }
    }
    function hideAll(mode){
        if (mode == 'quick'){
            $.each(elementNames, function(i){
                $(elementNames[i]).hide('fast');
            });
        }
        else {
            $.each(elementNames, function(i){
                $(elementNames[i]).hide('slow');
            });
        }
    };
});
