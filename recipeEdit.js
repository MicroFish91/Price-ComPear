//Getting ingredient list from local storage
var ingredientObject = JSON.parse(localStorage.getItem("recipeObj"));

var ingredientObj = ingredientObject.recipe.ingredients;
var duplicateObj = ingredientObject.recipe.ingredients;
console.log('ingredient obj');
console.log(ingredientObj);


//Defining variables
var indexTwo = 0;
var newIngredientObject;
var nutritionUpdate;

// USDA Nutrition API SEARCH url
var listUrl = 'https://api.nal.usda.gov/ndb/search/?format=json&sort=r&max=100&offset=0&ds=Standard Reference&api_key='

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
        $($checkBox).prop("checked", true);
        $($listConstructor).prepend($checkBox)

        indexTwo++;
    });
    createListener();
}
// appendIngredients(ingredientObj);



// Line-through each checked item in ingredient list

function createListener(){
    $('.listCheckbox').on('click', (event) => {
        console.log('event');
        console.log(event);
        let target = event.target.id;
        target = target.slice(1, target.length);
        $(`#${target}`).toggleClass('strike');
    })
}

createListener();

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

        console.log('search api response')
        console.log(response);
        response.list.item.forEach(function(e){
            tempArray.push(e);
        })
        console.log('temp array');
        console.log(tempArray);

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

        $('#ingredientBar').change(function(e){
            console.log('e change');
            console.log(e);
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






function createMeasuresBar(array){
    //Create measures bar
    let $measuresBar= $('<select>', {
        'id': 'measuresBar'
        });
    $("#buttonBox").append($measuresBar);

    var $selected = $('#ingredientBar').find(":selected").text();
    console.log('selected');
    console.log($selected);

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

                nutritionUpdate = response.report.food;

    
            // end of 2nd api get function    
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
    e.preventDefault();
    var $selected = $('#ingredientBar').find(":selected").text();
    var $selected2 = $('#measuresBar').find(":selected").text();
    newIngredientObject =  {text:(`${$selected2} ${$selected}`), weight: '0'};
    ingredientObj.push(newIngredientObject);
    $('#ingredientsList').html('');
    $("#ingredientBar").remove();
    $("#measuresBar").remove();
    $('#textSearch').val('');
    appendIngredients(ingredientObj);
    console.log('ingr obj');
    console.log(ingredientObj);
    console.log('nutrition update');
    console.log(nutritionUpdate);
    

})


var $nutrientName = $("<div>", {class: "col-6 nutrientName"});
console.log('nutrient name');
console.log($nutrientName);
console.log(ingredientObject);


