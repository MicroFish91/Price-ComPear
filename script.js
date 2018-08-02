var apiKey = 'bb47fb61ce03cd7f466ef23481b11e72'
var apiId = 'd6a69910'

var url = 'https://api.edamam.com/search?=chicken'

$.get(url + `&app_id=${apiId}` + `&app_key=${apiKey}`)
.done(function(response){
    console.log(response)
})
.fail(function(error){
    console.log(error);
});