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

$('#searchText').hide();
$('#findButton').hide();
$('#cancelButton').hide();
$('#updateButton').hide();
$('#ingredientBar').hide();
$('#measuresBar').hide();
$('#addButton2').hide();



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
    $('#addButton').hide();
    $('#removeButton').hide();
    $('#updateButton').show();
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

$('#updateButton').on('click', (e) => {
    $('#updateButton').hide();
    $('#addButton').show();
    $('#removeButton').show();
})

    // Add Button
    $('#addButton').on('click', (e) => {
        $('#addButton').hide();
        $('#removeButton').hide();
        $('#searchText').show();
        $('#findButton').show();
        $('#cancelButton').show();

        $('#cancelButton').on('click', (e) => {
            $('#searchText').hide();
            $('#findButton').hide();
            $('#cancelButton').hide();
            $('#addButton').show();
            $('#removeButton').show();
        })
        // Find Button
        $('#findButton').on('click', (e) => {
            
                // e.preventDefault();
                $('#ingredientsBar').find('option').remove();
                returnArray = [];
                //need to remove something
                // $('#ingredientBar').remove('');
        
                var $name$ = $('#searchText').val();
                var $name = $name$.toLowerCase();

                $('#searchText').hide();
                $('#findButton').hide();
        
                $.get(listUrl + apiKey + '&q=' + $name)
                
                .done(function(response){
                    console.log(response);
        
                    // 
                    response.list.item.forEach(function(e){
                                returnArray.push(e);
                                
                        
                    })
                    
                    $('#ingredientBar').text('');
                    $('#ingredientBar').show();
                    $('#measuresBar').show();
                    $('#addButton2').show();
                    // console.log(returnArray);
                    returnArray.forEach(function (e){
                        let $printArray= $('<option>', {
                        'text': e.name,
                        'id': 'itemBar'
                        });
                    $('#ingredientBar').append($printArray);
                    })
                    console.log('1st' + returnArray.length);


                    function createMeasuresBar(){
                        var measuresArray = [];
                        var $selected = $("#ingredientBar").val();
                        // Do we need to clear this?
                        $("#measuresBar").text('');
                        console.log('2nd before' + returnArray.length);
                        returnArray.forEach(function (e){
                            if($selected === e.name){
                                let foodID = e.ndbno;

                                let idUrl = 'https://api.nal.usda.gov/ndb/reports/?ndbno='
                                $.get(idUrl + foodID + '&' + 'type=b&format=json&api_key=' + apiKey)
                                .done(function(response){
                                    measuresArray = response.report.food.nutrients[0].measures;
                                    
                                    measuresArray.forEach(function (e){
                                        $measuresItem = $('<option>', {
                                        'text': e.label,
                                        'id': 'itemMeasuresBar'
                                        });
                                    $('#measuresBar').append($measuresItem);
                                    })
                                })
                            }
                        })
                    }
                    createMeasuresBar();
                    

                    $('#ingredientBar').change(function(){
                        createMeasuresBar();
                        
                    })

                        $('#addButton2').on('click', (e) => {
                            console.log(ingredientArray);
                            let $itemName = $("#ingredientBar").val();
                            let $measuresName = $('#measuresBar').val();
                            let addIngredientArray = {text:(`${$measuresName} ${$itemName}`), weight: '0'};
                            var $newIngr = $('<li>');
                            ingredientArray[0].recipe.ingredients.push(addIngredientArray);
                        
                            $('#ingredientsList').append($newIngr);
                            
                            $('#ingredientsList').empty();
                            ingredientArray[0].recipe.ingredients.forEach(function(index){
                                $listConstructor = $("<li>");
                                $listConstructor.text(index.text);
                                $("#ingredientsList").append($listConstructor);

                            });
                            
                            $('#addButton').show();
                            $('#removeButton').show();
                            $('#cancelButton').hide();
                            $('#addButton2').hide();
                            $('#cancelButton').hide();
                            $('#ingredientBar').hide();
                            $('#measuresBar').hide();
                            $('#searchText').val('');
                            $('#measuresBar').html('');
                            $("#measuresBar").text('');
                            $('#ingredientBar').html('');
                            $('#ingredientBar').text('');
                        })
                    
                                
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