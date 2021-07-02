'use strict';

const server = require('./server');
const coop = server.of('/coop');
const PlayerCreation = require('./PlayerCreation.js');

// Variable creation
let monster = {
  name: 'Lord Blargzhar',
  hp: 75,
}
let player1;
let player2;

coop.on('connection', (socket) => {
  // Create player & monster objects
  if (!player1) {
    player1 = new PlayerCreation(socket.id);
    console.log(player1.id);
  } else {
    player2 = new PlayerCreation(socket.id);
    console.log(player2.id);
  }

  // Console logging for client purposes
  coop.emit('player create', { player1: player1, player2: player2 });

  // GAME START
  socket.emit('monster appears', `A wild Lord Blargzhar appears and looks angry. You can't run, should you attack or defend?`);

  socket.on('start round', () => {
    console.log(player1, player2);
    if (player2 && player1) {

      if (monster.hp <= 0) {
        socket.emit('game won');
      }

      // To simulate each person taking their turn
      // Purely for displaying formation before each round
      coop.emit('current stats', { player1: player1, player2: player2, monster: monster });

      // Player moves
      socket.emit('player move');

      // Received attack move
      socket.on('attack', () => {
        console.log('monsters health', monster.hp);
        monster.hp = monster.hp - 5;
        if (player1.id === socket.id) {
          player1.currentMove = 'attack';
        } else if (player2.id === socket.id) {
          player2.currentMove = 'attack';
        }
      });

      // Received defend move
      socket.on('defend', () => {
        if (player1.id === socket.id) {
          player1.hp = player1.hp + 5;
          player1.currentMove = 'defend';
        } else if (player2.id === socket.id) {
          player2.hp = player2.hp + 5;
          player2.currentMove = 'defend';
        }
      });
    }
  });
});

