const mongoose = require("mongoose")
const Schema = mongoose.Schema;
    
const CampgroundSchema = new Schema({
    title: String,
    image:String,
    price:Number,
    description:String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})
module.exports = mongoose.model("Campground", CampgroundSchema);
// // mongoose.model("Campground", CampgroundSchema) creates a Mongoose model named "Campground" 
// using the provided schema, "CampgroundSchema." This model allows you to interact with
// documents in the "Campground" collection, such as creating, reading, updating, 
//and deleting documents.