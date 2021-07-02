'use strict';

const server = require('./server');
const coop = server.of('/coop');
const PlayerCreation = require('./PlayerCreation.js');

// Variable creation
let monster = {
  name: 'Lord Blargzhar',
  hp: 75,
};
let player1 = '';
let player2= '';

coop.on('connection', (socket) => {
  // Create player & monster objects
  if (player1 === '') {
    player1 = new PlayerCreation(socket.id);
    console.log(player1.id);
  } else {
    player2 = new PlayerCreation(socket.id);
    console.log(player2.id);
  }

  // Console logging for client purposes
  coop.emit('player create', { player1: player1, player2: player2 });

  // GAME START
  socket.on('game start', () =>{
    coop.emit('monster appears', `A wild Lord Blargzhar appears and looks angry. You can't run, should you attack or defend?`);
    
    console.log(player1, player2);
    if(monster.hp > 0){

      // To simulate each person taking their turn
      // Purely for displaying formation before each round
      let responseId = setInterval(function(){
        
        // Player moves
        socket.emit('player move');
        if(monster.hp <= 0){
          clearInterval(responseId);
        }
        
        coop.emit('current stats', { player1: player1, player2: player2, monster: monster });
      }, 1500);
      
      // Received attack move
      socket.on('attack', () => {
        monster.hp = monster.hp - 5;
        console.log('successful hit');
        if (player1.id === socket.id) {
          player1.currentMove = 'attack';
        } else if (player2.id === socket.id) {
          player2.currentMove = 'attack';
        }
        console.log('monsters health', monster.hp);
      });
      
      // Received defend move
      socket.on('defend', () => {
        console.log('Blocked!');
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

