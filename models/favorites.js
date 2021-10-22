const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    favID: {
        type: Number,
        required: true
    }
}, { timestamps: true });


const Favorite = mongoose.model('favorites', favoriteSchema);

module.exports = Favorite;