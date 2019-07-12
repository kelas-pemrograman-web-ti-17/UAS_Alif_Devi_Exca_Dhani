const mongoose = require('mongoose');
const cellSchema = mongoose.Schema({
    kodebarang       : {type: String, unique: true},
    provider		: String,
    paket    	    : String,
    jumlahstock	    : String,
    harga	        : String,
    created_at		: String
});
module.exports = mongoose.model('cell', cellSchema);