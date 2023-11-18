import { Input, Layout, Text, Button } from "@ui-kitten/components";
import {API_URL} from '@env'
import { useState } from 'react';


export const HomeScreen = ({navigation}) => {
    const [gameCode, setGameCode] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [message, setMessage] = useState('')
    const handleJoinGame = () => {
        if (isNaN(gameCode)) {
            console.error('Podane ID gry nie jest liczbą');
            return;
        }
        fetch(API_URL + '/join-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameCode: parseInt(gameCode),
                playerName: playerName || "Gracz" 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            navigation.navigate('Lobby', {
                playerId: data.playerId,
                gameId: data.gameId,
                playerName: playerName
            });
        })
        .catch(error => {
            setMessage(error.message + " " + API_URL);
        });
    };
    return(
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text category='h1'>Dołącz do gry:</Text>
          <Input placeholder="Id gry..." label={"Podaj id gry"} style={{width: '70%', marginTop: 20}} value={gameCode} onChangeText={(id) => setGameCode(id)} />
          <Input placeholder="Nick gry..." label={"Podaj swój nick"} style={{width: '70%', marginTop: 20}} value={playerName} onChangeText={(name) => setPlayerName(name)} />
          <Button style={{width: '70%', marginTop: 20}} onPress={handleJoinGame}>Dołącz</Button>
          <Text>{message}</Text>
        </Layout>
    )
};