import { Button, Divider, Form, Input, message, Space, Typography } from "antd";
import {
  CloudFilled,
  MoonFilled,
  SearchOutlined,
  SunFilled,
} from "@ant-design/icons";
import "./weather.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Weatherapp = () => {
  const [city, setCity] = useState();
  const [weather, setWeather] = useState(null);
  const [newCity, setNewCity] = useState([]);
  const [loading, setLoading] = useState(false);

  // getting weather data based on user search
  const fetchWeather = async (cityName) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/api/weather", {
        params: { city: cityName },
      });
      const result = res.data.result;
      console.log(result);

      setWeather(result);
      setLoading(false);
      message.success(res.data.message);

      setCity("");
      // console.log(newCity.map((d)=>d.city.toLowerCase()));

      if (
        !newCity
          .map((c) => c.city.toLowerCase())
          .includes(cityName.toLowerCase())
      ) {
        saveCity(cityName);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      setWeather(null);
      setCity("");
      message.error("Invalid city name");
    }
  };

  // if user search new city it will check and if it is valid name the stores to db
  const saveCity = async (cityName) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/city", {
        city: cityName,
      });
      const result = res.data;
      setNewCity(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("invalid city name", error);
    }
  };

  // fetching the newly added or searched cities
  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3001/api/allcities");
        const result = res.data;
        setNewCity(result.cities);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch cities:", error);
        setCity("");
      }
    };
    fetchCities();
  }, [city, newCity]);

  const handleFetch = async () => {
    fetchWeather(city);
  };

  // get the details of daytime or night time

  const currentTime = new Date().getTime() / 1000;
  const localTime = currentTime + weather?.timezone;
  const isDay =
    localTime > weather?.sys?.sunrise && localTime < weather?.sys?.sunset;
  const cloudslevel = weather?.clouds?.all;

  return (
    <Space>
      <Space className="weather-widget">
        <Typography.Text
          style={{ color: "white", fontSize: "2rem", fontFamily: "fantasy" }}
        >
          Weather.co
        </Typography.Text>
        <div className="form-input">
          <Form className="input-form">
            <Input
              placeholder="Enter city name"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              iconPosition={"end"}
              onClick={handleFetch}
            >
              Search
            </Button>
          </Form>
        </div>
        <Divider orientation="left" plain></Divider>
        <div>
          {isDay ? (
            <SunFilled
              style={{
                fontSize: "60px",
                color: "yellow",
                filter: "drop-shadow(0 0 20px rgba(224, 240, 7, 0.8))",
              }}
            />
          ) : (
            <MoonFilled
              style={{
                fontSize: "60px",
                color: "white",
                filter: "drop-shadow(0 0 20px rgba(207, 205, 205, 0.8))",
              }}
            />
          )}
        </div>
        <div className="cloud-container">
          {cloudslevel > 40 && (
            <CloudFilled
              className="cloud"
              style={{
                filter: "drop-shadow(0 0 20px rgba(67, 203, 221, 0.8))",
              }}
            />
          )}
        </div>
        {weather ? (
          <div>
            <div className="temprature">
              {weather?.main?.temp}
              <span style={{ marginLeft: "5px" }}>&deg;C</span>
            </div>
            <div className="weather">
              {weather?.weather?.map((w) => (
                <p key={w}> {w.main}</p>
              ))}
            </div>

            <div className="low-high">
              {weather?.main?.temp_min}{" "}
              <span style={{ marginLeft: "5px" }}>&deg;</span> /{" "}
              {weather?.main?.temp_max}
              <span style={{ marginLeft: "5px" }}>&deg;</span>
            </div>
            <div className="feels-like">
              {" "}
              Feels Like {weather?.main?.feels_like}{" "}
              <span style={{ marginLeft: "5px" }}>&deg;C</span>
            </div>
            <div className="location">
              {weather?.name} , {weather?.sys?.country}
            </div>
            <div className="humidity">
              {" "}
              Humidity {weather?.main?.humidity} %
            </div>
          </div>
        ) : (
          <p>No data found...please search !!!</p>
        )}
      </Space>
      <Space className="city-list">
        <p style={{ fontFamily: "fantasy" }}>Recent Search</p>

        <ul className="list" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {newCity.length > 0 ? (
            newCity.map((c) => (
              <li key={c._id} onClick={() => fetchWeather(c.city)}>
                {c.city}
              </li>
            ))
          ) : (
            <p>No cities found...</p>
          )}
        </ul>
      </Space>
    </Space>
  );
};
export default Weatherapp;
