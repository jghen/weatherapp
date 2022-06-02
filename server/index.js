const express = require("express");
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const fetch = require('node-fetch');

var PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app.use(express.static(path.resolve(__dirname, '../client/build')));

const delayFetch = (seconds) => {
  return new Promise(ok => setTimeout(ok, seconds * 1100));
}

app.get("/cities", async (req, res) =>{
  const countryCode = req.query.q;
  const apiKey = process.env.RAPID_API_KEY;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'countries-cities.p.rapidapi.com',
      'X-RapidAPI-Key': apiKey
    }
  };

  const results = [];
  
  let url = `https://countries-cities.p.rapidapi.com/location/country/${countryCode}/city/list?page=1&per_page=100&population=1501`;
  let nextPage = "";
  let totalPages = 1;
  let thisPage = 1;
 
  try {
    do {
      await delayFetch(1);
      let response = await fetch(url, options);
      let data = await response.json();
      nextPage = data.links.next;
      totalPages = data.total_pages;
      thisPage = data.page;
      url = `https://countries-cities.p.rapidapi.com/location${nextPage}`;
      results.push(data);
    } while (totalPages > thisPage);
    const allCities = results.flatMap((result) => result.cities);
    console.log('cities in ', countryCode, ' :',allCities);
    return res.json(allCities);
  } catch (error) {
    console.log('Server error: ',error);
    return res.json('server error: '+ error);
  }
})

function hasSpace(s) {
  return s.includes(' ');
}

app.get('/weather', async (req, res) =>{
  let city = req.query.city;
  let countryCode = req.query.country
  
  city = (hasSpace(city)) ? city.split(' ').join('_'): city;
  const apiKey = process.env.OWM_API_KEY_VALUE;

  try {
    await delayFetch(1);
    const resp = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city},,${countryCode}&limit=5&appid=${apiKey}`);
    const data = await resp.json();
    const allWeather = await Promise.all(
      data.map(async function (place) {
        delayFetch(1);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lon}&appid=${apiKey}`);
        return response.json();
      })
    );
    res.json(allWeather);
  } catch (error) {
    console.log(error);
    res.json('weather server error' + error)
  }  
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, ()=>{
  console.log(`server running on port ${PORT}`);
})