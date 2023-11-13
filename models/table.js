const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Occupied', 'Reserved'],
        default: 'Available'
    }
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;