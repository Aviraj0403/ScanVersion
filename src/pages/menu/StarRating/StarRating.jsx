import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './StarRating.css';

const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(null);

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const starRating = index + 1;
        return (
          <span
            key={starRating}
            className={`star ${starRating <= (hover || rating) ? 'filled' : ''}`}
            onClick={() => onRatingChange(starRating)}
            onMouseEnter={() => setHover(starRating)}
            onMouseLeave={() => setHover(null)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  onRatingChange: PropTypes.func.isRequired,
};

export default StarRating;
