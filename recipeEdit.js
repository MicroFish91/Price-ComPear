//Getting ingredient list from local storage
var ingredientObject = JSON.parse(localStorage.getItem("recipeObj"));

var ingredientObj = ingredientObject.recipe.ingredients;
var duplicateObj = ingredientObject.recipe.ingredients;
var nutrientArray = [];
var listHTML = document.querySelector('#ingredientsList').innerHTML;

//Defining variables
var indexTwo = 0;
var newIngredientObject;
var nutritionUpdate;

// USDA Nutrition API SEARCH url
var listUrl = 'https://api.nal.usda.gov/ndb/search/?format=json&sort=r&max=100&offset=0&ds=Standard Reference&api_key=';

var apiKey = '6sv4apcjnrUpaeOI58SpDVB0mKbqUYpMnyLzOUK1';


// Append ingredients to list
function appendIngredients(array){

    var indexTwo = 0;

    array.forEach(function(index){

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
        $($listConstructor).prepend($checkBox)

        indexTwo++;
    });

    createListener();

}


// Add event listeners onto any li items in class "listCheckbox".  Will add an event listener that toggles a Line-through each checked item in ingredient list
function createListener(){
    $('.listCheckbox').on('click', (event) => {
        
        let target = event.target.id;

        // Puts index position of li item into target.
        target = target.slice(1, target.length);

        // Strikes out checkbox item
        $(`#${target}`).toggleClass('strike');
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

    listHTML = document.querySelector('#ingredientsList').innerHTML;

    // Store Text Search Values
    var $selected = $('#ingredientBar').find(":selected").text();
    var $selected2 = $('#measuresBar').find(":selected").text();

    newIngredientObject =  {text:(`${$selected2} ${$selected}`), weight: 0};

    console.log(newIngredientObject);

    ingredientObj.push(newIngredientObject);

    console.log(ingredientObj); 

    // Clear Fields
    $('#ingredientsList').html('');
    $("#ingredientBar").remove();
    $("#measuresBar").remove();
    $('#textSearch').val('');

    // Refresh List with new Items
    appendIngredients(ingredientObj);   

})

// Remove button function
$('#removeButton').on('click', (e) => {

    // Prevent Page Refresh
    e.preventDefault();

    // Store Text Search Values
    var $selected = $('#ingredientBar').find(":selected").text();
    var $selected2 = $('#measuresBar').find(":selected").text();

    newIngredientObject =  {text:(`${$selected2} ${$selected}`), weight: 0};

    console.log(newIngredientObject);

    ingredientObj.push(newIngredientObject);

    console.log(ingredientObj); 

    // Refresh List with New Items
    appendIngredients(ingredientObj);

})





