import React from "react";
import "./CitySearch.css";

const CitySearch = ({ citySearchSubmit, currentCitySearch, cityArray, isFetching, }) => {
  // let citiesIsArray = Array.isArray(cityArray); 
  // console.log( "cityArray: ", cityArray, "array:", citiesIsArray, "length ", cityArray.length );
  // console.log("fetching data: ", isFetching);

  let placeholder = "Trondheim";
  const decidePlaceholder = () => {
    if (isFetching === true) {
      placeholder = `...Henter data`;
      return placeholder;
    }
    if (cityArray.length) {
      placeholder = "Velg en by!";
    } else if (cityArray.length === 0 || cityArray[0]===null) {
      placeholder = "Kan ikke hente data..";
    } else {
      placeholder = "By";
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
      <datalist id="cities">
        {cityArray.map((city, i) => (
          <option key={i} value={city.name}>
            {city.name}
          </option>
        ))}
      </datalist>
      <button id="search-btn" onClick={citySearchSubmit}>
        Søk
      </button>
    </div>
  );
};

export default CitySearch;
