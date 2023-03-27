import React, { useState } from "react";
import axios from "axios";

const SearchPage = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [coordinates, setCoordinates] = useState({});
  const [searchBy, setSearchBy] = useState("cityName");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    let dataValue = {};
    if (coordinates.lat !== undefined && coordinates.lon !== undefined) {
      dataValue = {
        lat: coordinates.lat,
        lon: coordinates.lon,
      };
    } else {
      if (searchBy === "cityName") {
        dataValue = {
          location: location,
          countryCode: "IN",
        };
      } else {
        dataValue = {
          zipCode: location,
          countryCode: "IN",
        };
      }
    }

    const { data } = await axios
      .get(`http://localhost:5000/weather`, {
        params: {
          ...dataValue,
        },
      })
      .then((response) => {
        if (response) setWeather(data);
      })
      .catch((err) => {
        setError(err.message);
        setWeather(null);
      });
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleGeoLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        if (coordinates.lat && coordinates.lon) handleSubmit();
      });
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className=" text-center space-y-6">
      <div className="text-3xl text-white font-semibold ">Weather Forcast</div>
      <div className="text-lg text-white  ">
        Enter a Zip Code to get the current weather condition of that area.
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center w-full">
          <input
            type="text"
            placeholder="Enter Zip Code or City Name"
            value={location}
            onChange={handleLocationChange}
            className="mx-3"
          />
          <select
            width="100%"
            placeholder="Please select search criteria"
            onChange={(val) => setSearchBy(val)}
            className="mx-3"
          >
            <option value="cityName">City Name</option>
            <option value="zipCode">Zip Code</option>
          </select>
          <button type="submit" className="mx-3 bg-green-500 px-2">
            Search
          </button>
        </div>
      </form>
      <button onClick={handleGeoLocation} className="bg-orange-500 p-2">
        Use Current Location
      </button>
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)}°C</p>
          <p>Feels like: {(weather.main.feels_like - 273.15).toFixed(2)}°C</p>
        </div>
      )}
      {error && <div>{error}</div>}
    </div>
  );
};

export default SearchPage;
