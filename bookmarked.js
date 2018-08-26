var tableOfContents = JSON.parse(localStorage.getItem("tableOfContents"));
var objectList = JSON.parse(localStorage.getItem("objectList")).hits;

// Display all saved elements as hyperlinks
for(let index = 0; index < tableOfContents.length; index++){
    
    // Add each bookmarked page as a list item
    appendBlock(index);

}

// ----------------------------- End Main ----------------------------------


// Add each bookmarked page as a list item
function appendBlock(index){

    // Initialize Variables
    var $div = $("<div>", {class: "listBlock col-3 offset-1"});
    var $a = $("<a>", {class: "listItem", id: index});
    var $img = $("<img>", {class: "bookImage", id: `book${index}`})
    var $br = $("<br>");

    // Add text to hyperlink
    $a.html((index + 1) + ". " + tableOfContents[index]);
    $a.attr("href", "#");

    // Add Image
    $img.attr("src", findImage(localStorage.getItem(tableOfContents[index])));

    // Append
    $div.append($a);
    $div.append($br);
    $div.append($img);

    $("#bookmarkSection").append($div);
    $("#bookmarkSection").append("<br>");

    // objectList[index].recipe.image

    // Add Event Listener
    $(`#${index}`).click(function(event){

        bookmarkClick(event);

    });

}

// Event triggered when a bookmarked hyperlink is clicked
function bookmarkClick(event){
    
    var text = event.currentTarget.innerText;
    var arrayText = text.split(" ");

    // Take off number
    arrayText.splice(0, 1);
    text = arrayText.join(" ");

    // stores clicked item as bookmark
    localStorage.setItem("currentBookmark", text);

    document.location.href = "recipe.html";

}

function findImage (domString){
    
    var element = $("");
    element.innerHTML = domString;
    console.log($(element).find("img"));

}