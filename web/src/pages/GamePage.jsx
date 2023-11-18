import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import { SocketContext } from "../../socket";

export const GamePage = () => {
    const params = new URLSearchParams(window.location.search);
    const [questionIndex, setQuestionIndex] = useState(0) //24
    const [isConnection, setIsConnection] = useState(false);
    const [countdown, setCountdown] = useState(3); 
    const [showSummary, setShowSummary] = useState(false)
    const [numberOfAnswers, setNumberOfAnswers] = useState(0)
    const gameId = params.get('id');
    const [results, setResults] = useState([])
    const [questionsData, setQuestionsData] = useState([])
    const socket = useContext(SocketContext)
    const [correct,setCorrect] = useState(0)
    const [uncorrect, setUncorrect] = useState(0)
    const [ladeboard, setLadeboard] = useState([])
    const handleNextQuestion = () => {

        if(questionIndex <= 23)
        {
            const grouped = results.reduce((acc, curr) => {
                const { playerId, playerName, correct } = curr;
                if (!acc[playerId]) {
                    acc[playerId] = {
                        playerId,
                        playerName,
                        correctAnswers: 0,
                    };
                }
                if (correct) acc[playerId].correctAnswers++;

                return acc;
            }, {});

            const leaderboard = Object.values(grouped)
            .sort((a, b) => b.correctAnswers - a.correctAnswers);

            setLadeboard(leaderboard)
            setCountdown(3)
            setNumberOfAnswers(0)
            setCorrect(0)
            setUncorrect(0)
            setQuestionIndex(index => index + 1)

            if(socket)
                socket.emit('nextQuestion', gameId);
        }else {
            setShowSummary(true)
            socket.emit('endGame', gameId)
        };
    }
    useEffect(() => {
        fetch(import.meta.env.VITE_REACT_API_URL + '/questions')
        .then(e => e.json())
        .then(e => setQuestionsData(e))

        socket.on('correct', (playerId, playerName) => {
            setCorrect(e => e + 1)
            results.push({
                playerId: playerId,
                playerName: playerName,
                correct: true
            })
            setNumberOfAnswers(prevNumberOfAnswers => prevNumberOfAnswers + 1)
        })

        socket.on('uncorrect', (playerId, playerName) => {
            setUncorrect(e => e + 1)
            results.push({
                playerId: playerId,
                playerName: playerName,
                correct: false
            })
            setNumberOfAnswers(prevNumberOfAnswers => prevNumberOfAnswers + 1)
        })

        socket.on('connect', () => socket.emit('joinGame', gameId));

        const countdownInterval = setInterval(() => setCountdown(prevCountdown => prevCountdown - 1), 1000);

        return () => {
            clearInterval(countdownInterval); 
        };

    }, []);

    return (
        <div>
            {!showSummary ? (
        <div>   
        {
            isConnection && questionsData.length == 0 ? <h1>Loading...</h1> : <h1>{countdown >= 0 ? countdown : (
                <div>
                    <h2 style={{margin: 0}}>{questionsData[questionIndex].title}</h2>
                    <p style={{margin: 10, fontSize: 30, fontWeight: 'normal'}}>Liczba odpowedzi: {numberOfAnswers} Poprawne: {correct} Niepoprawne: {uncorrect}</p>
                    <div className="answers-holder">
                        <div>
                            <div className="answer red">
                                <p style={{margin: 0, fontWeight: 'normal'}}>A) {questionsData[questionIndex].a}</p>
                            </div>
                            <div className="answer green">
                                <p style={{margin: 0, fontWeight: 'normal'}}>B) {questionsData[questionIndex].b}</p>
                            </div>
                        </div>
                        <div>
                            <div className="answer blue">
                                <p style={{margin: 0, fontWeight: 'normal'}}>C) {questionsData[questionIndex].c}</p>
                            </div>
                            <div className="answer purple">
                                <p style={{margin: 0, fontWeight: 'normal'}}>D) {questionsData[questionIndex].d}</p>
                            </div>
                        </div>
                    </div>
                    <button style={{marginTop: 30, fontSize: 30}} onClick={handleNextQuestion}>Następne pytanie</button>
                </div>
                
            )}</h1>
        }
        </div>): 
            <div>
            <h1 style={{fontSize: 100}}>WYNIKI:</h1>    
            {
                ladeboard.map((e,index) => (
                    <div key={e.playerId}>
                        <p style={{fontSize: 30}}>{index + 1}. {e.playerName} : {e.correctAnswers}/25</p>
                    </div>
                ))
            }
                <Link to={'/'}>Od nowa</Link>
            </div>
            }
        </div>
    );
};
