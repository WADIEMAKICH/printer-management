const mongoose = require('mongoose');



const printerSchema = new mongoose.Schema({

    nom: {
        type: String,
        trim: true,
        required: [true, 'Please add a printer Name'],

    },

    adresse_ip: {
        type: String,
        trim: true,
        required: [true, 'Please add a printer ipAdress'],

    },
    toner_noir: {
        type: String,
        trim: true,
        required: [true, 'Please add a toner noir'],

    },
    toner_cyan: {
        type: String,
        trim: true,
        required: [true, 'Please add a toner cyan'],

    },
    toner_magenta: {
        type: String,
        trim: true,
        required: [true, 'Please add a toner magenta'],

    },
    toner_jaune: {
        type: String,
        trim: true,
        required: [true, 'Please add a toner magenta'],

    },

    img: {
        type: String,
        required: true,
    },



}, { timestamps: true });


module.exports = mongoose.model("Printer", printerSchema);