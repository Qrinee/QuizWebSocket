const express = require('express');
const http = require('http');

const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const server = http.createServer(app);
const socketIo = require('socket.io')
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

app.use(cors())



//setup your connection here
const connection = mysql.createConnection({
  host: 'host',
  user: 'user',
  password: 'password',
  database: 'database'
});

connection.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    throw err;
  }
  console.log('Połączenie z bazą danych MySQL zostało nawiązane');
});

app.use(bodyParser.json());

app.post('/create-game', (req, res) => {
    const { gameName } = req.body;
  
    const game = {
      game_name: gameName,
    };
  
    connection.query('INSERT INTO games SET ?', game, (error, results, fields) => {
      if (error) {
        console.error('Błąd podczas zapisu gry do bazy danych:', error);
        res.status(500).send('Wystąpił błąd podczas tworzenia gry');
        return;
      }
  
      const gameId = results.insertId;
  
      res.status(200).send({ gameId });
    });
});


app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  fetchPlayers(userId, (error, players) => {
    if (!error) {
      res.json(players);
    } else {
      res.status(500).send({ message: "Błąd podczas pobierania graczy z bazy danych" });
    }
  });
});

app.get('/questions', async (req, res) => {
  connection.query('SELECT * FROM questions', (error, results, fields) => {
    if(error) {
      console.error('Bląd w /questions')
      res.status(500).send({message: "Błąd w /questions"})
      return;
    }
    res.status(200).send(results)
  })
})

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('DELETE FROM players WHERE id = ?', userId, (error, results, fields) => {
    if (error) {
      console.error('Błąd podczas usuwania gracza z bazy danych', error);
      res.status(500).send({ message: "Błąd podczas usuwania gracza z bazy danych" });
      return;
    }
    
    res.status(200).send({ message: "Gracz został pomyślnie usunięty" });
  });
});

app.post('/join-game', async (req, res) => {
    const { gameCode, playerName } = req.body;
  
    connection.query('SELECT * FROM games WHERE id = ?', gameCode, async (error, results, fields) => {
      if (error) {
        console.error('Błąd podczas sprawdzania gry w bazie danych:', error);
        res.status(500).send({message: "Wystąpił błąd podczas dołączania do gry"});
        return;
      }
  
      if (results.length === 0)
        res.status(404).send({message: "Gra o podanym kodzie nie istnieje"});
      else {
        const game = results[0];
        try {
          const playerId = await createPlayer(playerName, game.id);
          res.status(200).send({ playerId: playerId, gameId: game.id });
        } catch (error) {
          console.error('Błąd podczas tworzenia gracza:', error);
          res.status(500).send({message: 'Wystąpił błąd podczas tworzenia gracza'});
        }
      }
    });
});
function createPlayer(playerName, gameId) {
    const player = {
      nick: playerName,
      game_id: gameId,
    };
  
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO players SET ?', player, (error, results, fields) => {
        if (error) {
          console.error('Błąd podczas zapisu gracza do bazy danych:', error);
          reject(error);
          return;
        }
        const playerId = results.insertId;
        io.sockets.to(`game_${gameId}`).emit({ playerName });
        resolve(playerId); 
      });
    });
}

function fetchPlayers(gameId, callback) {
  connection.query('SELECT * FROM players WHERE game_id = ?', gameId, (error, results, fields) => {
    if (error) {
      console.error('Błąd podczas pobierania graczy z bazy danych', error);
      callback(error, null);
      return;
    }

    callback(null, results);
  });
}


io.on('connection', (socket) => {
  socket.on('joinGame', (gameId) => {
    socket.join(`game_${gameId}`);
    socket.in(`game_${gameId}`).emit('updatePlayers');
  });

  socket.on('nextQuestion', (gameId) => {
    socket.in(`game_${gameId}`).emit('next')
  })

  socket.on('answer', ({ playerId, playerName, gameId, answer, question }) => {

    connection.query('SELECT * FROM questions WHERE id = ?', [question + 1], (error, results, fields) => {
      if (error) {
        console.error('Błąd w /questions', error);
        res.status(500).send({ message: "Błąd w /questions" });
        return;
      }
      const correctAnswer = results[0].correct;
      if (correctAnswer == answer.answer) {
        socket.in(`game_${gameId}`).emit('correct', playerId, playerName);
      } else {
        socket.in(`game_${gameId}`).emit('uncorrect', playerId, playerName);
      }
    });
  });

  socket.on('dc', (gameId) => {
    socket.in(`game_${gameId}`).emit('updatePlayers')
  })

  socket.on('startGame', (gameId) => {
    socket.in(`game_${gameId}`).emit('counter')
  })

  socket.on('endGame', (gameId) => {
    socket.in(`game_${gameId}`).emit('end')
  })
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});
