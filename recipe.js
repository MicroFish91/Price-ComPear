// If opening a bookmarked page, do the following
if (localStorage.getItem("currentBookmark") != null) {


    // Key for DOM Object
    let storageKey = localStorage.getItem("currentBookmark");
    let storageItem = localStorage.getItem(storageKey);
    let body = document.querySelector("body");
    let $note = $("<div>", {id: "bookmarkNote"});

    // Add new HTML Page
    body.innerHTML = "";
    body.innerHTML = storageItem;

    // Remove temporary link
    localStorage.removeItem("currentBookmark");

    // Add notice that age is not dynamic, only a current snapshot
    $note.text("This page is a snapshot and for reference only!");
    $("body").append($note);

} else {    
    // If not opening a bookmarked page, do the following
    // Initialize Variables
    var currentObj = JSON.parse(localStorage.getItem("recipeObj"));
    var $nutrientObjects = currentObj.recipe.totalNutrients;
    var calPerServ = Math.round(((currentObj.recipe.calories) / (currentObj.recipe.yield)) / 5) * 5;
    var nutrientPercent;
    var $nutrientBlock;
    var $listConstructor;
    var $nutrientConstructor;
    var savedPages;
    var indexTwo = 0;

    // Title
    $("#recipeTitle").text(currentObj.recipe.label);

    // Image
    $("#recipeImage").attr("src", currentObj.recipe.image);

    // Directions
    $("#directions").click(function(){

        document.location.href = currentObj.recipe.url;

    });

    // Save Recipe Button Click Event Handler
    $("#saveRecipe").click(function(){

        addFavorite();

    });

    // Bookmarked Button Click Event Handler
    $("#bookmarked").click(function(){
        document.location.href = "bookmarked.html";
    });


    // Append Ingredients to List - add to recipeEdit.js
    currentObj.recipe.ingredients.forEach(function(index){

        var $listConstructor = $("<li>",{"id": indexTwo});
        $listConstructor.text(index.text);
        $("#ingredientsList").append($listConstructor);
        
        //Creating checkboxes
        let $checkBox = $('<input>', {
            'type': 'checkbox',
            'class': 'listCheckbox',
            'id': "c" + indexTwo
        });
        $($checkBox).prop("checked", false);
        $($listConstructor).prepend($checkBox);

        indexTwo++;

    });

    createListener();

    // Add event listeners onto any li items in class "listCheckbox".  Will add an event listener that toggles a Line-through each checked item in ingredient list
    function createListener(){
        $('.listCheckbox').on('click', (event) => {
            
            let target = event.target.id;
            let checkboxes = document.querySelectorAll('.listCheckbox');

            // Puts index position of li item into target.
            target = target.slice(1, target.length);

            // Strikes out checkbox item
            $(`#${target}`).toggleClass('strike');
            
            checkboxes.forEach(function(index){
                $(index).prop("checked", false);
            })
            
        })
    }


    // Nutritional Breakdown
    // Calories Per Serving
    $("#calories").text(calPerServ);

    // % DV
    $("#dailyValue").text(Math.round(calPerServ / 2000 * 100) + " %");

    // Servings
    $("#servings").text(currentObj.recipe.yield);


    // Cycle through entire nutrient object passed by API and append each line into the nutritional breakdown table
    for(let key in $nutrientObjects){

        // Exclude Energy Parameter Since Already Captured Calories Above
        if ($nutrientObjects[key].label != "Energy"){
            
            // If a corresponding %DV object was not returned by API, manually assign percentage to avoid errors
            if (currentObj.recipe.totalDaily[key] == undefined){
                nutrientPercent = 0;
            } else {
                nutrientPercent = currentObj.recipe.totalDaily[key].quantity;
            }

            // Call nutrient block constructor to create a line in the nutritional breakdown table to append
            $nutrientBlock = nutrientBlockConstructor($nutrientObjects[key].label, Math.round($nutrientObjects[key].quantity / currentObj.recipe.yield), $nutrientObjects[key].unit, Math.round(nutrientPercent / currentObj.recipe.yield));

            // Append new block into the nutritional breakdown, will show up as a new nutrient line in the table
            $("#nutritionLabel").append($nutrientBlock);
        }

    }

}

// ------------------------------ End main --------------------------------

// Creates a Nutrient Block to Append to the Bottom Half of the Nutritional Breakdown Section; Pass function the nutrient name, amount and percent; returns back a DOM Element (Object) to append
function nutrientBlockConstructor(name, amount, unit, percent){
    
    if (percent == 0) {
        percent = "-";
    } else {
        percent += " %";
    }

    // Initialize Element Objects to Match HTML Format
    var $nutrientBlock = $("<div>", {class: "row nutritionItem"});
    var $nutrientName = $("<div>", {class: "col-6 nutrientName"});
    var $nutrientAmount = $("<div>", {class: "col-3 nutrientAmount"});
    var $nutrientPercent = $("<div>", {class: "col-3 nutrientPercent"});

    // Add Passed Text Content
    $nutrientName.text(name);
    $nutrientAmount.text(amount + " " + unit);
    $nutrientPercent.text(percent);

    // Append Objects into the Highest-Level Block
    $nutrientBlock.append($nutrientName);
    $nutrientBlock.append($nutrientAmount);
    $nutrientBlock.append($nutrientPercent);

    return $nutrientBlock;

}


function addFavorite(){
    
    var body = document.body.innerHTML;
    var $title = $("#recipeTitle").text();
    var tableOfContents = JSON.parse(localStorage.getItem("tableOfContents"));

    // If item has not been previously entered
    if (localStorage.getItem($title) === null){
        tableOfContents.push($title);
    }

    // Add back table of contents into local storage
    localStorage.setItem("tableOfContents", JSON.stringify(tableOfContents));

    // Add current DOM into local storage
    localStorage.setItem($title, body);

}