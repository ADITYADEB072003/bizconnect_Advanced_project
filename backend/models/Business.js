
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    businessName: String,
    ownerName: String,
    email: { type: String, unique: true },
    password: String,
    category: String,
    description: String,
    location: String,
});

module.exports = mongoose.model('Business', businessSchema);
