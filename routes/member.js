var express = require('express');
var crypto = require('crypto');

var User = require('../model/user')
var Cell = require ('../model/cell')
var Penjualan = require ('../model/penjualan')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users listing. */
router.get('/member', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    })
});

/* GET users listing. */
router.get('/fakemember', Auth_middleware.check_login, Auth_middleware.is_member, function(req, res, next) {
    session_store = req.session

    Cell.find({}, function (err, datakonter) {
        console.log(datakonter);
        res.render('admin/cell/table', {session_store: session_store, cells: datakonter})
    }).select('_id kodebarang provider paket jumlahstock harga Rp. created_at')
});

module.exports = router;