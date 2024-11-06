const { now } = require("mongoose");
const User = require("../models/user");
const Printer = require("../models/printer");
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs');



exports.signup = async (req, res, next) => {

    const { email_uti } = req.body;
    const userExist = await User.findOne({ email_uti });

    // if (userExist){

    //  return  next(new ErrorResponse('E-mail already exists', 400))
    // }

    try {
        const { nom_uti, prenom_uti, email_uti, password } = req.body;
        const hostname = req.hostname;

        const newUser = new User({
            nom_uti,
            prenom_uti,
            email_uti,
            password,
            role_uti: 0, // Assuming default role is 1
            hostname: hostname, // Save the hostname to adresse_ip_uti field
            est_confirme: false,
            imprimante_Autorises
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({
            success: true,
            newUser
        })

    } catch (error) {
        console.log(error);
        next(error);

    }

}

exports.addUser = async (req, res, next) => {

    const { email_uti } = req.body;
    const userExist = await User.findOne({ email_uti });

    // if (userExist){

    //  return  next(new ErrorResponse('E-mail already exists', 400))
    // }

    try {
        const { nom_uti, prenom_uti, email_uti, password, role_uti, est_confirme, imprimanteAutorises } = req.body;
        const hostname = req.hostname;

        const newUser = new User({
            nom_uti,
            prenom_uti,
            email_uti,
            password,
            role_uti, // Assuming default role is 1
            hostname: hostname, // Save the hostname to adresse_ip_uti field
            est_confirme,
            imprimante_Autorises: imprimanteAutorises,
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({
            success: true,
            newUser
        })

    } catch (error) {
        console.log(error);
        next(error);

    }

}

exports.updateUser = async (req, res, next) => {
    try {

        const currentUser = await User.findById(req.params.id);

        if (currentUser.email_uti !== req.body.nvEmail) {
            // Check if the new email already exists
            const existingUser = await User.findOne({ email_uti: req.body.nvEmail });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Duplicate field value entered'
                });
            }
        }


        const userUpdate = await User.findByIdAndUpdate({ '_id': req.params.id }, {
            prenom_uti: req.body.nvPrenom,
            nom_uti: req.body.nvNom,
            email_uti: req.body.nvEmail,
            password: await bcrypt.hash(req.body.nvPassword, 10),
            updatedAt: now()
        });

        res.status(200).json({
            success: true,
            userUpdate
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.updateInformationAccount = async (req, res, next) => {
    try {

        const currentUser = await User.findById(req.params.id);

        if (currentUser.email_uti !== req.body.nvEmail) {
            // Check if the new email already exists
            const existingUser = await User.findOne({ email_uti: req.body.nvEmail });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Duplicate field value entered'
                });
            }
        }


        const userUpdate = await User.findByIdAndUpdate({ '_id': req.params.id }, {
            email_uti: req.body.nvEmail,
            password: await bcrypt.hash(req.body.nvPassword, 10),
            updatedAt: now()
        });

        res.status(200).json({
            success: true,
            userUpdate
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.updateAdmin = async (req, res, next) => {
    try {

        const currentUser = await User.findById(req.params.id);

        if (currentUser.email_uti !== req.body.nvEmail) {
            // Check if the new email already exists
            const existingUser = await User.findOne({ email_uti: req.body.nvEmail });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Duplicate field value entered'
                });
            }
        }


        const userUpdate = await User.findByIdAndUpdate({ '_id': req.params.id }, {
            nom_uti: req.body.nvNom,
            prenom_uti: req.body.nvPrenom,
            email_uti: req.body.nvEmail,
            role_uti: req.body.nvRole,
            est_confirme: req.body.nvEstConfirme,
            imprimante_Autorises: req.body.nvImprimantes,
            password: await bcrypt.hash(req.body.nvPassword, 10),
            updatedAt: now()
        });

        res.status(200).json({
            success: true,
            userUpdate
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.updateInformationUser = async (req, res, next) => {
    try {

        const userUpdate = await User.findByIdAndUpdate({ '_id': req.params.id }, {
            prenom_uti: req.body.nvPrenom,
            nom_uti: req.body.nvNom,
            est_confirme: req.body.estConfirme,
            role_uti: req.body.selectedRole,
            imprimante_Autorises: req.body.nvImprimantes,
            updatedAt: now()
        });

        res.status(200).json({
            success: true,
            userUpdate
        })


    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.updateDisableUser = async (req, res, next) => {
    try {
        const userUpdate = await User.findByIdAndUpdate({ '_id': req.params.id }, {
            est_confirme: req.body.nvEstConfirme
        });

        res.status(200).json({
            success: true,
        })


    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {

    try {

        const rmUser = await User.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: " Utilisateur supprime",

        })

    } catch (error) {
        console.log(error);
        next(error);

    }

}

exports.signin = async (req, res, next) => {

    try {
        const { email_uti, password } = req.body;
        if (!email_uti || !password) {

            return next(new ErrorResponse('E-mail et le mot de passe sont requis', 400))
        }

        // check user e-mail
        const user = await User.findOne({ email_uti });
        if (!user) {

            return next(new ErrorResponse("les informations d'identification invalides", 400))
        }

        // verify user password
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {

            return next(new ErrorResponse("les informations d'identification invalides", 400))
        }

        const userConfirmation = await User.findOne({ email_uti });
        if (userConfirmation.est_confirme === false) {

            return next(new ErrorResponse("Vous devez attendre l'approbation de l'admin", 400))
        }

        generateToken(user, 200, res);
    }
    catch (error) {
        console.log(error);

        next(new ErrorResponse('Impossible de vous connecter, vérifiez vos identifiants', 400))
    }

}


const generateToken = async (user, statusCode, res) => {

    const token = await user.jwtGenerateToken();

    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.EXPIRE_TOKEN)
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token })
}


//LOG OUT USER
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out"
    })
}




exports.singleUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id);
        const printers = await Printer.find({
            adresse_ip: { $in: user.imprimante_Autorises }
        })
        res.status(200).json({
            sucess: true,
            user,
            printers
        })

    } catch (error) {
        next(error)

    }

}