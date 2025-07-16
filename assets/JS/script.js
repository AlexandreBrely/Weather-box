document.body.style.backgroundImage = "url('assets/IMG/night.jpeg')";

let apiKey = '7c6f1c4d03343b679304dbb6beea9e6c'

//geo loc via navigateur --
navigator.geolocation.getCurrentPosition(
    position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        console.log(lat)
        console.log(lon)


        // function d'apres
        geoLoc(lat, lon);
    },
    error => {
        console.error("position non trouver:", error);
    }
);

//function geo / api
function geoLoc(lat, lon) {
    let limit = 1;
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}&units=metric&lang=fr`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)

            infoWeather(data);

            document.getElementById("city-input").value = `${data.city.name}`;
         
            if (data && data.length > 0) {
       
            }
        
        })
        .catch(err => console.error("Erreur API géolocalisation :", err));
    updateFavIcon()
}

//function par input ville
function weatherApp() {
   
    let input = document.getElementById("city-input").value.trim();
    let city = input.replace(/\s+/g, "-");
    if (!city) return;

    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.cod !== "200") {
                console.warn("Aucune ville trouvée.");;
                return;
            }
            infoWeather(data)
        });
}

//display des infos de l'api
function infoWeather(data) {
    document.getElementById("temp").innerHTML = `${Math.round(data.list[0].main.temp)}°c`
    document.getElementById("precip").innerHTML = `${data.list[0].pop}%`
    document.getElementById("humid").innerHTML = `${data.list[0].main.humidity}%`
    document.getElementById("vent").innerHTML = `${data.list[0].wind.speed} Km/H`
    document.getElementById("description").innerHTML = `${data.list[0].weather[0].description}`
    // document.getElementById("loc").innerHTML = `${data.city.name}`
    document.getElementById("icon").className = `owi owi-${data.list[0].weather[0].icon} fs-1 fw-bold`

    //cards for next hours
    document.getElementById("time+1").innerHTML = `${new Date(data.list[1].dt * 1000).getHours().toString().padStart(2, "0")}h`;
    document.getElementById("temp+1").innerHTML = `${Math.round(data.list[1].main.temp)}°c`;
    document.getElementById("icon+1").innerHTML = `<i class="owi owi-${data.list[1].weather[0].icon} fs-2"></i>`;


    document.getElementById("time+2").innerHTML = `${new Date(data.list[2].dt * 1000).getHours().toString().padStart(2, "0")}h`;
    document.getElementById("temp+2").innerHTML = `${Math.round(data.list[2].main.temp)}°c`;
    document.getElementById("icon+2").innerHTML = `<i class="owi owi-${data.list[2].weather[0].icon} fs-2"></i>`;




    let dayTwo = new Date();
    let tomorrow = new Date(dayTwo);
    tomorrow.setDate(dayTwo.getDate() + 1);

    // Format tomorrow's date for comparison
    let tomorrowString = tomorrow.toLocaleDateString("fr-FR");

    // Loop through forecast entries to find tomorrow at 12:00
    let middayForecast = null;

    for (let i = 0; i < data.list.length; i++) {
        let forecastDate = new Date(data.list[i].dt * 1000);
        let forecastDateString = forecastDate.toLocaleDateString("fr-FR");
        let forecastHour = forecastDate.getHours();

        if (forecastDateString == tomorrowString && forecastHour >= 11 && forecastHour <= 13) {
            middayForecast = data.list[i];
            break;
        }
    }

    if (middayForecast) {
        document.getElementById("iconDay+1").innerHTML = `<i class="owi owi-${middayForecast.weather[0].icon} fs-2"></i>`;
        document.getElementById("tempDay+1").innerHTML = `${Math.round(middayForecast.main.temp)}°C`;
        document.getElementById("timeDay+1").innerHTML = new Date(middayForecast.dt * 1000).toLocaleDateString("fr-FR", {
            weekday: "long",
        });
    }

    //  Set target date: day after tomorrow
    let dayThree = new Date();
    let dayAfter = new Date(dayThree);
    dayAfter.setDate(dayThree.getDate() + 2);

    //  Format for easy comparison
    let dayAfterString = dayAfter.toLocaleDateString("fr-FR");

    //  Find midday-ish forecast (between 11h and 13h)
    let middayForecast2 = null;

    for (let i = 0; i < data.list.length; i++) {
        let forecastDate = new Date(data.list[i].dt * 1000);
        let forecastDateString = forecastDate.toLocaleDateString("fr-FR");
        let forecastHour = forecastDate.getHours();

        if (forecastDateString === dayAfterString && forecastHour >= 11 && forecastHour <= 13) {
            middayForecast2 = data.list[i];
            break;
        }
    }

    if (middayForecast2) {
        let rawDay = new Date(middayForecast2.dt * 1000).toLocaleDateString("fr-FR", { weekday: "long" });
        let capitalizedDay = rawDay.charAt(0).toUpperCase() + rawDay.slice(1);
        document.getElementById("tempDay+2").innerHTML = `${Math.round(middayForecast2.main.temp)}°C`;
        document.getElementById("iconDay+2").innerHTML = `<i class="owi owi-${middayForecast2.weather[0].icon} fs-2"></i>`;
        document.getElementById("timeDay+2").innerHTML = new Date(middayForecast2.dt * 1000).toLocaleDateString("fr-FR", {
            weekday: "long",
        });
    }
    let unix_timestamp_sunrise = data.city.sunrise
    //    console.log(unix_timestamp_sunrise)
    let timerise = new Date(unix_timestamp_sunrise * 1000)
    let hoursrise = timerise.getHours().toString().padStart(2, "0");
    let minutesrise = timerise.getMinutes();
    minutesrise = minutesrise.toString().padStart(2, "0")
    let sunrise = ` ${hoursrise} : ${minutesrise} `
    console.log(sunrise)
    document.getElementById("sunrise").innerHTML = sunrise

    let unix_timestamp_sunset = data.city.sunset
    //    console.log(unix_timestamp_sunrise)
    let timeset = new Date(unix_timestamp_sunset * 1000)
    let hoursset = timeset.getHours().toString().padStart(2, "0");
    let minutesset = timeset.getMinutes();
    minutesset = minutesset.toString().padStart(2, "0")
    let sunset = ` ${hoursset} : ${minutesset} `
    console.log(sunset)
    document.getElementById("sunset").innerHTML = sunset


    //background img changing with icons
    let bgImg = data.list[0].weather[0].icon;
    document.body.style.backgroundImage = `url('assets/IMG/${bgImg}.jpeg')`;
    updateFavIcon()
}


//-------------------------------------------------------------------------------------------
// favorite city  add/delete and update icon

const addFav = () => {
    //safety console.log right target
    console.log(document.getElementById("city-input").value);
    //create a var from the input
    let citySearched = document.getElementById("city-input").value.trim();
    //check for the list OR create it
    let list = JSON.parse(localStorage.getItem('list',)) || [];
    //push the city into the list if not already there
    if (!list.includes(citySearched)) {
        list.push(citySearched);
        localStorage.setItem("list", JSON.stringify(list));
    }
    console.log(list);

    //update display 
    displayFavCities();
    updateFavIcon();
}

function deleteFav(i) {
    //target the [] in localStorage
    let list = JSON.parse(localStorage.getItem("list")) || [];
    // delete/splice the element at index "i"
    list.splice(i, 1);
    //save the new []
    localStorage.setItem("list", JSON.stringify(list));
    // update the display of the list
    displayFavCities();
    updateFavIcon();

}
function updateFavIcon() {
    const cityInput = document.getElementById("city-input").value.trim();
    const list = JSON.parse(localStorage.getItem("list")) || [];
    const favIcon = document.getElementById("favIcon");

    favIcon.className = list.includes(cityInput) ? "bi bi-star-fill" : "bi bi-star";
}

updateFavIcon()





//------------------------------------------------------------------------
//Favorite city within the OffCanvas
const displayFavCities = () => {
    //target the list OR create it (safety measure)
    const cityList = JSON.parse(localStorage.getItem("list")) || [];
    //target the place to display in the offCanvas
    const favCityList = document.getElementById("favoredCity");
    //safety to not display the list twices
    favCityList.innerHTML = "";
    //set up an incrementation for each "favoredcity" and make it targetable in the array    
    let i = 0;
    cityList.forEach(city => {

        favCityList.innerHTML += `
            <li class="list-group-item bg-dark text-white border-0">
                <div onclick="searchFavCity('${city}')" class="d-flex justify-content-between align-items-center">
                    <i class="bi bi-geo-alt-fill me-2 text-warning"></i>  ${city} <button class="btn text-white" id="deleteFav"
                        onclick="deleteFav(${i})"><i class="bi bi-trash"> </i> </button>
                </div>
            </li>      
          `
        //end of the loop + 1          
        i = + 1
    });
};

displayFavCities();






//----------------------------------------------------------------
// clickable favorite city = display of the city
function searchFavCity(city) {
   
  
    if (!city) return;

    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.cod !== "200") {
                console.warn("Aucune ville trouvée.");;
                return;
            }
            infoWeather(data)

            document.getElementById("city-input").value = `${data.city.name}`
        });
}



//--------------------------------------------------------------
//CLOCK
function updateClock() {
    //pull the time from the device with "Date()"
    let now = new Date();
    let formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        // 24h format
        hour12: false
    });

    //loop for updating real time
    let clockElement = document.getElementById("clock");
    if (clockElement.textContent !== formattedTime) {
        clockElement.textContent = formattedTime;
    }

    requestAnimationFrame(updateClock);
}

//  Start the loop
updateClock();
