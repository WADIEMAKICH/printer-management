const express = require('express');
const router = express.Router();
const printerController = require('../controllers/printerController');
const { getAllPrinters } = require('../controllers/getAllprintersController');





router.get('/printer/:adresse', printerController.getPrinterUsage);

module.exports = router;