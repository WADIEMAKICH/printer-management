const User = require("../models/user");
const Printer = require("../models/printer");
const Message = require("../models/message");
const ErrorResponse = require('../utils/errorResponse');
const snmp = require('snmp-native');

exports.signup = async (req, res, next)=>{

    const { nom_uti, prenom_uti, email_uti, password } = req.body;
    const userExist = await User.findOne({email_uti});
    const hostname = req.hostname;

    
    if (userExist){
      
     return  next(new ErrorResponse("L'email existe déjà", 400))
    }

    try {
        
        const user = new User({
            nom_uti,
            prenom_uti,
            email_uti,
            password,
            role_uti: 0, // Assuming default role is 1
            hostname: hostname, // Save the hostname to adresse_ip_uti field
            est_confirme: false,
            imprimante_Autorises:[]
        });

        await user.save();


        res.status(201).json({
            success: true,
            user
        })
        
    } catch (error) {
        console.log(error);
        next(error);
        
    }
   
}


exports.signin = async (req, res, next)=>{

    try{
        const {email_uti, password} = req.body;
        if(!email_uti || !password){
       
            return  next(new ErrorResponse('E-mail et le mot de passe sont requis', 400))
        }

        // check user e-mail
        const user = await User.findOne({email_uti});
        if(!user){
           
            return  next(new ErrorResponse("les informations d'identification invalides", 400))
        }

        // verify user password
        const isMatched = await user.comparePassword(password);
        if (!isMatched){
         
          return  next(new ErrorResponse("les informations d'identification invalides", 400))
        }
        
        const userConfirmation = await User.findOne({email_uti});
        if(userConfirmation.est_confirme === false){
        
            return  next(new ErrorResponse("Vous devez attendre l'approbation de l'admin", 400))
        }

        generateToken(user, 200, res);
    }
    catch(error){
        console.log(error);
        next(new ErrorResponse('Impossible de vous connecter, vérifiez vos identifiants', 400))
    }
   
}


const generateToken = async (user, statusCode, res) =>{

    const token = await user.jwtGenerateToken();

    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.EXPIRE_TOKEN)
    };

    res
    .status(statusCode)
    .cookie('token', token, options )
    .json({success: true, token,user})
}


//LOG OUT USER
exports.logout = (req, res, next)=>{
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out"
    })
}



// USESR PROFILE 
exports.userProfile = async (req, res, next)=>{

    const user = await User.findById(req.user.id);
    const users = await User.find({});
    const messages = await Message.find({});
    const printers = await Printer.find({
        adresse_ip:{$in:user.imprimante_Autorises}
    })

    res.status(200).json({
        sucess: true,
        user,
        messages,
        users,
        printers
    });
}


exports.singleUser = async (req, res, next)=>{

    try {
        const user = await User.findById(req.params.id);
        const printers = await Printer.find({
            adresse_ip:{$in:user.imprimante_Autorises}
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