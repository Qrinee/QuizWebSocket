import { useEffect, useState, useMemo, createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { SocketContext } from "../../socket";
export const LobbyPage = () => {
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('id');
    const navigate = useNavigate();
    const socket = useContext(SocketContext)
    const handleStartGame = () => {
        if (socket) {
            socket.emit('startGame', gameId);
            navigate('/game?id=' + gameId);
        }
    };

    const [players, setPlayers] = useState([]);
    const fetchPlayers = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_REACT_API_URL + '/users/' + gameId);
            if (response.ok) {
                const data = await response.json();
                setPlayers(data);
            } else {
                throw new Error('Fetch failed with status: ' + response.status);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        socket.on('receive-message', () => {});
        socket.on('error', () => {
            console.log("xddd");
        });

        socket.on('connect', () => {
            console.log("connected");
            fetchPlayers();
            socket.emit('joinGame', gameId);
        });

        socket.on('updatePlayers', () => {
            console.log("UPDATE")
            fetchPlayers();
        });

        socket.on('disconnect', () => {
            fetchPlayers()
        });

        fetchPlayers();

        return () => {
        };
    }, [gameId]);

    const playersList = useMemo(() => {
        return players.map(player => (
            <div key={player.id}>
                <p style={{fontSize: 30, margin: 0}}>{player.nick}</p>
            </div>
        ));
    }, [players]);

    return (
        <div>
            <h1>Quiz</h1>
            <p>ID GRY:</p>
            <p style={{fontSize: 150, margin: 0, padding: 0, fontWeight: 'bold'}}>{gameId}</p>
            <button onClick={handleStartGame}>START</button>
            <p>Lista graczy:</p>
            {playersList}
        </div>
    );
};
