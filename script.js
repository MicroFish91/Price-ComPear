$(function(){

    var apiKey = "549ed3588e947714bc867296eb0407f3";
    var appID = "4237b061";
    var url = `https://api.edamam.com/search?q=${$searchValue}&app_id=${appID}&app_key=${apiKey}`;

    console.log(url);

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
// Diet Label: [1. balanced, 2. high-protein, 3. low-carb, 4. low-fat]
// Health Label: [1. crustacean-free, 2. dairy-free, 3. egg-free, 4. fish-free, 5. gluten-free, 6. paleo, 7. peanut-free, 8. pescatarian, 9. pork-free, 10. soy-free, 11. vegan, 12. vegetarian]
function parseURL(appID, apiKey){
    
    var newURL;
    var $searchValue = "chicken";
    var healthLabelArray = ["balanced", "high-protein"];
    var dietLabelArray = ["dairy-free", "gluten-free", "paleo"];
    var filterParameters = "";

    // Add Diet Search Parameters
    for(let element in dietLabelArray){
        filterParameters += "&" + element;
    }

    // Add Health Search Parameters
    for(let element in healthLabelArray){
        filterParameters += "&" + element;
    }
    
    // Create Recipe API URL
    newURL = `https://api.edamam.com/search?q=${$searchValue}&app_id=${appID}&app_key=${apiKey}&from=0&to=50${filterParameters}`;

    return newURL;
}

function getHealth(){

}

function getDiet(){

}
