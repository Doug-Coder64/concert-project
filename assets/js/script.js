//API information
const ticketMaster = `https://app.ticketmaster.com/discovery/v2/events`;
const ticketApiKey = `JSvaCBLEbfONlapKvWM5RjNslD0khaFy`;
let eventResponse = []

const googleAPI = 'AIzaSyDm-sEZEMtTC81g89Gx0Dn7Ie2Djc_1wog';

//prefills location to location saved in local storage  
if(localStorage.getItem('city')){
    $('#searchTerm').val(localStorage.getItem('city'));
}

function searchCity() {
    //sets city from search term
    const city = $('#searchTerm').val();

    if(city) {
    fetch(`${ticketMaster}?apikey=${ticketApiKey}&city=${city}&locale=*&classificationName=music`)
        .then(function (res) {
            console.log(res);
            return res.json();
        })
        .then(function (body) {
            console.log('body', body);
            eventResponse = body._embedded.events;
            localStorage.setItem('city', city);
            $('#searchTerm').removeClass('border-danger alert-danger');
            displayEvents(eventResponse);
        })
        .catch(function (error) {
            console.log(error)
        });
    } else {
        $('#searchTerm').addClass('border-danger alert-danger');
    }
}



function displayEvents(events = []) {

    //clears all event columns 
    $('#column0').empty();
    $('#column1').empty();
    $('#column2').empty();
    let genreArray = [];

    if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
            genreArray.push(events[i].classifications[0].genre.name)


            //image url from ticket master picked from image array with a 16_9 aspect ratio and image height greater than 150
            let imgArray = events[i].images;
            let eventImgUrl = "";
            for (j = 0; j < imgArray.length; j++) {
                if (imgArray[j].ratio === '16_9' && imgArray[j].height > 150) {
                    eventImgUrl = imgArray[j].url;
                    break;
                }
            }

            //main card container
            let eventCard = $(`<div id="eventCard-${i}">`).addClass('card m-2');

            //event image element
            let eventImageEl = $(`<img id="eventImg-${i}">`).addClass('card-img-top');
            eventImageEl.attr('src', eventImgUrl);


            //sub container for text on card
            let eventCardBody = $(`<div id="eventCardBody-${i}">`).addClass('card-body');

            eventCardBody.text(events[i]._embedded.venues[0].name);


            /* Start Of eventCardBody Contents */
            let eventTitle = $(`<h5 id="eventTitle-${i}">`).addClass('card-title');
            eventTitle.text(events[i]._embedded.attractions[0].name);

            let eventVenue = $(`<div id="eventVenue-${i}">`).addClass('card-text');
            eventVenue.text(events[i]._embedded.venues[0].name);
            
            let eventDate = $(`<div id="eventCardBody-${i}">`).addClass('card-text');
            eventDate.text(events[i].dates.start.localDate);

            let priceRange = $(`<div id="eventCardBody-${i}">`).addClass('card-text');
            
            //verifies there are prices to display
            if (events[i].priceRanges) {
                priceRange.text(`$${events[i].priceRanges[0].min} - $${events[i].priceRanges[0].max}`);
            }
            else {
                priceRange.text(`price at gate`);
            }

            let detailsButton = $(`<button type="button" id="${i}">Details</button>`).addClass('mt-3 card-text btn btn-dark');
            detailsButton.text("More Details");
            //detailsButton.attr("data-toggle", "modal");
           // detailsButton.attr("data-target", "#eventModal");
            detailsButton.click(function(e){eventDetails(this.id, events)});

            /* End of eventCardBody Contents */
            
            eventCardBody.append(eventVenue, eventTitle, eventDate, priceRange, detailsButton);
            eventCard.append(eventImageEl, eventCardBody);            
            

            //fills event columns left to right then top to bottom i%3 always = 0, 1 or 2 depending on value of i
            $(`#column${i % 3}`).append(eventCard);


        }
    } else {
        console.log('No events');
    }
    let filteredGenres = genreArray.filter((item, index) => genreArray.indexOf(item) === index)

    let genreEl = $("#genreDropdown");
    genreEl.empty();

    genreEl.attr('data-toggle', "dropdown");
        // empty genreEl with javascript
    for (let i = 0; i < filteredGenres.length; i++) {
        let genreDropdownEl = document.createElement("a");
        genreDropdownEl.textContent = filteredGenres[i];
        genreDropdownEl.classList.add("dropdown-item");
        genreDropdownEl.setAttribute("href", "#");
        genreEl.append(genreDropdownEl);
    }
}

function searchDate() {
    const startDate = new Date(document.querySelector('#datePicker').value);
    console.log(startDate);

    const endDate = new Date(document.querySelector('#datePicker2').value);
    console.log(endDate);
    console.log(eventResponse);
    let resultEventData = eventResponse.filter(function (a) {
        let eventDate = new Date(a.dates.start.dateTime);
        // extract all date strings
        return eventDate >= startDate && eventDate <= endDate;
    });
    if(startDate && endDate){
        displayEvents(resultEventData);
    }
}


function eventDetails(id, events){
    let concert = events[id];
    let venue = concert._embedded.venues[0]
    let venueLocation = `${venue.location.latitude},${venue.location.longitude}`;
    
    //sets Modal title to the Concerts name
    $('#eventModalLabel').text(concert.name);
    
    //Empties Modal Body to later append details 
    let modalBody = $('#eventModalBody');
    modalBody.empty();

    //Checks for Venue title and then adds it to H6 element
    let venueTitle = $("<h6>").addClass('h6');
    if(venue.name){  
        venueTitle.text(venue.name);
    }

    // Pulls multiple things from API call to fill Venue Address
    let venueAddressBox = $('<div>').addClass('m-2');
    if(venue.address.line1 && venue.city.name && venue.state.stateCode && venue.postalCode){
        venueAddressBox.text(`${venue.address.line1} ${venue.city.name}, ${venue.state.stateCode}, ${venue.postalCode}`);
    }

    //Parking details for venue
    let parkingDetails = $('<div>').addClass('m-2 card-text');
    if(venue.parkingDetail){
        parkingDetails.text(`${venue.parkingDetail}`);
    }
    
    // link for user to buy tickets
    let venueLink = $(`<a href=${concert.url} target="_blank">`).text("Buy Tickets Now");

    //Google Static Map API that pins the location of the venues location
    let locationMap = $('<img>').addClass('img');
    locationMap.addClass('m-2');
    if(venue.location){
        locationMap.attr('src', `https://maps.googleapis.com/maps/api/staticmap?center=${venueLocation}&zoom=15&size=250x250&markers=color:blue%7C${venueLocation}&key=${googleAPI}`);
        modalBody.append(venueTitle,locationMap, venueAddressBox, parkingDetails, venueLink);
    }
     

    $('#eventModal').modal('show');
}
