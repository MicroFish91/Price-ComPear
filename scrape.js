var produceList = [];
var indexTwo = 0;

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
    produceList = getSearchList(ingredientItem, produceList);


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

                postPrice(produceList);

                 
            }) // End .done
   
            .fail(function(error){
            }) // End .fail

        // return produceList;
}

// Takes an array and posts the price into return.html
function postPrice(produceList){

    var postElement = selectSearch(produceList);
    var $priceList = $("#priceList");
    var $li = $("<li>", {id: indexTwo});
    
    $li.text(postElement);

    console.log(produceList[0].name);

    $priceList.append($li); 

    indexTwo++;

}

// Takes an array of searches and filters out the most pertinent search, returns the object; right now just returning first element, will revisit later
function selectSearch(produceList){
    
    return produceList[0].price;
}