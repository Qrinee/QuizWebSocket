import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import qr from './assets/qr.png'
import './App.css';
import { useNavigate } from 'react-router-dom';
function App() {
  const [name, setName] = useState('');
  const [id, setId] = useState(null);
  const navigate = useNavigate();

  const handleCreateGame = () => {
    fetch(import.meta.env.VITE_REACT_API_URL + '/create-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameName: name,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setId(data.gameId);
        navigate('/lobby?id=' + data.gameId); 
      })
      .catch(error => {
        console.error('Błąd podczas tworzenia gry:', error);
      });
  };

  const handleNameChange = event => setName(event.target.value);
  return (
    <>
    <div style={{display: 'flex'}}>
      <div>
      <h1>Websocket Quiz</h1> 
      <p>Qrin 2023</p>
      <div>
        <input
          type='text'
          value={name}
          onChange={handleNameChange}
          style={{ padding: '10px', borderRadius: '10px', border: 0, margin: 10 }}
          placeholder='Nazwa gry...'
        />
      </div>
      
      <button onClick={handleCreateGame}>Stwórz grę</button>
      <p>Pobierz aplikację mobilną by móc dołączyć do gry</p>
      </div>
      <div>
      <br />
        <img src={qr} width={300} style={{marginLeft: 70}} />
      </div>
    </div>
    </>
  );
}

export default App;
