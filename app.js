const express = require("express")
const app = express()
const path = require("path")
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate")
const Joi = require('joi');
const { campgroundSchema,reviewSchema } = require('./schemas.js')
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const methodOverride = require('method-override')
const Review=require("./models/review")

const Campground = require("./models/campground")
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
app.engine("ejs", ejsMate)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
//We know that forms really only send a get or post request from the browser so we can take a put,patch ,delete so on using method-override

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

const validateReview= (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home")

})

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
})
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError("Invalid campground data",400)
    //here we have to use urlencoded line to parse our req.body
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    res.render("campgrounds/show", { campground })
}))
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", { campground })
}))

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")

}))

app.post("/campground/:id/reviews",validateReview, catchAsync(async (req, res) =>
{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("page not found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Oh No,Something went wrong!"
    res.status(statusCode).render("error", { err });
})


app.listen(3000, () => {
    console.log("Serving on port 3000")
})

