const weather = {
    apiKey: "3054013b51d2822bf828eb9b2f7b0e03",
    unsplashApiKey: "z1Dv--f3GqEBGXrM9i5C5kyhAZJpI8aASAR1q90S7As", 
    fetchWeather: async function (city) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
            );
            if (!response.ok) {
                throw new Error(`Weather data not found for "${city}".`);
            }
            const data = await response.json();
            this.displayWeather(data);
            this.fetchForecast(data.coord.lat, data.coord.lon);
            this.setCityBackground(city);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            alert(error.message);
        }
    },
    fetchForecast: async function (lat, lon) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
            );
            if (!response.ok) {
                throw new Error("Forecast data not found.");
            }
            const data = await response.json();
            this.displayForecast(data);
        } catch (error) {
            console.error("Error fetching forecast data:", error);
            alert(error.message);
        }
    },
    setCityBackground: async function (city) {
        try {
            const response = await fetch(
                `https://api.unsplash.com/photos/random?query=${city}&client_id=${this.unsplashApiKey}`
            );
            if (!response.ok) {
                throw new Error("City background image not found.");
            }
            const data = await response.json();
            document.body.style.backgroundImage = `url('${data.urls.full}')`;
        } catch (error) {
            console.error("Error fetching city background image:", error);
            alert("Could not load city background image.");
        }
    },
    displayWeather: function (data) {
        const { name, weather, main, wind } = data;
        const { icon, description } = weather[0];
        const { temp, humidity } = main;
        const { speed } = wind;

        document.querySelector(".city").innerText = `Weather in ${name}`;
        document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = `${temp}°C`;
        document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
        document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;
        document.querySelector(".weather").classList.remove("loading");
        document.querySelector(".weather").style.display = "block";
    },
    displayForecast: function (data) {
        const forecastDiv = document.querySelector('.forecast');
        forecastDiv.innerHTML = '';

        const dailyForecasts = {};

        data.list.forEach(entry => {
            const date = new Date(entry.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });

            if (!dailyForecasts[day]) {
                dailyForecasts[day] = true;
                const { icon } = entry.weather[0];
                const { temp } = entry.main;
                const forecastDay = document.createElement('div');
                forecastDay.classList.add('forecast-day');
                forecastDay.innerHTML = `
                    <div class="day">${day}</div>
                    <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather icon">
                    <div class="temp">${temp}°C</div>
                `;
                forecastDiv.appendChild(forecastDay);
            }
        });
    },
    search: function () {
        const city = document.querySelector(".search-bar").value;
        this.fetchWeather(city);
    },
};

document.querySelector(".search button").addEventListener("click", () => weather.search());

document.querySelector(".search-bar").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        weather.search();
    }
});

weather.fetchWeather("Mangalore");


