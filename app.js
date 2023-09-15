const express = require("express")
const app = express()
const path = require("path")
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Campground = require("./models/campground")
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/farmStand');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.get("/",(req, res) =>{
    res.render("home")
    
})

app.get("/makecampground",async(req, res) =>{
    const camp =new Campground({
        title:"My backyard",
        description:"cheap camping"

    })
    await camp.save()
    res.send(camp)
    
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})

