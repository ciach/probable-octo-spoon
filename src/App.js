import React, { useState } from 'react';
import './App.css';
import Board from './components/Board';

// Import your images
import image1 from './images/cat.png';
import image2 from './images/cow.png';
import image3 from './images/chicken.png';
import image4 from './images/dog.png';
import image5 from './images/duck.png';
import image6 from './images/horse.png';
import image7 from './images/sheep.png';
import image8 from './images/elephant.png';

// Add more images as needed

const images = [image1, image2, image3, image4, image5, image6, image7, image8]; // Add all your images to this array

function App() {
  const [gameKey] = useState(0);

  return (
    <div className="App">
      <Board key={gameKey} images={images} />
    </div>
  );
}

export default App;
