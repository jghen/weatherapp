import React from "react";
import Card from './Card.js'
import './CardList.css';


const CardList = ({weather}) => {

  const relevantWeather = weather.map(place => {
    return {
      name: place.name, 
      temp: Math.floor(place.main.temp -273).toString() + ' °C',
      feelsLike: Math.floor(place.main.feels_like -273).toString() + ' °C',
      wind: place.wind.speed,
      windDirection: place.wind.deg,
      mainWeather: place.weather[0].main.toString(),
      weatherDescription: place.weather[0].description,
    };
  });
 /*  console.log(relevantWeather); */

  return(
    <div className="card-wrapper">
      {
        relevantWeather.map((city,i) => {
          return (
            <Card
              key={i}
              name={city.name}
              temp={city.temp}
              feelsLike={city.feelsLike}
              wind={city.wind}
              windDirection={city.windDirection}
              mainWeather={city.mainWeather}
              weatherDescription={city.weatherDescription}
            />
          )
        })
      }
    </div>
  );
}

export default CardList;