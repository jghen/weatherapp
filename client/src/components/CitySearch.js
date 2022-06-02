import React from "react";
import "./CitySearch.css";

const CitySearch = ({ citySearchSubmit, currentCitySearch, cityArray }) => {
  console.log('cityArray: ', cityArray);
  let cities = (cityArray.length>0)
    ? cityArray.map((city, i) => {
      return (
        <option key={i} value={city.name}>
          {city.name}
        </option>
      );
    })
    : <option>...Loading</option>;

  return (
    <div className="Searchbar-wrapper">
      <label htmlFor="city-input"></label>
      <input
        id="city-input"
        onInput={currentCitySearch}
        onKeyDown={currentCitySearch}
        placeholder="By"
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
