//API information
const ticketMaster = `https://app.ticketmaster.com/discovery/v2/events`;
const ticketApiKey = `JSvaCBLEbfONlapKvWM5RjNslD0khaFy`;

const weatherApi = `https://api.openWeatherMap.org`;
const weatherApiKey = `f896ee9ece73d272be5c85b563ebb01b`;

let latlong = "0,0";



function searchCity() {
    //sets city from search term
    const city = document.querySelector('#searchTerm').value;
   
    
    fetch(`${ticketMaster}?apikey=${ticketApiKey}&city=${city}&locale=*&classificationName=music`)
        .then(function (res) {
            console.log(res);
            return res.json();
        })
        .then(function (body) {
            console.log('body', body);
            const events = body._embedded.events;
            displayEvents(events);
        })
        .catch(function (error) {
            console.log(error)
        });
}

function displayEvents(events = []){
    $('#column0').empty();
    $('#column1').empty();
    $('#column2').empty();

    if(events.length > 0){
        for(i = 0; i < events.length; i++) {
            
            let eventCard = $(`<div id="eventCard-${i}">`).addClass('card m-2');
            

            $(`#column${i%3}`).append(eventCard);
        }
    }else{
        console.log('No events');
    }

}


