const mongoose = require('mongoose');
const penjualanSchema = mongoose.Schema({
    nopenjualan     : {type: String, unique: true},
    tglpenjualan    : String,
    harga       	: String,
    jumlah	        : String,
    created_at		: String
});
module.exports = mongoose.model('penjualan', penjualanSchema);