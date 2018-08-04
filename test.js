$(function(){

    // var apiKey = "549ed3588e947714bc867296eb0407f3";
    // var appID = "4237b061";
    // var url = `https://api.edamam.com/search?q=${$searchField}&app_id=${appID}&app_key=${apiKey}`;

    $('#search-button').click(function(e){
        e.preventDefault();
        var apiKey = "549ed3588e947714bc867296eb0407f3";
        var appID = "4237b061";
        var $searchField = $('#searchField').val();
        var url = `https://api.edamam.com/search?q=${$searchField}&app_id=${appID}&app_key=${apiKey}`;
    
    $.get(url)
    .done(function(response){
        console.log(response);
        recipeReturn(response);
    }) 
    .fail(function(error){
        console.log(error);
    })

    function recipeReturn(response){
        var theRecipe = response.hits.forEach(function(element){
            console.log(element.recipe.label)
            var ingred = element.recipe.ingredients;
            console.log(ingred);
        })
        console.log(theRecipe);
    }


    })


});

