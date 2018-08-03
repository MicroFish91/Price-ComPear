$(function() { 

    var apiKey = '6sv4apcjnrUpaeOI58SpDVB0mKbqUYpMnyLzOUK1';
    var listUrl = 'https://api.nal.usda.gov/ndb/list?format=json&lt=f&sort=n&api_key='


    $('#searchButton').on('click', (e) => {
            
        e.preventDefault();

        var $name = $('#searchText').val();
        console.log($name);

        $.get(listUrl + apiKey)
        // .done(function(response){')
        .done(function(response){
            
        console.log(response);
        })
        .fail(function(error) {
            // console.log(error);
                
        });
    })



    // var apiKey = '6sv4apcjnrUpaeOI58SpDVB0mKbqUYpMnyLzOUK1';
    // var url = 'https://api.nal.usda.gov/ndb/V2/reports?type=f&format=json&api_key='


    // $('#searchButton').on('click', (e) => {
            
    //     e.preventDefault();

    //     var $name = $('#searchText').val();
    //     console.log($name);

    //     $.get(url + apiKey + '&' + name)
    //     // .done(function(response){')
    //     .done(function(response){
            
    //     console.log(response);
    //     })
    //     .fail(function(error) {
    //         // console.log(error);
                
    //     });
    // })
})