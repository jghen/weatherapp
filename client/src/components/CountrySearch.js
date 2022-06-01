import React from "react";
import './CountrySearch.css';

const Countries = ({landSearch, countryArray}) => {

  return (
    <React.Fragment>
      <label htmlFor="land-input"></label>
      <input
        onInput={landSearch}
        onClick={landSearch}
        placeholder="Land"
        id='land-input'
        list='lands'
        autoComplete='on'
      />
      <datalist id="lands">
        {
          countryArray.map((country, i) => {
            return( 
              <option 
                key={i} 
                value ={country.name.official}
                onClick={landSearch}
              >
                {country.cca2}
              </option>
          )})
        }
      </datalist>
        
    </React.Fragment>
  );
}

export default Countries;