const mongoose = require('mongoose');

const AutentificateSchema = mongoose.Schema({
 	login: String,
 	password: String,
 	access: String

}, {
    timestamps: true
});
AutentificateSchema.index({key: 1});

module.exports = mongoose.model('autentificate', AutentificateSchema);