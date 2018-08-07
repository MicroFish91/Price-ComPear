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
var ingredientArray = [];
var $measuresBar;
var $measuresItem;
var indexTwo = 0;


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


ingredientArray.push(currentObj);
console.log(ingredientArray);

// Edit Button Function
$('#removeButton').on('click', (e) => {
    $('#ingredientsList').empty();
    ingredientArray[0].recipe.ingredients.forEach(function(index){
        $listConstructor = $("<li>", {"id": indexTwo});
        $listConstructor.text(index.text);
    
        $checkBox = $('<input>', {
            'type': 'checkbox',
            'class': 'listCheckbox',
            'id': "c" + indexTwo
        });

        $($listConstructor).prepend($checkBox)
        $("#ingredientsList").append($listConstructor);

        indexTwo++;
    });
    
    $('.listCheckbox').on('click', (event) => {

        let target = event.target.id;
        target = target.slice(1, target.length);

        $(`#${target}`).toggleClass('strike');
    })
})



    // Add Button
    $('#addButton').on('click', (e) => {
        $('#addButton').hide();
        $('#removeButton').hide();
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
            $('#ingredientBar').remove('');
    
            var $name$ = $('#searchText').val();
            var $name = $name$.toLowerCase();

            $searchNewIngredient.remove();
            $findButton.remove();
    
            $.get(listUrl + apiKey + '&q=' + $name)
            
            .done(function(response){
                console.log(response);
                console.log(response.list.item);
    
                response.list.item.forEach(function(e){
                            returnArray.push(e);
                    
                })
                let $itemBar= $('<select>', {
                    'id': 'ingredientBar'
                    });
                $("#ingredientsList").append($itemBar);
                // console.log(returnArray);
                returnArray.forEach(function (e){
                    // listName = e.name;
                    let $printArray= $('<option>', {
                    'text': e.name,
                    'id': 'itemBar'
                    });
                $($itemBar).append($printArray);
                })


                function createMeasuresBar(){
                    $measuresBar= $('<select>', {
                        'id': 'measuresBar'
                    });
                    $("#ingredientsList").append($measuresBar);

                    let $selected = $("#ingredientBar").val();
                    returnArray.forEach(function (e){
                        if($selected === e.name){
                            let foodID = e.ndbno;
                            let idUrl = 'https://api.nal.usda.gov/ndb/reports/?ndbno='
                            $.get(idUrl + foodID + '&' + 'type=b&format=json&api_key=' + apiKey)
                            .done(function(response){
                                let measuresArray = response.report.food.nutrients[0].measures;

                                measuresArray.forEach(function (e){
                                    $measuresItem = $('<option>', {
                                    'text': e.label,
                                    'id': 'itemMeasuresBar'
                                    });
                                $($measuresBar).append($measuresItem);
                                })
                            })
                        }
                    })
                }
                createMeasuresBar();
                createAddButton2();

                $('#ingredientBar').change(function(){
                    $('#measuresBar').remove();
                    $('#addButton2').remove();
                    createMeasuresBar();
                    createAddButton2();
                })

                function createAddButton2(){
                    let $addButton2 = $('<button>', {
                        'text': 'add',
                        'id': 'addButton2'
                    })
                    $("#ingredientsList").append($addButton2);

                    $('#addButton2').on('click', (e) => {
                        console.log(ingredientArray);
                        let $itemName = $("#ingredientBar").val();
                        let $measuresName = $('#measuresBar').val();
                        let addIngredientArray = {text:(`${$measuresName} ${$itemName}`), weight: '0'};
                        var $newIngr = $('<li>');
                        ingredientArray[0].recipe.ingredients.push(addIngredientArray);
                    
                        $('#ingredientsList').append($newIngr);
                        $('#addButton2').remove('');
                        $('#ingredientBar').remove('');
                        $('#measuresBar').remove('');
                        $('#ingredientsList').empty();
                        ingredientArray[0].recipe.ingredients.forEach(function(index){
                            $listConstructor = $("<li>");
                            $listConstructor.text(index.text);
                            $("#ingredientsList").append($listConstructor);

                        });
                        $('#addButton').show();
                        $('#removeButton').show();
                    })
                }
                            
                })
                        .fail(function(error) {
                            console.log(error);

                        })
    
            .fail(function(error) {
                console.log(error);
                    
            });

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