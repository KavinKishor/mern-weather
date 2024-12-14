const City = require('../model/citymodel')
const asyncHandler = require('express-async-handler')


const getAllCities = asyncHandler(async(req,res)=>{
    try {
        const cities = await City.find({})
        res.status(200).json({success:true,message:'All saved cities are fetched',cities})
    } catch (error) {
        console.log(error);
        
        return res
          .status(400)
          .json({
            success: false,
            message: "error occured",error
          });
    }
})

const saveCity = asyncHandler(async(req,res)=>{
    const {city} = req.body
    try {
        const existingCity = await City.findOne({city})
        if(!existingCity) {
            const newcity = await new City({ city });
            await newcity.save();
        }
        const citydata = await City.find()
        res.status(200).json({success:true,message:'new city saved successfully!',citydata})
    } catch (error) {
        console.log(error);
        return res.status(400).json({success:true,message:'error occured',error})
        
    }
})

module.exports = {saveCity,getAllCities}