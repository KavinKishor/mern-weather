const express = require("express");
const { weatherData } = require("./controller/weatherController");
const { getAllCities, saveCity } = require("./controller/cityController");

const router = express.Router();
router.route("/weather").get(weatherData);
router.route("/allcities").get(getAllCities);
router.route("/city").post(saveCity);

module.exports = router;
