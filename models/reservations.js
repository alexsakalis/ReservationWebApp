const mongoose = require ('mongoose');

const reservationSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      party_size: {
        type: Number,
        required: true,
      },
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;