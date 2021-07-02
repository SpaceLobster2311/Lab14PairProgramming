'use strict';

require('dotenv').config();
const io = require('socket.io-client');
const BASE_URL = process.env.BASE_URL;
const EXTENSION = process.env.EXTENSION;
const client = io.connect(`${BASE_URL}/${EXTENSION}`);

let player2 = {
  id: null,
};

// Welcome message before game
client.on('player create', (player) => {
  if(player.player2 !== ''){
    console.log('Welcome', player);
    
  }
  if(player.player2){
    client.emit('game start');
  }

});

// Game start
client.on('monster appears', (message) => {
  console.log(message);



  client.on('current stats', ({ player1: player1, player2: player2, monster: monster }) => {
    console.log(`The current health points of player 1 is ${player1.hp}`);
    console.log(`The current health points of player 2 is ${player2.hp}`);
    console.log(`The current health points of Lord Blargzhar is ${monster.hp}`);
  });

  client.on('player move', () => {
    // RNG for player move
    let num = Math.floor(Math.random() * 2);
    console.log(num);

    // 1 is attack, 0 is defend
    if (num === 1) {
      client.emit('attack');
    } else {
      client.emit('defend');
    }
  });
  client.on('game won', () => {
    console.log('Congratulations, Lord Blargzhar has fainted!');
  });

  client.on('game loss', () => {
    console.log('The last hit did you in, you lose consciousness... Game over.');
  });

});
