$(function() {

    var produce = [];
    setTimeout(function(){
        $.get("https://www.freshdirect.com/browse.jsp?pageType=browse&id=veg&pageSize=30&all=false&activePage=1&sortBy=null&orderAsc=false&activeTab=product")
        .done(function(response){

       // let objResponse = JSON.parse(response);
       

        let results = $(response).find('.portrait-item-header-name');
        let price = $(response).find('.portrait-item-price');
       

        //console.log(results);
           

        $(results).each(function(index, value){
            // console.log(value.innerText);
            // console.log(price[index].innerText);

            var prod = {};
            prod.item = value.innerText;
            prod.price = price[index].innerText;

            produce.push(prod);
        })
       
        console.log(produce);

    })
    .fail(function(error){

    })
     }, 3000);
   
});