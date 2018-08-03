<<<<<<< HEAD
$(function(){

    var apiKey = "549ed3588e947714bc867296eb0407f3";
    var appID = "4237b061";
    var $searchValue = "chicken";
    var url = `https://api.edamam.com/search?q=${$searchValue}&app_id=${appID}&app_key=${apiKey}`;

    $.get(url)
    // Successful object retrieval from Recipe API
    .done(function(recipeObj) {
        updateSuccess(recipeObj);	
    })
    // Failed to retrieve from Recipe API
    .fail(function(error) {
        
        console.log(error);
        updateUIError();	
    });
});


// Upon successful return from Recipe API
function updateSuccess(recipeObj){
    console.log(recipeObj);
}

// Failed to retrieve from Recipe API
function updateUIError(){

}

// Based on search parameters, return URL String
function parseURL(){

}
=======
var apiKey = 'bb47fb61ce03cd7f466ef23481b11e72'
var apiId = 'd6a69910'

var url = 'https://api.edamam.com/api/nutrition-details'

$.get(url + `&app_id=${apiId}` + `&app_key=${apiKey}`)
.done(function(response){
    console.log(response)
})
.fail(function(error){
    console.log(error);
});
>>>>>>> travisBranch1
