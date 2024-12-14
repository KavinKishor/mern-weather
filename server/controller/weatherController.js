const axios = require("axios");

const asyncHandler = require("express-async-handler");

const weatherData = asyncHandler(async (req, res) => {
  const { city } = req.query;
  const key = process.env.API_KEY;
  try {
    const weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=Metric`
    );
    const result = weather.data;
    res
      .status(200)
      .json({ message: "weather details fetched successfully", result });
  } catch (error) {
    console.log(error);
    if (error.response.status == 400 || 404) {
      return res
        .status(400)
        .json({ message: "error getting weather data city not found", error });
    }
  }
});

module.exports = { weatherData };
