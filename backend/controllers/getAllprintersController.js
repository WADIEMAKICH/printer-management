
const Printer = require("../models/printer");
const User = require("../models/user");
const fs = require('fs');
exports.getAllPrinters = async (req, res, next) => {
    try {
        const printers = await Printer.find({});
        res.status(200).json({
            success: true,
            printers
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

exports.singlePrinter = async (req, res, next) => {

    try {
        const printer = await Printer.findById(req.params.id);
        res.status(200).json({
            printer
        })

    } catch (error) {
        next(error)

    }

}

exports.remouvePrinter = async (req, res, next) => {

    try {
        const printerId = req.params.id;
        const printer = await Printer.findById(printerId);

        if (!printer) {
            return res.status(404).json({
                success: false,
                message: "Imprimante non trouvée",
            });
        }

        // Récupérez l'adresse IP de l'imprimante avant de la supprimer
        const printerIp = printer.adresse_ip;

        // Supprimez l'imprimante
        await Printer.findByIdAndDelete(printerId);

        // Supprimez l'adresse IP de l'imprimante de la liste imprimante_Autorises de chaque utilisateur
        await User.updateMany(
            { imprimante_Autorises: printerIp },
            { $pull: { imprimante_Autorises: printerIp } }
        );

        // Supprimer l'image du système de fichiers
        const imagePath = `imgs/${printer.img}`;
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Supprimez l'imprimante
        await Printer.findByIdAndDelete(printerId);

        res.status(201).json({
            success: true,
            message: "Imprimante supprimée avec succès",
        });

    } catch (error) {
        console.error(error);
        next(error);
    }

}

