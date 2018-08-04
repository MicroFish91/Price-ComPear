$(function(){

    var apiKey = "549ed3588e947714bc867296eb0407f3";
    var appID = "4237b061";
    var url;

    $("#search-button").click(function(event){

        event.preventDefault();
        url = parseURL(appID, apiKey);

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
    });


// Upon successful return from Recipe API
function updateSuccess(recipeObj){
    console.log(recipeObj);


}

// Failed to retrieve from Recipe API
function updateUIError(){

}


// Based on search parameters, return URL String
// Diet Label: balanced, high-protein, low-carb, low-fat
// Health Label: paleo, pescatarian, vegan, vegetarian, gluten-free, dairy-free, egg-free, soy-free, wheat-free, fish-free, shellfish-free, tree-nut-free, peanut-free, pork-free
function parseURL(appID, apiKey){
    
    var newURL;
    var $searchValue = $("#searchField").val();
    var healthLabelArray = getHealth();
    var dietLabelArray = getDiet();
    var filterParameters = "";

    // Add Diet Search Parameters
    for(let element of dietLabelArray){
        filterParameters += "&diet=" + element;
    }

    // Add Health Search Parameters
    for(let element of healthLabelArray){
        filterParameters += "&health=" + element;
    }
    
    // Create Recipe API URL
    newURL = `https://api.edamam.com/search?q=${$searchValue}&app_id=${appID}&app_key=${apiKey}&from=0&to=50${filterParameters}`;

    return newURL;
}

function getHealth(){

    var healthArray = [];

    if ($('#paleo').is(':checked')) {
        healthArray.push("paleo");
    }

    if ($('#pescatarian').is(':checked')) {
        healthArray.push("pescatarian");
    }

    if ($('#vegan').is(':checked')) {
        healthArray.push("vegan");
    }

    if ($('#vegetarian').is(':checked')) {
        healthArray.push("vegetarian");
    }

    if ($('#gluten').is(':checked')) {
        healthArray.push("gluten-free");
    }

    if ($('#dairy').is(':checked')) {
        healthArray.push("dairy-free");
    }

    if ($('#eggs').is(':checked')) {
        healthArray.push("egg-free");
    }

    if ($('#soy').is(':checked')) {
        healthArray.push("soy-free");
    }

    if ($('#wheat').is(':checked')) {
        healthArray.push("wheat-free");
    }

    if ($('#fish').is(':checked')) {
        healthArray.push("fish-free");
    }

    if ($('#shellfish').is(':checked')) {
        healthArray.push("shellfish-free");
    }

    if ($('#tree-nuts').is(':checked')) {
        healthArray.push("tree-nut-free");
    }

    if ($('#peanuts').is(':checked')) {
        healthArray.push("peanut-free");
    }

    if ($('#pork').is(':checked')) {
        healthArray.push("pork-free");
    }

    return healthArray;

}

function getDiet(){

    var dietArray = [];

    if ($('#balanced').is(':checked')) {
        dietArray.push("balanced");
    }

    if ($('#high-protein').is(':checked')) {
        dietArray.push("high-protein");
    }

    if ($('#low-carb').is(':checked')) {
        dietArray.push("low-carb");
    }

    if ($('#low-fat').is(':checked')) {
        dietArray.push("low-fat");
    }

    return dietArray;
}