//API information
const ticketMaster = `https://app.ticketmaster.com/discovery/v2/events`;
const ticketApiKey = `JSvaCBLEbfONlapKvWM5RjNslD0khaFy`;
let eventResponse = []


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
            eventResponse = body._embedded.events;
            displayEvents(eventResponse);
        })
        .catch(function (error) {
            console.log(error)
        });
}



function displayEvents(events = []) {

    //clears all event columns 
    $('#column0').empty();
    $('#column1').empty();
    $('#column2').empty();
    let genreArray = []

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

            let eventDate = $(`<div id="eventCardBody-${i}">`).addClass('card-text');
            eventDate.text(events[i].dates.start.localDate);

            let priceRange = $(`<div id="eventCardBody-${i}">`).addClass('card-text');
            if (events[i].priceRanges) {
                priceRange.text(`$${events[i].priceRanges[0].min} - $${events[i].priceRanges[0].max}`);
            }
            else {
                priceRange.text(`price at gate`);
            }
            /* End of eventCardBody Contents */

            eventCardBody.append(eventTitle, eventDate, priceRange);
            eventCard.append(eventImageEl, eventCardBody);

            //fills event columns left to right then top to bottom i%3 always = 0, 1 or 2 depending on value of i
            $(`#column${i % 3}`).append(eventCard);


        }
    } else {
        console.log('No events');
    }
    console.log(genreArray);
    let filteredGenres = genreArray.filter((item, index) => genreArray.indexOf(item) === index)
    console.log(filteredGenres);

    let genreEl = document.querySelector("#genreDropdown");
    function clearBox(genreEl)
{
    document.getElementById(genreEl).innerHTML = "";
}
//seems like there is no built in funciton's but in jquery 
$(genreEl).empty();
        // empty genreEl with javascript
    for (let i = 0; i < filteredGenres.length; i++) {
        let genreDropdownEl = document.createElement("a");
        genreDropdownEl.textContent = filteredGenres[i]
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
        let eventDate = new Date(a.dates.start.dateTime)
        console.log(eventDate);
        // extract all date strings
        console.log(eventDate >= startDate && eventDate <= endDate);
        return eventDate >= startDate && eventDate <= endDate

        return hitDateMatchExists;
    });
    console.log(resultEventData);
    displayEvents(resultEventData)
}


    // function getDateRange(startDate, endDate) 
    //     // Parse dd-mm-yyyy
    //     let qParse = s => {
    //       let [d, m, y] = s.split(/\D/);
    //       return new Date(y, m-1, d);
    //     };
    //     // Format date as dd-mm-yyyy
    //     let qFormat = d => {
    //       let z = n => (n<10? '0' : '') + n;
    //       return z(d.getDate())+'-'+z(d.getMonth()+1)+'-'+d.getFullYear();
    //     }
    //     // Setup for loop
    //     let start  = qParse(startDate);
    //     let end    = qParse(endDate);
    //     let result = [];
    //     // Loop from start to end, incrementing
    //     // the start date and writing to result array
    //     do {
    //       result.push(qFormat(start));
    //       start.setDate(start.getDate() + 1);
    //     } while (start <= end)

    //     return result;
    //   }


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


