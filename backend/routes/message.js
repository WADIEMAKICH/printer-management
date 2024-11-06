const express = require('express');
const router = express.Router();
const { createMessage, showMessage, updateMessage, deleteMessage } = require("../controllers/messageController");

router.post('/message/create', createMessage);
router.get('/messages', showMessage);
router.put('/upmessages/:id', updateMessage);
router.delete('/rmmessage/:id', deleteMessage);


module.exports = router;