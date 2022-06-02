import React from 'react';
import "./CitySearch.css";

const CitySearch = ({citySearchSubmit, currentCitySearch, cityArray, isFetching }) => {

  let cities;
  // let citiesIsArray = Array.isArray(cityArray);
  // console.log("cityArray: ",cityArray,"array:",citiesIsArray, 'length ', cityArray.length);
  // console.log("fetching? ", isFetching);

  

  if (cityArray.length > 0) {
    cities = cityArray.map((city, i) => {
      return (
        <option key={i} value={city.name}>
          {city.name}
        </option>
      );
    });
  }


 

  let placeholder = 'By';
  const decidePlaceholder = () => {
    
    if (isFetching === true) {
      placeholder = `...Loading`;
    } 
    
    if (isFetching === false) {
      if (cityArray.length) {
        placeholder = "Chose a city!";
      }
      else if(cityArray.length===undefined) {
        placeholder='unable to get data'
      }
      else {
        placeholder = 'By'
      }
    } 
    return placeholder;
  };

  return (
    <div className="Searchbar-wrapper">
      <label htmlFor="city-input"></label>
      <input
        id="city-input"
        onInput={currentCitySearch}
        onKeyDown={currentCitySearch}
        placeholder={`${decidePlaceholder()}`}
        list="cities"
        autoComplete="on"
      />
      <datalist id="cities">{cities}</datalist>
      <button id="search-btn" onClick={citySearchSubmit}>
        Søk
      </button>
    </div>
  );
};

export default CitySearch;
