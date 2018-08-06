$(function(){
    var currentObj = JSON.parse(localStorage.getItem("recipeObj"));
    var $ingredientObjects = currentObj.recipe.ingredients;
    console.log($ingredientObjects);
    var produce = []
    var badWords = ['1/2', 'cup']
    var ingredientSplit = $ingredientObjects[0].text.split([' ']);
    ingredientSplit = ingredientSplit.filter(val => !badWords.includes(val));
    var ingredientSearch = ingredientSplit.toString();
    var $ingredientSearch = ingredientSearch.replace(',', ' ');
    console.log($ingredientSearch);
        $.get(`https://www.freshdirect.com/srch.jsp?searchParams=${$ingredientSearch}`)
        .done(function(response){
    //    let objResponse = JSON.parse(response);
    
        let results = $(response).find('.portrait-item-header-name');
        let price = $(response).find('.portrait-item-price');
    
        // console.log(results);
        // console.log(price);
           
    
        $(results).each(function(index, value){
            console.log(value.innerText);
            console.log(price[index].innerText);
    
            var prod = {};
            prod.item = value.innerText;
            prod.price = price[index].innerText;
    
            produce.push(prod);
            
            
        })
       
        // console.log(produce);
    
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