const mongoose = require('mongoose');



const favoriteSchema = new mongoose.Schema({
        userId: { type: String },
        favorites: [{
            diseaseId: {type:String},
            disease:{type:String}, 
            images: [String], 
            type: String
        }]
});

module.exports = mongoose.model('favourites', favoriteSchema)
    

