//Getting ingredient list from local storage
var ingredientObject = JSON.parse(localStorage.getItem("recipeObj"));

var ingredientObj = ingredientObject.recipe.ingredients;
var duplicateObj = ingredientObject.recipe.ingredients;
var nutrientArray = [];
var listHTML = document.querySelector('#ingredientsList').innerHTML;

//Defining variables
var newIngredientObject;
var nutritionUpdate;

// USDA Nutrition API SEARCH url
var listUrl = 'https://api.nal.usda.gov/ndb/search/?format=json&sort=r&max=100&offset=0&ds=Standard Reference&api_key=';

var apiKey = '6sv4apcjnrUpaeOI58SpDVB0mKbqUYpMnyLzOUK1';


// Append ingredients to list
function appendIngredients(newObject, indexTwo){

    var $ingredientsList = $('#ingredientsList');

    // Add in HTML Code for New List (Passed via global variable)
    $ingredientsList.html(listHTML);

    var $listConstructor = $("<li>",{"id": indexTwo});
    $listConstructor.text(newObject.text);
    $("#ingredientsList").append($listConstructor);

    let $checkBox = $('<input>', {
        'type': 'checkbox',
        'class': 'listCheckbox',
        'id': "c" + indexTwo
    });

    $($checkBox).prop("checked", false);
    $($listConstructor).prepend($checkBox)

    createListener();

}


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

// Find Button
$('#findButton').on('click', (e) => {

    // Remove bars if button is pushed out of order
    $('#ingredientBar').remove();
    $('#measuresBar').remove();

    // Define search input
    var inputName = $('#textSearch').val();
    var $name = inputName.toLowerCase();

    $.get(listUrl + apiKey + '&q=' + $name)
    .done(function(response){

        // temp array to store api response info
        var tempArray = [];

        console.log(response);
        
        // Migrate API search results into temp array
        response.list.item.forEach(function(e){
            tempArray.push(e);
        })

        // Create ingredient bar
        let $itemBar= $('<select>', {
            'id': 'ingredientBar'
            });
        $("#buttonBox").append($itemBar);

        // Cycle through api return and create ingredient selection bar items
        tempArray.forEach(function (e){
            let $printArray= $('<option>', {
            'text': e.name,
            'class': 'itemBar'
            });
            
            $('#ingredientBar').append($printArray);
        })

        createMeasuresBar(tempArray);

        // Remove and Add on a New Measurement Bar if an Item Selection has been made
        $('#ingredientBar').change(function(e){
            $("#measuresBar").remove();
            createMeasuresBar(tempArray);
        })
    // end of .get search api
    })
    
    .fail(function(error) {
        console.log(error);
    });
// end of find button    
})

// Create Measurement Selection Bar for use when refining search on ingredients from USDA Nutritional Database
function createMeasuresBar(array){
    //Create measures bar
    let $measuresBar= $('<select>', {
        'id': 'measuresBar'
        });
    $("#buttonBox").append($measuresBar);

    // Takes the user's selected ingredient and stores the text value
    var $selected = $('#ingredientBar').find(":selected").text();

    //Cycle through api return and retrieve ndbno number for selected item
    array.forEach(function (e){
        
        if($selected === e.name){
            let foodID = e.ndbno;
        
            // Use found ndbno number to retrieve measurement info
            $.get('https://api.nal.usda.gov/ndb/reports/?ndbno=' + foodID + '&' + 'type=b&format=json&api_key=' + apiKey)
            .done(function(response){
                console.log('2nd api response');
                console.log(response);

                // define array of measurements
                let tempArray2 = response.report.food.nutrients[0].measures;
                console.log('temp array 2');
                console.log(tempArray2);

                // Cycle through measures array and create measures bar items
                tempArray2.forEach(function (e){
                    $measuresItem = $('<option>', {
                        'text': e.label,
                        'class': 'itemMeasuresBar'
                        });
                    $('#measuresBar').append($measuresItem);
                })
            
                // Update Global Variable to hold the chosen food object as returned by USDA database
                nutritionUpdate = response.report.food;
   
            })

            .fail(function(error) {
                console.log(error);

            })
        // end of ndbno if statement    
        }
    // end of forEach to find measures    
    })
// end of createMeasuresBar function
}

// Add button function
$('#addButton').on('click', (e) => {

    // Prevent Page Refresh
    e.preventDefault();

    var indexTwo = document.querySelectorAll('li').length;

    listHTML = document.querySelector('#ingredientsList').innerHTML;

    // Store Text Search Values
    var $selected = $('#ingredientBar').find(":selected").text();
    var $selected2 = $('#measuresBar').find(":selected").text();

    newIngredientObject =  {text:(`${$selected2} ${$selected}`), weight: 0};

    console.log(newIngredientObject);

    ingredientObj.push(newIngredientObject);

    // Clear Fields
    $('#ingredientsList').html('');
    $("#ingredientBar").remove();
    $("#measuresBar").remove();
    $('#textSearch').val('');

    // Refresh List with new Items
    appendIngredients(newIngredientObject, indexTwo);
    nutritionAdd();

})

