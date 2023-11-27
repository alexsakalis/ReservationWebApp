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
        default: 'Available',
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    isAssigned: {
        type: Boolean,
        default: false,
    },

});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;