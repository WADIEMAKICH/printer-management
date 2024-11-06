const jwt = require('jsonwebtoken');
const User = require("../models/user");
const ErrorResponse = require('../utils/errorResponse');


// check if user is authenticated
exports.isAuthenticated = async (req, res, next) =>{

    const {token} = req.cookies;

    // make sure token exists
    if (!token){
        return next (new ErrorResponse('Vous devez vous connecter pour accéder à cette ressource', 401));
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();

    } catch (error) {
        return next (new ErrorResponse('Vous devez vous connecter pour accéder à cette ressource', 401));
    }
}

// admin middleware
exports.isAdmin = (req, res, next) =>{
    if (req.user.role === 0){
        return next (new ErrorResponse('Accès refusé, vous devez être un administrateur', 401));
    }
    next();

}