const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp'); //INSIDE FUNCTION WE CONNECT THE DATABASE
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}

seedDB()