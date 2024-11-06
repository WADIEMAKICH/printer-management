const express = require('express');
const router = express.Router();
const { signup, signin, logout, singleUser, updateDisableUser, deleteUser, updateUser, addUser, updateAdmin, updateInformationUser, updateInformationAccount } = require("../controllers/user")


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/adduser', addUser);
router.get('/logout', logout);
router.get('/user/:id', singleUser);
router.delete('/rmuser/:id', deleteUser);
router.put('/upuser/:id', updateUser);
router.put('/upInformationUser/:id', updateInformationUser);
router.put('/upInformationAccount/:id', updateInformationAccount);
router.put('/upDisableUser/:id', updateDisableUser);
router.put('/upAdmin/:id', updateAdmin);


module.exports = router;