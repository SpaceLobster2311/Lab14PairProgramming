// houses socket.io library
'use strict';
//event pool

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const io = require('socket.io');

const server = io(PORT);








module.exports = server;