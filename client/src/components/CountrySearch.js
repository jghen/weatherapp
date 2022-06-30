import React from "react";
import "./CountrySearch.css";

const Countries = ({ landSearch, countryArray }) => {
  return (
    <>
      <label htmlFor="land-input"></label>
      <input
        onInput={landSearch}
        onKeyDown={landSearch}
        onClick={landSearch}
        placeholder="Kingdom Of Norway"
        id="land-input"
        list="lands"
        autoComplete="on"
      />
      <datalist id="lands">
        {countryArray.map((country, i) => {
          return (
            <option key={i} value={country.name.official} onClick={landSearch}>
              {country.cca2}
            </option>
          );
        })}
      </datalist>
    </>
  );
};

export default Countries;
