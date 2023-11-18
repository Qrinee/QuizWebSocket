import { Input, Layout, Text, Button, ButtonGroup, ListItem } from "@ui-kitten/components";
import  io  from "socket.io-client";
import {useEffect, useState} from 'react'
import { API_URL } from '@env';
import { ScrollView } from "react-native";
export const LobbyScreen = ({ route, navigation }) => {
    const { playerId, gameId, playerName } = route.params;
    const [users, setUsers] = useState([]);
    const socket = io(API_URL);
    const [load, setLoad] = useState(<></>)
    const handleDisconnect = () => {
        socket.disconnect();
        fetch(API_URL + '/users/' + playerId, { method: 'DELETE'})
        .then(() => navigation.navigate('Home'))
        .catch(error => console.error('Error disconnecting user:', error));
    };

    useEffect(() => {
        fetch(API_URL + '/users/' + gameId)
        .then(response => response.json())
        .then(data => Array.isArray(data) ? setUsers(data) : console.error('Otrzymano nieprawidłową odpowiedź z serwera'))
        .catch(error => console.error(error))

        socket.on('receive-message', () => {
            fetch(API_URL + '/users/' + gameId)
            .then(response => response.json())
            .then(data => Array.isArray(data) ? setUsers(data) : console.error('Otrzymano nieprawidłową odpowiedź z serwera'))
            .catch(error => console.error(error))
        })
        socket.on('counter', () => {
            setLoad(<Text category="h1" style={{ fontSize: 30, textAlign: 'center', marginBottom: 20 }}>START</Text>)
            navigation.navigate('Game', {
                playerId: playerId,
                gameId: gameId,
                playerName: playerName
            })
        })

        socket.on('connect', () => socket.emit('joinGame', gameId));
        socket.on('gameEvent', (data) => console.log("Otrzymano dane od serwera: ", data));

        return () => {
            socket.disconnect();
            fetch(API_URL + '/users/' + playerId, { method: 'DELETE'})
            .then(() => console.log('User disconnected and removed'))
            .catch(error => console.error('Error disconnecting and removing user:', error));
        };
    }, []);

    return (
        <Layout style={{flex: 1}}>
        <ScrollView>
            <Layout style={{ flex: 1, paddingTop: 80, paddingLeft: 50, paddingRight: 50 }}>
                {load}
                <Text category="h1" style={{ fontSize: 30, textAlign: 'center', marginBottom: 20 }}>Numer pokoju: {gameId}</Text>
                {users.map(user => (
                    <ListItem key={user.id} title={user.nick} description={"id gracza: " + user.id} />
                ))}
                <Button status="danger" onPress={handleDisconnect}>{"Wyjdź z gry"}</Button>
            </Layout>
        </ScrollView>
        </Layout>
    );
};