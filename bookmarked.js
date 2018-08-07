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
    var $div = $("<div>", {class: "listBlock"});
    var $a = $("<a>", {class: "listItem", id: index});

    // Add text to hyperlink
    $a.text((index + 1) + ". " + tableOfContents[index]);
    $a.attr("href", "#");

    // Append
    $div.append($a);
    $("#bookmarkSection").append($div);

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