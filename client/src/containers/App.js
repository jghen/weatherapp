import React from "react";
import "./App.css";
import CardList from "../components/CardList.js";
import CountrySearch from "../components/CountrySearch.js";
import CitySearch from "../components/CitySearch.js";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      weather: [],
      countries: [],
      cities: [],
      countryCode: "",
      countrySearch: "",
      citySearch: "",
      isFetchingCities: null
    };
  }

  fetchCountries = () => {
    fetch("https://restcountries.com/v3.1/all")
      .then((resp) => resp.json())
      .then((data) => {
        return this.setState({ countries: data });
      });
  };

  componentDidMount = async () => {
    this.fetchCountries();
    //get initial data
    const url = `/weather?city=Trondheim&country=NO`;

      try {
        // delayFetchAwait(1);
        const resp = await fetch(url);
        const data = await resp.json();
        return this.setState({ weather: data });
      } catch (error) {
        this.setState({ weather: ["error"] });
      }
  };

  render() {
    const { weather, countries, cities, countryCode, isFetchingCities } = this.state;

    const setStateAsync = (state) => {
      return new Promise((resolve) => {
        this.setState(state, resolve)
      });
    }

    const fetchCities = async (code) => {
      let url = `/cities?code=${code}`;
      // console.log(url);
      // console.log("this.state.countryCode: ", countryCode);
      // console.log("passed countryCode", code);
      if (code === countryCode) {
        // console.log("FetchCities: returning");
        return;
      }
      try {
        // console.log("Fetching: ", code);
        this.setState({isFetchingCities: true});
        
        const resp = await fetch(url);
        const data = await resp.json();
        await setStateAsync({isFetchingCities: false});
        // console.log('cities:', data);
        return this.setState({ cities: data });

      } catch (error) {
        console.log('error: ', error)
        this.setState({ cities: ["error"] });
      }
    };


    const onLandSearchChange = (event) => {
      let prevStateCountryCode = countryCode;
      // if (event.type === "click") {
        const cityInput = document.querySelector("#city-input");
        cityInput.value = "";
      // }

      if (event.target.value) {
        const countryMatch = countries.filter((country) => {
          return event.target.value
            .toLowerCase()
            .includes(country.name.official.toLowerCase());
        });
        if (countryMatch.length === 1) {
          let newCountryCode = countryMatch[0].cca2;
          this.setState({ countryCode: newCountryCode });

          if (
            newCountryCode !== prevStateCountryCode ||
            !(cities.length === 0)
          ) {
            fetchCities(newCountryCode);
          }
        }
      }
      return false;
    };

    const onCitySearchChange = (event) => {
      const input = event.target.value;

      if (input && cities.length) {
        this.setState({ citySearch: input });
      }
      if (event.key === 'Enter') {
        getWeatherData(input);
        const btn = document.querySelector("#search-btn");
        btn.click();
        btn.focus();
      }
      return;
    };

    const getWeatherData = async (city) => {
      const url = `/weather?city=${city}&country=${countryCode}`;

      try {
        // delayFetchAwait(1);
        const resp = await fetch(url);
        const data = await resp.json();
        return this.setState({ weather: data });
      } catch (error) {
        this.setState({ weather: ["error"] });
      }
    };

    const onCitySearchSubmit = (event) => {
      if (event.keyCode === 13 || event.type === "click") {
        const searchCity = document.querySelector("#city-input").value;
        getWeatherData(searchCity);
      }
      return false;
    };

    return (
      <div className="App">
        <header className="App-header">
          <h1>Værmelding</h1>
          <CountrySearch
            landSearch={onLandSearchChange}
            countryArray={countries}
          />
          <CitySearch
            citySearchSubmit={onCitySearchSubmit}
            currentCitySearch={onCitySearchChange}
            cityArray={cities}
            isFetching={isFetchingCities}
          />
        </header>
        <main>
          <CardList weather={weather} />
        </main>
      </div>
    );
  }
}

export default App;
