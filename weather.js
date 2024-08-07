const fetch = require("node-fetch");
const readline = require("readline");

const apiKey = "2863e48585fae02649191dd507eb1149"; // Replace with your actual OpenWeatherMap API key

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log("\nChoose an option:");
  console.log("1. Get current weather");
  console.log("2. Get 3-day forecast");
  console.log("3. Exit");

  rl.question("Enter your choice: ", (choice) => {
    switch (choice) {
      case "1":
        askForAnotherCity(true);
        break;
      case "2":
        askForAnotherCity(false);
        break;
      case "3":
        rl.close();
        break;
      default:
        console.error("Invalid choice.");
        showMenu();
    }
  });
}

function getWeatherForCity(city, today = true) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.cod === "200") {
        const forecasts = data.list.slice(0, (today ? 1 : 3) * 8); // Get forecasts for next 3 days (8 intervals per day)

        for (let i = 0; i < forecasts.length; i += 8) {
          const date = new Date(forecasts[i].dt * 1000).toLocaleDateString();
          const temp = forecasts[i].main.temp;
          const description = forecasts[i].weather[0].description;
          const humidity = forecasts[i].main.humidity;
          const windSpeed = forecasts[i].wind.speed;

          console.log(`\n--- ${date} ---`);
          console.log(`Temperature: ${temp}°C`);
          console.log(`Description: ${description}`);
          console.log(`Humidity: ${humidity}%`);
          console.log(`Wind Speed: ${windSpeed} m/s`);
        }
      } else {
        console.error(`City not found or API error for ${city}.`);
      }
    })
    .catch((error) => {
      console.error(`Error fetching weather data for ${city}:`, error);
    })
    .finally(() => {
      askForAnotherCity(today);
    });
}

function askForAnotherCity(today) {
  rl.question('\nEnter city name or type "exit": ', (answer) => {
    if (answer.toLowerCase() === "exit") {
      rl.close();
    } else {
      getWeatherForCity(answer, today);
    }
  });
}

showMenu();
