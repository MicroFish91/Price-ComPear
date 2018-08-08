var produceList = [];

$(function(){

    // Initialize variables
    var listArray = document.querySelector("#ingredientsList").children;
    var ingredientItem;
    
    // Cycle through list elements
    for (let index = 0; index < listArray.length; index++){
    
    // Clear produceList
    produceList = [];

    // Ingredient Item Filter, ingredient item will eventually equal all list elements after filter is applied
    ingredientItem = filterIngredient(listArray[index].textContent);

    // Get searched produce list from Fresh Direct
    setTimeout(getSearchList(ingredientItem, produceList));
    console.log(produceList);

    } // End for
}); // End ready function


function filterIngredient(ingredientString){
        
        // Initialize Variables
        var excludeWords = ['1/2', 'cup', 'fresh', 'freshly'];
        var ingredientArray = ingredientString.split(" ");

        // Filter array to exclude words for excludeWords array
        ingredientArray = ingredientArray.filter(word => !excludeWords.includes(word));

        // Convert back to string
        ingredientString = ingredientArray.join(" ");
        
        return ingredientString;
}

// Pass search parameter, receive back list of scraped object (name, price) from Fresh Direct
function getSearchList(searchParameter, produceList){

    var produce = {};

    // Call Fresh Direct to read through HTML DOM
    $.get(`https://www.freshdirect.com/srch.jsp?pageType=search&searchParams=${searchParameter}`)
            .done(function(freshDOM){

                let $results = $(freshDOM).find('.portrait-item-header-name');
                let $price = $(freshDOM).find('.portrait-item-price');

                // Cycle through all searches and store results in a produce object
                $($results).each(function(index, value){

                    // Create produce items systematically
                    produce = {};

                    produce.name = value.innerText;
                    produce.price = $price[index].innerText;
                    
                    // Store produce objects into a produce array
                    produceList.push(produce);

                })

                 
            }) // End .done
   
            .fail(function(error){
            }) // End .fail

        return produceList;
}