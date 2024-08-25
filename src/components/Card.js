import React from 'react';
import './Card.css';

// Import the cover image
import coverImage from '../images/card_back.png';

const Card = ({ image, isFlipped, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <img src={isFlipped ? image : coverImage} alt="memory card" />
    </div>
  );
};

export default Card;
