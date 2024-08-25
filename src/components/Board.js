import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Card from './Card';
import './Board.css';

import sound1 from '../sounds/cat.mp3';
import sound2 from '../sounds/cow.mp3';
import sound3 from '../sounds/chicken.mp3';
import sound4 from '../sounds/dog.mp3';
import sound5 from '../sounds/duck.mp3';
import sound6 from '../sounds/horse.mp3';
import sound7 from '../sounds/sheep.mp3';
import sound8 from '../sounds/elephant.wav';

// Shuffle function extracted outside to avoid re-creation on every render
const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Sound mapping
const soundMap = {
  'cat.png': sound1,
  'cow.png': sound2,
  'chicken.png': sound3,
  'dog.png': sound4,
  'duck.png': sound5,
  'horse.png': sound6,
  'sheep.png': sound7,
  'elephant.png': sound8
};

const Board = ({ images }) => {
  const [state, setState] = useState({
    cards: [],
    flippedCards: [],
    matchedCards: []
  });
  const [timer, setTimer] = useState(0);  // Timer state
  const [clicks, setClicks] = useState(0);  // Clicks counter
  const [isTimerRunning, setIsTimerRunning] = useState(false);  // To track timer state
  const [hasGameStarted, setHasGameStarted] = useState(false);  // To track if the game has started

  // Preload sounds to avoid delays when playing
  const sounds = useMemo(() => {
    return Object.keys(soundMap).reduce((acc, key) => {
      acc[key] = new Audio(soundMap[key]);
      return acc;
    }, {});
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const resetBoard = useCallback(() => {
    const shuffledCards = shuffle([...images, ...images]); // Duplicate images to get pairs
    setState({
      cards: shuffledCards.map((image, index) => ({ id: index, image, isFlipped: false })),
      flippedCards: [],
      matchedCards: []
    });
    setTimer(0);  // Reset timer
    setClicks(0);  // Reset clicks counter
    setIsTimerRunning(false);  // Stop the timer
    setHasGameStarted(false);  // Reset game started flag
  }, [images]);

  useEffect(() => {
    resetBoard();
  }, [images, resetBoard]);

  const handleCardClick = useCallback(
    (id) => {
      if (!hasGameStarted) {
        setHasGameStarted(true);
        setIsTimerRunning(true);  // Start the timer on the first card click
      }

      setClicks(prevClicks => prevClicks + 1);  // Increment clicks counter

      setState((prevState) => {
        const { cards, flippedCards, matchedCards } = prevState;

        // Prevent flipping more than 2 cards or clicking the same card twice
        if (flippedCards.length === 2 || flippedCards.includes(id) || matchedCards.includes(id)) {
          return prevState;
        }

        const newFlippedCards = [...flippedCards, id];
        const newCards = cards.map((card) =>
          card.id === id ? { ...card, isFlipped: true } : card
        );

        if (newFlippedCards.length === 2) {
          const [firstId, secondId] = newFlippedCards;
          const firstCard = cards.find((card) => card.id === firstId);
          const secondCard = cards.find((card) => card.id === secondId);

          if (firstCard.image === secondCard.image) {
            // Extract the base name without the hash
            const fullImageName = firstCard.image.split('/').pop();
            const soundKey = fullImageName.split('.')[0] + '.png'; // Ensure the key matches the soundMap keys
            
            console.log(`Playing sound for: ${soundKey}`);
            const audio = sounds[soundKey];
            
            if (audio) {
              console.log('Attempting to play sound');
              audio.currentTime = 0; // Reset audio to start
              try {
                audio.play().then(() => {
                  console.log('Sound played successfully');
                }).catch(error => {
                  console.error('Error playing sound:', error);
                });
              } catch (error) {
                console.error('Caught error while trying to play sound:', error);
              }

              return {
                cards: newCards,
                flippedCards: [],
                matchedCards: [...matchedCards, firstId, secondId]
              };
            } else {
              console.log(`No audio found for: ${soundKey}`);
            }
          } else {
            setTimeout(() => {
              setState((prevState) => ({
                ...prevState,
                cards: prevState.cards.map((card) =>
                  matchedCards.includes(card.id)
                    ? card
                    : { ...card, isFlipped: false }
                ),
                flippedCards: []
              }));
            }, 1000);
          }
        }

        return {
          ...prevState,
          cards: newCards,
          flippedCards: newFlippedCards
        };
      });

      // Check if all cards are matched
      if (state.matchedCards.length + 2 === state.cards.length) {
        setIsTimerRunning(false);  // Stop timer when all pairs are matched
        setTimeout(() => resetBoard(), 5000); // Wait 5 seconds before starting a new game
      }
    },
    [hasGameStarted, resetBoard, sounds, state.cards.length, state.matchedCards.length]
  );

  return (
    <div className="board-container">
      <div className="info-panel">
        <button onClick={resetBoard}>Reset Game</button>
        <div>Time: {timer} seconds</div>
        <div>Clicks: {clicks}</div>
      </div>
      <div className="board">
        {state.cards.map((card) => (
          <Card
            key={card.id}
            image={card.image}
            isFlipped={card.isFlipped || state.matchedCards.includes(card.id)}
            onClick={() => handleCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
