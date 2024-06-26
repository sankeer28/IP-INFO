window.onload = function() {
    const currentDate = new Date();
    const currentTimeString = currentDate.toLocaleTimeString();

    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            const approximateLocation = {
                "IPv6": data.ip,
                "IPv4": "Failed to retrieve",
                "Ping": "" ,
                "Network": data.network,
                "ASN": data.asn,
                "ISP": data.org,
                "City": data.city,
                "Region": data.region,
                "Region Code": data.region_code,
                "Country": data.country_name,
                "Country Code": data.country_code,
                "Country Code ISO3": data.country_code_iso3,
                "Country Capital": data.country_capital,
                "Country TLD": data.country_tld,
                "Continent Code": data.continent_code,
                "Postal (approximate)": data.postal,
                "Longitude": data.longitude,
                "Latitude": data.latitude,
                "Timezone": data.timezone,
                "Time": currentTimeString, 
                "UTC Offset": data.utc_offset,
                "Country Calling Code": data.country_calling_code,
                "Currency": `${data.currency} (${data.currency_name})`,
                "Languages": data.languages,
                "Country Area": data.country_area + ' km²',
                "Temperature": "",
                "Weather": "",
                "Approximate Location (10km Radius)": ""
            };

            var map = L.map('mapid', { attributionControl: false }).setView([approximateLocation.Latitude, approximateLocation.Longitude], 10);

            var Jawg_Matrix = L.tileLayer('https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
                attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                minZoom: 0,
                maxZoom: 22,
                accessToken: 'yN0ESgFsBwgdpSy0MoyaFsDI66mXptDz4cWH0wArMflMJCBK7TkuyjQY8OtqEViZ'
            }).addTo(map);

            const circle = L.circle([approximateLocation.Latitude, approximateLocation.Longitude], {
                color: '#00ff00',
                fillColor: '#00ff00', 
                fillOpacity: 0.2,
                radius: 10000 
            }).addTo(map);

            let formattedLocation = "Approximate Location:\n";
            for (const [key, value] of Object.entries(approximateLocation)) {
                if (key === "IPv4") {
                    formattedLocation += `${key}: ${value}\n`;
                } else {
                    formattedLocation += `${key}: ${value}\n`;
                }
            }

            formattedLocation += "\nMap: Approximate location representation";
            document.getElementById("approxLocation").textContent = formattedLocation;

            fetch('https://api.ipify.org/?format=json')
                .then(response => response.json())
                .then(data => {
                    approximateLocation.IPv4 = data.ip;
                    let formattedLocation = "\n";
                    for (const [key, value] of Object.entries(approximateLocation)) {
                        formattedLocation += `${key}: ${value}\n`;
                    }
                    document.getElementById("approxLocation").textContent = formattedLocation;
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${approximateLocation.Latitude}&lon=${approximateLocation.Longitude}&appid=1c86a55ad041297a64544ba7c3f2d094`)
                .then(response => response.json())
                .then(weatherData => {
                    const temperatureK = weatherData.main.temp;
                    const temperatureC = (temperatureK - 273.15).toFixed(2);
                    const temperatureF = ((temperatureK - 273.15) * 9/5 + 32).toFixed(2);
                    const currentCondition = weatherData.weather[0].main;
                    approximateLocation.Weather = `${currentCondition}`;
                    approximateLocation.Temperature = `${temperatureC}°C / ${temperatureF}°F`;
                    let formattedLocation = "\n";
                    for (const [key, value] of Object.entries(approximateLocation)) {
                        formattedLocation += `${key}: ${value}\n`;
                    }
                    document.getElementById("approxLocation").textContent = formattedLocation;
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById("approxLocation").textContent = "Failed to retrieve weather data";
                });

            var startTime = new Date().getTime();
            fetch(document.location.origin)
                .then(function(response) {
                    var latency = new Date().getTime() - startTime;
                    approximateLocation.Ping = latency + " ms";
                    let formattedLocation = "\n";
                    for (const [key, value] of Object.entries(approximateLocation)) {
                        formattedLocation += `${key}: ${value}\n`;
                    }
                    document.getElementById("approxLocation").textContent = formattedLocation;
                })
                .catch(function(error) {
                    console.error('Error:', error);
                });

            const toggle = document.getElementById("radiusToggle");
            toggle.addEventListener("change", function() {
                const newRadius = this.checked ? 25000 : 10000; 
                circle.setRadius(newRadius);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("approxLocation").textContent = "Failed to retrieve location";
        });
};
