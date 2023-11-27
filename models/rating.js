const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const rating = mongoose.model('rating', ratingSchema);

module.exports = rating;