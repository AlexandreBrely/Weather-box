document.body.style.backgroundImage = "url('assets/IMG/night.jpeg')";

let apiKey = '7c6f1c4d03343b679304dbb6beea9e6c'

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


function geoLoc(lat, lon) {
    let limit = 1;
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&limit=${limit}&appid=${apiKey}&units=metric&lang=fr`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            infoWeather(data);
            document.getElementById("city-input").value = `${data.city.name}`;
            //         if (data.cod !== "200") {
            //             console.warn("Aucune ville trouvée.");;
            //             return;
            //         }
            //         infoWeather(data)

            //     });
            // };
            if (data && data.length > 0) {
                // let city = data[0].name;
                // console.log("ville geolocalisée:", city);
                // document.getElementById("city-input").value = city;

            }
            // else {
            //     console.warn("Aucune ville trouvée.");
            // }


        })
        .catch(err => console.error("Erreur API géolocalisation :", err));
}


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



}







//         });
// }

function updateClock() {
    //pull the time from the device with "Date()"
    let now = new Date();
    let formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
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

// document.getElementById("").innerHTML = `${data.list}`


//   let unix_timestamp_sunrise = data.city.sunrise
// //    console.log(unix_timestamp_sunrise)
// let timerise = new Date(unix_timestamp_sunrise * 1000)
// let hours = timerise.getHours();
// let minutes = timerise.getMinutes();
// minutes = minutes.toString().padStart(2,"0")
// let sunrise = ` ${hours} : ${minutes} `
// console.log(sunrise)