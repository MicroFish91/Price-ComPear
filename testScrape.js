$(function(){

    var produce = []
    // $.get("https://www.freshdirect.com/browse.jsp?pageType=browse&id=veg&pageSize=30&all=false&activePage=1&sortBy=null&orderAsc=false&activeTab=product")
    $.get('https://www.freshdirect.com/srch.jsp?pageType=search&searchParams=iceberg+lettuce')
    .done(function(response){

//    let objResponse = JSON.parse(response);
   

    let results = $(response).find('.portrait-item-header-name');
    let price = $(response).find('.portrait-item-price');
   

    console.log(results);
    console.log(price);
       

    $(results).each(function(index, value){
        console.log(value.innerText);
        console.log(price[index].innerText);

        var prod = {};
        prod.item = value.innerText;
        prod.price = price[index].innerText;

        produce.push(prod);
    })
   
    console.log(produce);

    function newReturn(myString){
        for(x=0; x<myString.length; x++){
            if((myString[x]) % 2 === 0){
                console.log(x)
            }
            else if((myString[x]) % 1 === 0){
                console.log(x)
            }
        }
    }
    newReturn('adfkdafdf 3.09 dafadfaa');
    produce.price = newReturn(produce.price);

    })
    .fail(function(error){

    })

});