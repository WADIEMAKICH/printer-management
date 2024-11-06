const mongoose = require('mongoose');



const messageSchema = new mongoose.Schema({

    nom_vis: {
        type: String,
        trim: true,
        required: [true, 'Veuillez ajouter votre nom'],

    },

    email_vis: {
        type: String,
        trim: true,
        required: [true, 'Veuillez ajouter votre e-mail'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez ajouter un e-mail valide']
    },

    sujet_vis: {
        type: String,
        trim: true,
        required: [true, 'Veuillez ajouter votre sujet'],
        maxlength: 2000,
    },

    vue: {
        type: Boolean,
        default: false
    },

    contenu_vis: {
        type: String,
        trim: true,
        required: [true, 'Veuillez ajouter votre contenu'],
        maxlength: 2000,
    },



}, { timestamps: true });






module.exports = mongoose.model("Message", messageSchema);