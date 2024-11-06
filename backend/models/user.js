const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const os = require('os');

// Obtenez le nom d'hôte de la machine
const hostname = os.hostname();

const userSchema = new mongoose.Schema({

    nom_uti: {
        type: String,
        trim: true,
        required: [true, 'Veuillez ajouter un nom'],
        maxlength: 32
    },
    prenom_uti: {
        type: String,
        trim: true,
        required: [true, 'Veuillez ajouter un nom'],
        maxlength: 32
    },

    email_uti: {
        type: String,
        trim: true,
        required: [true, 'Veuillez ajouter un e-mail'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Veuillez ajouter un e-mail valide'
        ]

    },

    password: {
        type: String,
        trim: true,
        required: [true, 'Veuillez ajouter un mot de passe'],
        minlength: [6, 'le mot de passe doit comporter au moins six (6) caractères'],
        match: [
            /^(?=.*\d)(?=.*[@#\-_$%^&+=§!\?])(?=.*[a-z])(?=.*[A-Z])[0-9A-Za-z@#\-_$%^&+=§!\?]+$/,
            'Le mot de passe doit contenir au moins 1 lettre majuscule, 1 lettre minuscule, 1 chiffre et un caractère spécial'
        ]
    },

    role_uti: {
        type: Number,
        default: 0,

    },

    hostname: {
        type: String,
        default: hostname
    },

    est_confirme: {
        type: Boolean,
        default: false
    },

    imprimante_Autorises: {
        type: [String],
        default: []
    }



}, { timestamps: true });



// encrypting password before saving
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
});



// verify password
userSchema.methods.comparePassword = async function (yourPassword) {
    return await bcrypt.compare(yourPassword, this.password);
}

// get the token
userSchema.methods.jwtGenerateToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
}


module.exports = mongoose.model("User", userSchema);