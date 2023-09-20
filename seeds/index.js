const express = require("express")
const app = express()
const path = require("path")
const cities=require("./cities")
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Campground = require("../models/campground")
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

const seeddb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save()
    }
}
seeddb().then(() => {
    mongoose.connection.close();
})