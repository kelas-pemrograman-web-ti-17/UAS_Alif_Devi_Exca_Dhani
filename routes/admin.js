
var express = require('express');
var crypto = require('crypto')

var User = require('../model/user')
var Cell = require ('../model/cell')
var Penjualan = require ('../model/penjualan')
var Auth_middleware = require('../middlewares/auth')

var router = express.Router();
var secret = 'rahasia'
var session_store

/* GET users lseisting. */
router.get('/admin', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    User.find({}, function(err, user) {
        console.log(user);
        res.render('admin/home', { session_store: session_store, users: user })
    }).select('username email firstname lastname users createdAt updatedAt')
});

/* GET users listing. */
router.get('/datakonter', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Cell.find({}, function(err, datakonter) {
        //console.log(cell);
        res.render('admin/cell/table', { session_store: session_store, cells: datakonter })
    }).select('_id kodebarang provider paket jumlahstock harga created_at')
});

/* GET users listing. */
router.get('/inputcell', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/cell/input_data', { session_store: session_store})
});

//input data cell
router.post('/inputcell', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Cell.find({ kodebarang: req.body.kodebarang }, function(err, konter) {
        if (konter.length == 0) {
            var datakonter = new Cell({
                kodebarang: req.body.kodebarang,
                provider: req.body.provider,
                paket: req.body.paket,
                jumlahstock: req.body.jumlahstock,
                harga: req.body.harga,
            })
            datakonter.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/datakonter')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/datakonter')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode cell sudah ada....')
            res.render('admin/cell/input_data', {
                session_store: session_store,
                kodebarang: req.body.kodebarang,
                provider: req.body.provider,
                paket: req.body.paket,
                jumlahstock: req.body.jumlahstock,
                harga: req.body.harga,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editcell', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Cell.findOne({ _id: req.params.id }, function(err, konter) {
        if (konter) {
            console.log("cellsss"+konter);
            res.render('admin/cell/edit_data', { session_store: session_store, cells: konter })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/datakonter')
        }
    })
})

router.post('/:id/editcell', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Cell.findById(req.params.id, function(err, cell) {
        cell.kodebarang = req.body.kodebarang;
        cell.provider = req.body.provider;
        cell.paket = req.body.paket;
        cell.jumlahstock = req.body.jumlahstock;
        cell.harga = req.body.harga;

        cell.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/datakonter');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Cell.findById(req.params.id, function(err, konter){
        konter.remove(function(err, konter){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data cell berhasil dihapus!');
            }
            res.redirect('/datakonter');
        })
    })
})




/* GET users listing. */
router.get('/penjualan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Penjualan.find({}, function(err, datapenjualan) {
        //console.log(cell);
        res.render('admin/penjualan/table', { session_store: session_store, penjualann: datapenjualan })
    }).select('_id nopenjualan tglpenjualan jumlah harga created_at')
});

/* GET users listing. */
router.get('/inputpenjualan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session
    res.render('admin/penjualan/input_data', { session_store: session_store})
});

//input penjualan
router.post('/inputpenjualan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Penjualan.find({ nopenjualan: req.body.nopenjualan }, function(err, jual) {
        if (jual.length == 0) {
            var datapenjualan = new Penjualan({
                nopenjualan: req.body.nopenjualan,
                tglpenjualan: req.body.tglpenjualan,
                jumlah: req.body.jumlah,
                harga: req.body.harga,
            })
            datapenjualan.save(function(err) {
                if (err) {
                    console.log(err);
                    req.flash('msg_error', 'Maaf, nampaknya ada masalah di sistem kami')
                    res.redirect('/penjualan')
                } else {
                    req.flash('msg_info', 'User telah berhasil dibuat')
                    res.redirect('/penjualan')
                }
            })
        } else {
            req.flash('msg_error', 'Maaf, kode cell sudah ada....')
            res.render('admin/penjualan/input_data', {
                session_store: session_store,
                nopenjualan: req.body.nopenjualan,
                tglpenjualan: req.body.tglpenjualan,
                jumlah: req.body.jumlah,
                harga: req.body.harga,
            })
        }
    })
})

//menampilkan data berdasarkan id
router.get('/:id/editpenjualan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Penjualan.findOne({ _id: req.params.id }, function(err, jual) {
        if (jual) {
            console.log("jualanss"+jual);
            res.render('admin/penjualan/edit_data', { session_store: session_store, penjualann: jual })
        } else {
            req.flash('msg_error', 'Maaf, Data tidak ditemukan')
            res.redirect('/penjualan')
        }
    })
})

router.post('/:id/editpenjualan', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    session_store = req.session

    Penjualan.findById(req.params.id, function(err, juall) {
        juall.nopenjualan = req.body.nopenjualan;
        juall.tglpenjualan = req.body.tglpenjualan;
        juall.jumlah = req.body.jumlah;
        juall.harga = req.body.harga;

        juall.save(function(err, user) {
            if (err) {
                req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem kami...');
            } else {
                req.flash('msg_info', 'Edit data berhasil!');
            }

            res.redirect('/penjualan');

        });
    });
})

router.post('/:id/delete', Auth_middleware.check_login, Auth_middleware.is_admin, function(req, res, next) {
    Penjualan.findById(req.params.id, function(err, penjualan){
        penjualan.remove(function(err, penjualan){
            if (err)
            {
                req.flash('msg_error', 'Maaf, kayaknya user yang dimaksud sudah tidak ada. Dan kebetulan lagi ada masalah sama sistem kami :D');
            }
            else
            {
                req.flash('msg_info', 'Data cell berhasil dihapus!');
            }
            res.redirect('/penjualan');
        })
    })
})
module.exports = router;