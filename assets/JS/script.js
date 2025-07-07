document.body.style.backgroundImage = "url('assets/IMG/basic.jpeg')";

function weatherApp() {
    let input = document.getElementById("city-input").value.trim();
    let city = input.replace(/\s+/g, "-");
    if (!city) return;

    let apiKey = '7c6f1c4d03343b679304dbb6beea9e6c'

    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.cod !== "200") {
                alert("ville non-valide");
                return;
            }
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


        });
}

function updateClock() {
    //pull the time from the device with "Date()"
    let now = new Date();
    let formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
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