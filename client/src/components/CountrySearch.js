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
        placeholder="Land"
        id="land-input"
        list="lands"
        autoComplete="on"
      />
      <datalist id="lands">
        {countryArray.map((country, i) => {
          return (
            <option key={i} id={country.cca2} value={country.name.common} onClick={landSearch}>
              {country.cca2}
            </option>
          );
        })}
      </datalist>
    </>
  );
};

export default Countries;
