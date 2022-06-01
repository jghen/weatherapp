import React from "react";
import "./CitySearch.css";

const CitySearch = ({ citySearchSubmit, currentCitySearch, cityArray }) => {
  const cities = !cityArray.length
    ? "...Loading"
    : cityArray.map((city, i) => {
        return (
          <option key={i} value={city.name}>
            {city.name}
          </option>
        );
      });

  return (
    <div className="Searchbar-wrapper">
      <label htmlFor="city-input"></label>
      <input
        id="city-input"
        onInput={currentCitySearch}
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
