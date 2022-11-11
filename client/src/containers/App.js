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
      isFetchingCities: null,
    };
  }

  fetchCountries = async () => {
    await fetch("https://restcountries.com/v3.1/all")
      .then((resp) => resp.json())
      .then((data) => {
        return this.setState({ countries: data });
      });
  };

  getInitialWeatherData = async () => {
    const url = `/weather?city=Trondheim&country=NO`;
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      return this.setState({ weather: data });
    } catch (error) {
      this.setState({ weather: ["error"] });
    }
  }

  componentDidMount = async () => {
    await this.fetchCountries();
    await this.getInitialWeatherData();
  };

  render() {
    const { weather, countries, cities, countryCode, isFetchingCities } =
      this.state;

    const setStateAsync = (state) => {
      return new Promise((resolve) => {
        this.setState(state, resolve);
      });
    };

    const fetchCities = async (code) => {
      let url = `/cities?code=${code}`;

      if (code === countryCode) {
        return;
      }

      this.setState({ isFetchingCities: true });

      try {
        const resp = await fetch(url);
        const data = await resp.json();
        await setStateAsync({ isFetchingCities: false });
        return this.setState({ cities: data });
      } catch (error) {
        console.log("error: ", error);
        this.setState({ cities: [...error] });
      }
    };

    const onLandSearchChange = (event) => {
      let prevStateCountryCode = countryCode;
      // if (event.type === "click") {
      // const landInput = document.querySelector("#land-input");
      // landInput.value = "";
      // }

      if (!event.target.value) return;

      const countryMatch = countries.filter((country) => {
        return event.target.value
          .toLowerCase()
          .includes(country.name.common.toLowerCase());
      });


      if (countryMatch.length === 1) {
        let newCountryCode = countryMatch[0].cca2;
        this.setState({ countryCode: newCountryCode });

        if (newCountryCode !== prevStateCountryCode || cities.length === 0) {
          fetchCities(newCountryCode);
          
        }
      }
      return false;
    };

    const onCitySearchChange = (event) => {
      const input = event.target.value;

      if (input && cities.length) {
        this.setState({ citySearch: input });
      }
      if (event.key === "Enter") {
        getWeatherData(input);
        const btn = document.querySelector("#search-btn");
        btn.click();
        // btn.focus();
      }
      return;
    };

    const getWeatherData = async (city) => {
      const url = `/weather?city=${city}&country=${countryCode}`;

      try {
        const resp = await fetch(url);
        const data = await resp.json();
        return this.setState({ weather: data });
      } catch (error) {
        this.setState({ weather: ["error"] });
      }
    };

    const onCitySearchSubmit = (event) => {
      if (event.key === 'Enter' || event.type === "click") {
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
