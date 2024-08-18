document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherData(city);
    }
});

function fetchWeatherData(city) {
    const apiKey = '343615eb868493af24b195347278741e'; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeatherData(data);
            fetchWeeklyForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayWeatherData(data) {
    if (data.cod === '404') {
        alert('City not found!');
        return;
    }

    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById('description').textContent = `Weather: ${data.weather[0].description}`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weather-icon').src = iconUrl;

    document.querySelector('.weather-info').style.display = 'block';
}

function fetchWeeklyForecast(lat, lon) {
    const apiKey = 'your_api_key'; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayWeeklyForecast(data.daily))
        .catch(error => console.error('Error fetching weekly forecast:', error));
}

function displayWeeklyForecast(daily) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    daily.slice(0, 7).forEach(day => {
        const date = new Date(day.dt * 1000);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        const dayString = date.toLocaleDateString('en-US', options);

        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

        const dayElement = document.createElement('div');
        dayElement.classList.add('forecast-day');
        dayElement.innerHTML = `
            <p>${dayString}</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>${day.temp.day}°C</p>
            <p>${day.weather[0].description}</p>
        `;

        forecastContainer.appendChild(dayElement);
    });
}
