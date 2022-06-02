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
    };
  }

  fetchCountries = () => {
    fetch("https://restcountries.com/v3.1/all")
      .then((resp) => resp.json())
      .then((data) => {
        return this.setState({ countries: data });
      });
  };

  componentDidMount = () => {
    this.fetchCountries();
    // this.setState({ countryCode: "NO" });
  };

  delayFetch = (seconds) => {
    setTimeout(() => {
      console.log("delaying fetch 1s");
    }, seconds * 1100);
  };
  delayFetchAwait = (seconds) => {
    console.log("delay fetch");
    return new Promise((ok) => setTimeout(ok, seconds * 1100));
  };

  fetchCities = async (code) => {
    let url = `/cities?q=${code}`;
    console.log('this.state.countryCode: ',this.state.countryCode);
    console.log('passed countryCode',code);
    if (code === this.state.countryCode) {
      console.log('FetchCities: returning');
      return;
    }
    try {
      console.log('FetchCities - fetching: ', code);
      await this.delayFetchAwait(1);
      const resp = await fetch(url);
      const data = await resp.json();
      return this.setState({ cities: data });
    } catch (error) {
      this.setState({ cities: ["error"] });
    }
  };

  onLandSearchChange = (event) => {
    let prevStateCountryCode = this.state.countryCode;
    // if (event.type === "click") {
      document.querySelector("#city-input").value = "";
    // }

    if (event.target.value) {
      const countryMatch = this.state.countries.filter((country) => {
        return event.target.value
          .toLowerCase()
          .includes(country.name.official.toLowerCase());
      });
      if (countryMatch.length === 1) {
        let newCountryCode = countryMatch[0].cca2;
        this.setState({ countryCode: newCountryCode });

        if (
          newCountryCode !== prevStateCountryCode ||
          !(this.state.cities.length === 0)
        ) {
          // this.delayFetch(1);
          this.fetchCities(newCountryCode);
        }
      }
    }
    return false;
  };

  onCitySearchChange = (event) => {
    const input = event.target.value;

    if (input && this.state.cities.length) {
      this.setState({ citySearch: input });
    }
    if (event.keyCode === 13) {
      this.getWeatherData(input);
      document.querySelector("#search-btn").click();
      document.querySelector("#search-btn").focus();
      // document.querySelector('#search-btn').classList.remove('btn-active');
      // setTimeout(() => {

      // }, 50);
      // document.querySelector('#search-btn').classList.add('btn-active');
    }
    return;
  };

  getWeatherData = async (city) => {
    const url = `/weather?city=${city}&country=${this.state.countryCode}`;

    try {
      this.delayFetchAwait(1);
      const resp = await fetch(url);
      const data = await resp.json();
      return this.setState({ weather: data });
    } catch (error) {
      this.setState({ weather: ["error"] });
    }
  };

  onCitySearchSubmit = (event) => {
    if (event.keyCode === 13 || event.type === "click") {
      const searchCity = document.querySelector("#city-input").value;
      this.getWeatherData(searchCity);
    }
    return false;
  };

  render() {
    const { weather, countries, cities } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Værmelding</h1>
          <CountrySearch
            landSearch={this.onLandSearchChange}
            countryArray={countries}
          />
          <CitySearch
            citySearchSubmit={this.onCitySearchSubmit}
            currentCitySearch={this.onCitySearchChange}
            cityArray={cities}
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
