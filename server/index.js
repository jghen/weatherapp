const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const fetch = require("node-fetch");

var port = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/cities", async (req, res) => {
  const countryCode = req.query.code;
  const apiKey = process.env.RAPID_API_KEY;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "countries-cities.p.rapidapi.com",
      "X-RapidAPI-Key": apiKey,
    },
  };

  try {

    const fetchCities = async () => {
      let result = [];
      let page = 1;
      let totalPages = 1;

      while (page <= totalPages) {
        url = `https://countries-cities.p.rapidapi.com/location/country/${countryCode}/city/list?page=${page}&per_page=1000&population=1501`;
        await fetch(url, options)
          .then((resp) => resp.json())
          .then((data) => {
            result.push(data.cities.flatMap((c) => c));
            page++;
          })
          .catch((error) => result = error);
      }
      // result.flatMap((city) => city);
      return result.flat();
    };

    const theData = await fetchCities();
    res.json(theData);
  } catch (error) {
    res.json("error server cities!!!: " + error);
  }
});

function hasSpace(s) {
  return s.includes(" ");
}

app.get("/weather", async (req, res) => {
  let city = req.query.city;
  let countryCode = req.query.country;

  city = hasSpace(city) ? city.split(" ").join("_") : city;
  const apiKey = process.env.OWM_API_KEY_VALUE;

  try {
    const resp = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city},,${countryCode}&limit=5&appid=${apiKey}`
    );
    const data = await resp.json();
    const allWeather = await Promise.all(
      data.map(async function (place) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lon}&appid=${apiKey}`
        );
        return response.json();
      })
    );
    res.json(allWeather);
  } catch (error) {
    res.json("weather server error" + error);
  }
});

// All other GET requests not handled before will return our React app

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});


app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
