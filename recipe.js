// Initialize Variables
var currentObj = JSON.parse(localStorage.getItem("recipeObj"));
var $nutrientObjects = currentObj.recipe.totalNutrients;
var calPerServ = Math.round(((currentObj.recipe.calories) / (currentObj.recipe.yield)) / 5) * 5;
var nutrientPercent;
var $nutrientBlock;
var $listConstructor;
var $nutrientConstructor;
var $xButton;
var $searchNewIngredient;
var $findButton;
var returnArray = [];
console.log(currentObj);

// USDA Nutrition API url
var listUrl = 'https://api.nal.usda.gov/ndb/search/?format=json&sort=r&max=100&offset=0&ds=Standard Reference&api_key='
var apiKey = '6sv4apcjnrUpaeOI58SpDVB0mKbqUYpMnyLzOUK1';

// Title

// Image
$("#recipeImage").attr("src", currentObj.recipe.image);


// Append Ingredients to List
currentObj.recipe.ingredients.forEach(function(index){
    $listConstructor = $("<li>");
    $listConstructor.text(index.text);
    $("#ingredientsList").append($listConstructor);
});

// Edit Button Function
$('#editIngredientsButton').on('click', (e) => {
    $('#ingredientsList').empty();
    console.log(currentObj.recipe.ingredients);
    currentObj.recipe.ingredients.forEach(function(index){
        $listConstructor = $("<li>");
        $listConstructor.text(index.text);
        $("#ingredientsList").append($listConstructor);
    
        $xButton = $('<button>', {
            'text': 'x',
            'id': 'xButton'
        });

        $($listConstructor).append($xButton)
    });
    
    $addButton = $('<button>', {
        'text': 'add item',
        'id': 'addButton'
    });

    $("#ingredientsList").append($addButton)


    // Add Button
    $('#addButton').on('click', (e) => {
        $addButton.remove();
        $searchNewIngredient = $('<input>', {
            'type': 'text',
            'id': 'searchText'
        })
        $("#ingredientsList").append($searchNewIngredient);

        $findButton = $('<button>', {
            'text': 'find',
            'id': 'findButton'
        })
        $("#ingredientsList").append($findButton);

        // Find Button
        $('#findButton').on('click', (e) => {
        
            e.preventDefault();
    
            returnArray = [];
            $('#browsers').remove('');
    
            var $name$ = $('#searchText').val();
            var $name = $name$.toLowerCase();
            $searchNewIngredient.remove();
            $findButton.remove();
    
            $.get(listUrl + apiKey + '&q=' + $name)
            
            .done(function(response){
                // console.log(response);
    
                response.list.item.forEach(function(e){
                    let productName = e.name.toLowerCase();
                    let wordCheck1 = productName.search($name);
    
                    if(wordCheck1 >= 0){
                        // console.log(e.group)
                        if((e.group !== 'Baby Foods')){
                            returnArray.push(e);
                        }
                    }   
                })
                let $itemBar= $('<select>', {
                    'id': 'browsers'
                    });
                $("#ingredientsList").append($itemBar);
                // console.log(returnArray);
                returnArray.forEach(function (e){
                    // listName = e.name;
                    let $printArray= $('<option>', {
                    'text': e.name,
                    'id': 'itemReturn'
                    });
                $($itemBar).append($printArray);
                })
                $addButton2 = $('<button>', {
                    'text': 'add',
                    'id': 'addButton2'
                })
                $("#ingredientsList").append($addButton2);

                $('#addButton2').on('click', (e) => {
                    let $selected = $("#browsers").val();
                    var $newIngr = $('<li>');
                    $($newIngr).text($selected);
                    $("#ingredientsList").append($newIngr);
                    returnArray.forEach(function (e){
                        if($selected === e.name){
                            let foodID = e.ndbno;
                            let idUrl = 'https://api.nal.usda.gov/ndb/reports/?type=b&format=json&api_key='
                            $.get(idUrl + apiKey + '&ndbno=' + foodID)
                            .done(function(response){
                                console.log(response);
                            })
                            .fail(function(error) {
                                console.log(error);
                                    
                            });
                        }
                    })
                })
            })
    
            .fail(function(error) {
                console.log(error);
                    
            });

        })
    })
})




// Nutritional Breakdown
// Calories Per Serving
$("#calories").text(calPerServ);

// % DV
$("#dailyValue").text(Math.round(calPerServ / 2000 * 100) + " %");

// Servings
$("#servings").text(currentObj.recipe.yield);

console.log(currentObj);
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