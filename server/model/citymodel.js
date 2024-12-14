const mongoose = require('mongoose')

const cityschema = mongoose.Schema({
    city:{type:String,required:true}
})
const City = mongoose.model('city_collection',cityschema)
module.exports = City