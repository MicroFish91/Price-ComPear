// Declare Global Variables
var index = 0;
var objects = JSON.parse(localStorage.getItem("objectList"));
var totalList = objects.hits;

// Run automatically upon page loadout
$(function(){

    // Auto Display Twelve Cards
    displayTwelve(index);
    index += 12;

});

// On click, display 12 more cards
$("#display-button").click(function(){
    
    // Keeps adding 12 cards on each click, displays no more than 12 rows (48 cards) total
    if (index < 48){
        displayTwelve(index);
        index += 12;
    }

});

// Construct an Individual Card Element
function cardConstructor(imageURL, imageCaption, bodyText, index){

    // Initialize variables
    var $card = $("<div>", {class: "cards col-3 offset-1"});
    var $img = $("<img>", {class: "card-img-top", src: imageURL, alt: imageCaption});
    var $cardBody = $("<div>", {class: "card-body"});
    var $paragraph = $("<p>", {class: "card-text"});
    
    // Set card body text
    $paragraph.text(bodyText);

    // Record card number
    $card.attr("id", index);

    // Construct final block by by appending elements into card
    $cardBody.append($paragraph);
    $card.append($img);
    $card.append($cardBody);

    // Add Click Event Listener
    $card.click(function(event){
        cardClick(event);
    })

    return $card;

}

function cardClick(){

    var recipeObj = objects.hits[event.toElement.offsetParent.id];
    localStorage.removeItem("recipeObj");
    localStorage.setItem("recipeObj", JSON.stringify(recipeObj));
    console.log(recipeObj);
    document.location.href = "recipe.html";

}

// Append a Row of Cards (3)
function rowConstructor($cardOne, $cardTwo, $cardThree){

    // Initialize row holder
    var $cardRow = $("<div>", {class: "row cardCollector"});
    
    // Append passed in card DOM objects
    $cardRow.append($cardOne);
    $cardRow.append($cardTwo);
    $cardRow.append($cardThree);

    return $cardRow;

}

// Pass Current Index of Total List and Function will append 12 more cards
function displayTwelve(index){
    
    var $cardOne;
    var $cardTwo;
    var $cardThree;

    for(let loop = 0; loop < 3; loop++){

        $cardOne = cardConstructor(totalList[index].recipe.image, "Source: " + totalList[index].recipe.source, totalList[index].recipe.label, index);

        $cardTwo = cardConstructor(totalList[index + 1].recipe.image, "Source: " + totalList[index + 1].recipe.source, totalList[index + 1].recipe.label, index + 1);

        $cardThree = cardConstructor(totalList[index + 2].recipe.image, "Source: " + totalList[index + 2].recipe.source, totalList[index + 2].recipe.label, index + 2);

        $("#cardContainer").append(rowConstructor($cardOne, $cardTwo, $cardThree));
        index += 3;
    }

}
