// Initialize Variables
var recipeObj = JSON.parse(localStorage.getItem("recipeObj"));
var currentObj = recipeObj.hits[0];
var $nutrientObjects = currentObj.recipe.totalNutrients;
var nutrientPercent;
var $nutrientBlock;
var $listConstructor;
var $nutrientConstructor;

// Clear Ingredients List
$("#ingredientsList").html("");

// Title

// Image
$("#recipeImage").attr("src", currentObj.recipe.image);


// Append Ingredients to List
currentObj.recipe.ingredients.forEach(function(index){
    $listConstructor = $("<li>");
    $listConstructor.text(index.text);
    $("#ingredientsList").append($listConstructor);
});


// Nutritional Breakdown
// Calories Per Serving
var calPerServ = Math.floor((currentObj.recipe.calories) / (currentObj.recipe.yield));
$("#calories").text(calPerServ);

// % DV
$("#dailyValue").text(Math.round(calPerServ / 2000 * 100) + " %");

// Servings
$("#servings").text(currentObj.recipe.yield);


// Nutrient Blocks
for(let key in $nutrientObjects){

    if ($nutrientObjects[key].label != "Energy"){
        
        if (currentObj.recipe.totalDaily[key] == undefined){
            nutrientPercent = 0;
        } else {
            nutrientPercent = currentObj.recipe.totalDaily[key].quantity;
        }

        $nutrientBlock = nutrientBlockConstructor($nutrientObjects[key].label, Math.round($nutrientObjects[key].quantity / currentObj.recipe.yield), $nutrientObjects[key].unit, Math.round(nutrientPercent / currentObj.recipe.yield));

        $("#nutritionLabel").append($nutrientBlock);
    }

}

// $("#nutritionLabel").append($test);

console.log(currentObj);


// Creates a Nutrient Block to Append to the Bottom Half of the Nutritional Breakdown Section; Pass function the nutrient name, amount and percent; returns back a DOM Element (Object)
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