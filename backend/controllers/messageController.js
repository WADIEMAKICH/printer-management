const Message = require("../models/message");
const ErrorResponse = require('../utils/errorResponse');


exports.createMessage = async (req, res, next) => {
    try {
        const nv_Message = await Message.create(req.body);
        res.status(201).json({
            success: true,
            nv_Message
        })

    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.showMessage = async (req, res, next) => {
    try {
        const messages = await Message.find({}).sort({ vue: false, createdAt: -1 });
        res.status(200).json({
            success: true,
            messages
        })
    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.updateMessage = async (req, res, next) => {
    try {
        const messageUpdate = await Message.findByIdAndUpdate({ '_id': req.params.id }, {
            vue: req.body.nvVue
        });

        res.status(200).json({
            success: true,
        })


    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.deleteMessage = async (req, res, next) => {

    try {

        const rmMessage = await Message.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: " Message supprime",

        })

    } catch (error) {
        console.log(error);
        next(error);

    }

}