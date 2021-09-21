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

    //clears all event columns 
    $('#column0').empty();
    $('#column1').empty();
    $('#column2').empty();

    if(events.length > 0){
        for(i = 0; i < events.length; i++) {
            
            
            //image url from ticket master picked from image array with a 16_9 aspect ratio and image height greater than 150
            let imgArray = events[i].images;
            let eventImgUrl = "";
            for(j = 0; j < imgArray.length; j++){
                if(imgArray[j].ratio === '16_9' && imgArray[j].height > 150){
                    eventImgUrl = imgArray[j].url;
                    break;
                }
            }

            //main card container
            let eventCard = $(`<div id="eventCard-${i}">`).addClass('card m-2');
            
            //event image element
            let eventImageEl = $(`<img id="eventImg-${i}">`).addClass('card-img-top');
            eventImageEl.attr('src', eventImgUrl);
            


            //event title element lists first artists name
            let eventTitle = $(`<h5 id="eventTitle-${i}">`).addClass('card-title');
            eventTitle.text(events[i]._embedded.attractions[0].name);

            //sub container for text on card
            let eventCardBody = $(`<div id="eventCardBody-${i}">`).addClass('card-body');
            eventCardBody.text(events[i]._embedded.venues[0].name);

            let eventDate = $(`<div id="eventCardBody-${i}">`).addClass('card-body');
            eventDate.text(events[i].dates.start.localDate);
        
            console.log(events[i]);

            let priceRange = $(`<div id="eventCardBody-${i}">`).addClass('card-body');
            if (events[i].priceRanges) {
             priceRange.text(`$${events[i].priceRanges[0].min} - $${events[i].priceRanges[0].max}`);
            }
            else {
                priceRange.text(`price at gate`);
            }
            
            
            
            

            
            
            eventCardBody.append(eventTitle);
            eventCard.append(eventImageEl);
            eventCard.append(eventCardBody);
            eventCardBody.append(eventDate);
            eventCardBody.append(priceRange);
            

            

            //fills event columns left to right then top to bottom i%3 always = 0, 1 or 2 depending on value of i
            $(`#column${i%3}`).append(eventCard);

            
        }
    }else{
        console.log('No events');
    }


    // $(document).ready(function(){
 
    //     $('#datepicker').datepicker({
    //      format: "mm-dd-yy",
    //      startDate: '-1y -1m',
    //      endDate: '+2m +10d'
    //     });
      
    //     $('#datepicker2').datepicker({
    //      format: "mm-dd-yy",
    //      startDate: '-1m',
    //      endDate: '+10d'
    //     }); 
    //   });

}
