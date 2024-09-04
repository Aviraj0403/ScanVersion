import React from 'react';
import PropTypes from 'prop-types';
import { CardContent, CardMedia, Typography, Button } from '@mui/material';

const Card = ({
  imageUrl,
  title,
  subtitle,
  onButtonClick,
  buttonText,
  badgeText,
  children,
  showButton = true,
  showBadge = false,
  onButtonClickDisabled = false,
}) => (
  <div className="food-menu-card relative bg-white p-4 shadow-md border border-gray-200 rounded-lg transition-transform duration-300 transform hover:scale-105 hover:bg-orange-100 cursor-pointer">
    <div className="card-banner relative mb-2">
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={title}
        className="card-image transition-transform duration-300 transform hover:scale-110"
      />
      {showBadge && badgeText && (
        <div className="badge absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 font-bold rounded">
          {badgeText}
        </div>
      )}
      {showButton && (
        <Button
          className={`food-menu-btn absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white w-4/6 h-9 text-center leading-9 rounded-full font-bold ${onButtonClickDisabled ? 'opacity-50' : 'opacity-100'}`}
          variant="contained"
          onClick={onButtonClick}
          disabled={onButtonClickDisabled}
          aria-label={buttonText}
        >
          {buttonText}
        </Button>
      )}
    </div>
    <CardContent className="flex flex-col items-center">
      <Typography variant="h6" component="div" className="mb-2 font-bold text-xl text-center">
        {title}
      </Typography>
      {children}
      {subtitle && (
        <Typography variant="body2" color="text.secondary" className="mt-1 text-center">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </div>
);

Card.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onButtonClick: PropTypes.func,
  buttonText: PropTypes.string,
  badgeText: PropTypes.string,
  children: PropTypes.node,
  showButton: PropTypes.bool,
  showBadge: PropTypes.bool,
  onButtonClickDisabled: PropTypes.bool,
};

export default Card;
