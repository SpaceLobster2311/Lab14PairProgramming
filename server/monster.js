'use strict';

const server = require('./server');
const coop = server.of('/coop');

let playerCount = 0;


coop.on('/connection', (socket) => {
  playerCount++;
});




