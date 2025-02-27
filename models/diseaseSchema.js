const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true,
    },
    preparation: {
        type: String,
        required: true,
    },
    nutrition: {
        type: String,
        required: true
    },

});

const recipeSchema = new mongoose.Schema({
    disease: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    restricted: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('diseases', recipeSchema)
    

