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
  const apiKey = process.env.REACT_APP_RAPID_API_KEY;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "countries-cities.p.rapidapi.com"
    }
  };

  try {

    let result = [];
    let page = 1;
    let totalPages = 1;
    let url;

    while (page <= totalPages) {
      url = `https://countries-cities.p.rapidapi.com/location/country/${countryCode}/city/list?page=${page}&per_page=1000&format=json&population=1501`;
      const resp = await fetch(url, options);
      let { cities, total_pages } = await resp.json();
      result.push(cities);
      totalPages = total_pages;
      page++;
    }

    res.json(result.flat());

  } catch (error) {
    res.json("error server cities!!!: " + error);
  }
});

function hasSpace(s) {
  return s.includes(" ");
}

app.get("/weather", async (req, res) => {
  let city = req.query.city;
  city = hasSpace(city) ? city.split(" ").join("_") : city;
  let countryCode = req.query.country;
  
  const apiKey = process.env.REACT_APP_OWM_API_KEY_VALUE;
  const baseUrl = 'https://api.openweathermap.org';

  try {

    const resp = await fetch( `${baseUrl}/geo/1.0/direct?q=${city},,${countryCode}&limit=5&appid=${apiKey}`);
    const data = await resp.json();

    const allWeather = await Promise.all(
      data.map(async function (place) {
        const response = await fetch( `${baseUrl}/data/2.5/weather?lat=${place.lat}&lon=${place.lon}&appid=${apiKey}`);
        return response.json();
      })
    );

    res.json(allWeather);

  } catch (error) {
    res.json("weather server error" + error);
  }
});

// All other GET requests not handled before will return our React app

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
