$(function(){
    var currentObj = JSON.parse(localStorage.getItem("recipeObj"));
    var $ingredientObjects = currentObj.recipe.ingredients;
    console.log($ingredientObjects);
    var produce = []
    var $ingredientSearch;

    //forEach function to seperate out the badWords
    $ingredientObjects.forEach(function(value){
        var badWords = ['1/2', 'cup']
        produce = []
        var ingredientSplit = value.text.split([' ']);
        ingredientSplit = ingredientSplit.filter(val => !badWords.includes(val));
        $ingredientSearch = ingredientSplit.join(" ");
        console.log($ingredientSearch);
        // $ingredients.push($ingredientSearch);

    // var badWords = ['1/2', 'cup']
    // var ingredientSplit = $ingredientObjects[1].text.split([' ']);
    // ingredientSplit = ingredientSplit.filter(val => !badWords.includes(val));
    // var ingredientSearched = ingredientSplit.toString();
    // var $ingredientSearch = ingredientSearched.replace(',', ' ');
    // console.log($ingredientSearch);
        $.get(`https://www.freshdirect.com/srch.jsp?searchParams=${$ingredientSearch}`)
        .done(function(response){
    //    let objResponse = JSON.parse(response);
    
        let results = $(response).find('.portrait-item-header-name');
        let price = $(response).find('.portrait-item-price');
    
        // console.log(results);
        // console.log(price);
           
    
        $(results).each(function(index, value){
            // console.log(value.innerText);
            // console.log(price[index].innerText);
    
            var prod = {};
            prod.item = value.innerText;
            prod.price = price[index].innerText;
    
            produce.push(prod);
            
            // $('#prices').text(prod.price);
        })

        // Add a loop that goes through your produce array and sends a function the object pulled
        // Create a function that appends a block to the HTML with the price of the object, the function will take in the object passed by the array
        console.log(produce);

        function choosePrice(array){
            console.log(array[0].item);
            return array[0].price;
        };
        console.log(choosePrice(produce));

        function priceSend(price){
            $listConstructor = $("<li>");
            $listConstructor.text(price);
            $("#prices").append($listConstructor);
        }

        console.log(priceSend((choosePrice(produce))));
    
        })
        .fail(function(error){
    
    
    })
    // $.get("https://www.freshdirect.com/browse.jsp?pageType=browse&id=veg&pageSize=30&all=false&activePage=1&sortBy=null&orderAsc=false&activeTab=product")
//     $.get(`https://www.freshdirect.com/srch.jsp?pageType=search&searchParams=ml mirin`)
//     .done(function(response){

// //    let objResponse = JSON.parse(response);
   

//     let results = $(response).find('.portrait-item-header-name');
//     let price = $(response).find('.portrait-item-price');
   

//     console.log(results);
//     console.log(price);
       

//     $(results).each(function(index, value){
//         console.log(value.innerText);
//         console.log(price[index].innerText);

//         var prod = {};
//         prod.item = value.innerText;
//         prod.price = price[index].innerText;

//         produce.push(prod);
//     })
   
//     console.log(produce);

//     })
//     .fail(function(error){

//     })
});
});