// Remove button click function (need to add)



function nutritionAdd(){

    var nutritionName = Array.from(document.querySelectorAll(".nutrientName"));
    var nutritionAmount = Array.from(document.querySelectorAll(".nutrientAmount"));
    var nutritionPercent = Array.from(document.querySelectorAll(".nutrientPercent"));

    nutritionName.forEach(function(nutritionLine, nutritionIndex){

        (nutritionUpdate.nutrients).forEach(function(nutritionData){

            // If Neither are blank
            if (nutritionLine.textContent != undefined && nutritionData.name != undefined){

                // Check if any similar words
                if ((intersect(nutritionLine.textContent.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace("Vitamin", "").split(" "), nutritionData.name.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace("Vitamin", "").split(" "))).length == 0){
                    // Do nothing if false
                } else {
                    // If true
                    nutritionBreakdown(nutritionIndex, nutritionData.value);
                }
            }

        });

    });

}

// Returns intersection of two arrays
function intersect(arrayOne, arrayTwo) {

    var transferArray;

    // Remove blanks from front of array
    while (arrayOne[0] == ""){
        arrayOne.shift();
    }

    while (arrayTwo[0] == ""){
        arrayTwo.shift();
    }

    // If arrayTwo is larger, switch arrays
    if (arrayTwo.length > arrayOne.length) {
    
        transferArray = arrayTwo;
        arrayTwo = arrayOne;
        arrayOne = transferArray;

    }

    return arrayOne.filter(function (element) {
        return arrayTwo.indexOf(element) > -1;
    });

}


function nutritionBreakdown(currentIndex, updatedAmount){

    if (updatedAmount != undefined && updatedAmount != 0 && updatedAmount != "") {

        // Set up Variables
        var nutritionName = Array.from(document.querySelectorAll(".nutrientName"));
        var currentCalories = document.querySelector("#calories");
        var currentDV = document.querySelector("#dailyValue");
        var servings = parseInt(document.querySelector("#servings").textContent);
        var nutritionAmount = (Array.from(document.querySelectorAll(".nutrientAmount")))[currentIndex];
        var nutritionPercent = (Array.from(document.querySelectorAll(".nutrientPercent")))[currentIndex];
        var nutritionAmountValue = 0;
        var nutritionAmountValueOne;
        var nutritionPercentValue = 0;
        var newCals = 0;
        var tempArray;

        // Adjust Calories and %DV
        if (nutritionName[currentIndex].textContent == "Fat" || nutritionName[currentIndex].textContent == "Saturated" || nutritionName[currentIndex].textContent == "Trans" || nutritionName[currentIndex].textContent == "Monounsaturated" || nutritionName[currentIndex].textContent == "Polyunsaturated") {
            newCals = updatedAmount * 9;
        } else if (nutritionName[currentIndex].textContent == "Carbs" || nutritionName[currentIndex].textContent == "Sugars" || nutritionName[currentIndex].textContent == "Protein") {
            newCals = updatedAmount * 4;
        } else if (nutritionName[currentIndex].textContent == "Alcohol"){
            newCals = updatedAmount * 7;
        }

        currentDV.textContent = Math.round((parseInt(currentCalories.textContent) + newCals) * 100 / 2000).toString() + " %";
        currentCalories.textContent = Math.round(((parseInt(currentCalories.textContent) + newCals) / 5) * 5);

        // Filter Current Raw Amount from String
        nutritionAmountValueOne = parseInt(nutritionAmount.textContent.split(" ").splice(0, 1).join(""));
        nutritionAmountValue = Math.round(nutritionAmountValueOne + updatedAmount / servings);
        tempArray = nutritionAmount.textContent.split(" ");
        tempArray.shift();
        tempArray.unshift(nutritionAmountValue);
        nutritionAmount.textContent = tempArray.join(" ");
    
        // Check if percentage was set, if so, set value
        if (nutritionPercent.textContent != "-" && nutritionAmountValueOne != 0 && nutritionAmountValue != 0 && nutritionAmountValue != nutritionAmountValueOne){

            nutritionPercentValue = parseInt(nutritionPercent.textContent.split(" ").splice(0, 1).join("")) / 100;
            nutritionPercentValue = Math.round(nutritionPercentValue * nutritionAmountValue / nutritionAmountValueOne * 100);
            tempArray = nutritionPercent.textContent.split(" ");
            tempArray.shift();
            tempArray.unshift(nutritionPercentValue);
            nutritionPercent.textContent = tempArray.join(" ");

        }
    }
}