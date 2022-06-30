import React from "react";
import './Card.css'
import windPhoto from './img/wind-direction.png';


const Card = ({
  name, 
  temp, 
  feelsLike, 
  wind, 
  windDirection, 
  mainWeather, 
  weatherDescription,
}) => {
  
   const createImg = () => {
    const weather = mainWeather.toLowerCase();
    const weatherDescr = weatherDescription.toLowerCase().replace(/\s+/g, '');
    if (weatherDescr === "overcastclouds") {
      return require('./img/cloudy.png'); 
    }
    if (weatherDescr === "clearsky") {
      return require('./img/sun.png'); 
    }
    if (weatherDescr === "brokenclouds") {
      return require('./img/partlycloudy.png'); 
    }
    if (weather === "rain") {
      return require('./img/rain.png'); 
    }
    if (weather === "thunder") {
      return require('./img/thunder.png'); 
    }
    if (weather === "snow") {
      return require('./img/snow.png');
    }
    else {
      return require('./img/all.png');
    }
  } 

  return(
    <div className="card">
      <div className="card-content">
        <div className="card-left-container">
        <h1 className="h1-card">{name}</h1>
          <p>{'Temperatur: ' +temp}</p>
          <p>{'Føles som: ' +feelsLike}</p>
          {/* <p>{'Vær: ' + mainWeather}</p> */}
          <p>{'Vind: ' +wind+' m/s'}</p>
        </div>
        <div className="card-right-container">
        <img className="weather-img" src={createImg()} alt="weather-img" />
        <img
            style={
              {transform: `rotate(${270 + windDirection}deg)`}
              }
            className="wind-dir" 
            src={windPhoto}
            alt="wind-direction"
          />
        </div>
      </div>
    </div>
  );
}

export default Card;