const express = require('express');
const { getAllPrinters, singlePrinter, remouvePrinter } = require('../controllers/getAllprintersController');
const router = express.Router();
const Printer = require("../models/printer");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "imgs");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
})

var upload = multer({
    storage: storage,
}).single("file")

router.get('/printers', getAllPrinters);
router.get('/printers/:id', singlePrinter);
router.delete('/rmprinter/:id', remouvePrinter);
router.put('/upprinter/:id', async (req, res, next) => {
    try {
        const printerUpdate = await Printer.findByIdAndUpdate({ '_id': req.params.id }, {
            nom: req.body.nvNom,
            toner_noir: req.body.nvTonerNoir,
            toner_cyan: req.body.nvTonerCyan,
            toner_magenta: req.body.nvTonerMagenta,
            toner_jaune: req.body.nvTonerJaune,
            adresse_ip: req.body.nvAdresseIP,
            updatedAt: Date.now()
        });

        res.status(200).json({
            success: true,
            printerUpdate
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

});

router.post('/addprinter', upload, (req, res) => {
    const printer = new Printer({
        nom: req.body.nom,
        adresse_ip: req.body.adresse_ip,
        toner_noir: req.body.toner_noir,
        toner_cyan: req.body.toner_cyan,
        toner_magenta: req.body.toner_magenta,
        toner_jaune: req.body.toner_jaune,
        img: req.file.filename,
    });

    printer.save()
        .then(() => res.status(200).json('Imprimante ajoutée avec succès!'))
        .catch(err => res.status(400).json('Erreur: ' + err));

});

module.exports = router;