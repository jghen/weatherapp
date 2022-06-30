const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const fetch = require("node-fetch");
const { resourceLimits } = require("worker_threads");

var PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.static(path.resolve(__dirname, "../client/build")));

const delayFetchAwait = (seconds) => {
  console.log("delaying fetch");
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
const delayFetch = (s) => {
  setTimeout(() => {
    console.log("timeout");
  }, s * 1000);
};


app.get("/cities", async (req, res) => {
  const countryCode = req.query.q;
  const apiKey = process.env.RAPID_API_KEY;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": "countries-cities.p.rapidapi.com",
      "X-RapidAPI-Key": apiKey,
    },
  };

  try {
    let url = `https://countries-cities.p.rapidapi.com/location/country/${countryCode}/city/list?page=1&per_page=100&population=1501`;
    let response = await fetch(url, options);
    let data = await response.json();
    await delayFetchAwait(12/10)
    let totalPages = data.total_pages;

    let result = [];
    let page = 1;

    let intervalID;

    const fetchCities = () => {
      delayFetch(75/100);
      if (page === totalPages) {
        stopInterval();
      }
      // console.log("iteration:", page, "of", totalPages);
      url = `https://countries-cities.p.rapidapi.com/location/country/${countryCode}/city/list?page=${page}&per_page=100&population=1501`;
      fetch(url, options)
        .then(resp => resp.json())
        .then((city) =>{
          delayFetch(75/100);
          result.push(city.cities.flatMap(c=>c));
          // console.log("typeof cities:",typeof city.cities, city.cities.length, "page:",city.page);
          // console.log("result: ", result.length, typeof result);
        })
        .catch((error) => console.log("Error: ", error));
      page++;
    }

    const doInterval = () => {
      if (!intervalID) {
        intervalID = setInterval(fetchCities,1500);
      }
    }

    function stopInterval() {
      console.log("stopping interval");
      clearInterval(intervalID);
      // release our intervalID from the variable
      intervalID = null;
    }

    doInterval();

    await delayFetchAwait(totalPages * 25/10);
    delayFetch(25/10);
    
    // console.log("endresult: ", result.length, typeof result);
    res.json(result.flatMap(city=>city));
  } catch (error) {
    console.log("error server cities!!!: ", error);
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
    delayFetch(1);
    const resp = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city},,${countryCode}&limit=5&appid=${apiKey}`
    );
    const data = await resp.json();
    const allWeather = await Promise.all(
      data.map(async function (place) {
        delayFetch(1);
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lon}&appid=${apiKey}`
        );
        return response.json();
      })
    );
    res.json(allWeather);
  } catch (error) {
    console.log(error);
    res.json("weather server error" + error);
  }
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
