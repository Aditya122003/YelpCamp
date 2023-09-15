const express = require("express");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path")

app.set("views",path.join(__dirname,"views"))
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

app.get("/",(req, res) =>{
    res.render("home")
    
})
app.listen(3000, () => {
    console.log("Serving on port 3000")
})

