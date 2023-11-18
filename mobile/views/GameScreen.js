import { Input, Layout, Text, Button, Spinner } from "@ui-kitten/components";
import { API_URL } from '@env'
import { useState } from 'react';
import { io } from 'socket.io-client'
import { useEffect } from 'react';
import { TouchableOpacity, View } from "react-native";

export const GameScreen = ({ route }) => {
    const [isConnecting, setIsConnection] = useState(true);
    const [countdown, setCountdown] = useState(3);
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [shouldShowButtons, setShouldShowButtons] = useState(true)
    const [curSocket, setCurSocket] = useState(null)
    const [info, setInfo] = useState('Czekaj na następne pytanie...')
    const { playerId, gameId, playerName } = route.params;

    const handleAnswer = (answer) => {
        if(curSocket)
        {
            curSocket.emit('answer', {playerId, playerName, gameId, answer: {answer}, question: currentQuestion})
            setShouldShowButtons(false)
            setCurrentQuestion(question => question + 1)
        }
    }


    useEffect(() => {
        const socket = io(API_URL);
        setCurSocket(socket)
        socket.on('connect', () => {
            console.log("connected to " + gameId)
            setIsConnection(false)
            socket.emit('joinGame', gameId);
        });
        socket.on('next', () => {
            setCountdown(3)
            setShouldShowButtons(true)
        })

        socket.on('end', () => {
            setInfo('Koniec, zobacz wyniki!')
        })
        const countdownInterval = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1); 
        }, 1000);

        return () => {
            clearInterval(countdownInterval); 
            socket.disconnect();
            fetch(API_URL + '/users/' + playerId, {
                method: 'DELETE'
            })
            .then(() => {
                console.log('User disconnected and removed');
            })
            .catch(error => {
                console.error('Error disconnecting and removing user:', error);
            });
        };
    }, []);

    return (
        <Layout style={{ flex: 1 }}>
        {isConnecting ? (
          <Spinner size="giant" />
        ) : (
          countdown >= 0 ? (
            <Layout style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', fontSize: 70, fontWeight: 'bold' }}> 
                <Text style={{fontSize: 70, fontWeight: 'bold'}}>{countdown}</Text>
            </Layout>
          ) : (
            <View style={{ width: '100%', height: '100%', flexDirection: 'row' }}>
                {shouldShowButtons ? (
                    <>
                <View style={{ width: '50%', height: '50%' }}>
                <TouchableOpacity onPress={() => handleAnswer('a')}>
                  <View style={{ backgroundColor: '#eb4034', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 80, fontWeight: 'bold' }}>A</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAnswer('b')}>
                  <View style={{ backgroundColor: '#5ce45c', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 80, fontWeight: 'bold' }}>B</Text>
                  </View>
                </TouchableOpacity>
              </View>
  
              <View style={{ width: '50%', height: '50%' }}>
                <TouchableOpacity onPress={() => handleAnswer('c')}>
                  <View style={{ backgroundColor: 'rgb(61, 90, 255)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 80, fontWeight: 'bold' }}>C</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleAnswer('d')}>
                  <View style={{ backgroundColor: 'rgb(171, 67, 240)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 80, fontWeight: 'bold' }}>D</Text>
                  </View>
                </TouchableOpacity>
              </View>
                    </>
                ): (
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
                        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{info}</Text>
                    </View>
                )}

            </View>
          )
        )}
      </Layout>
    );
};
