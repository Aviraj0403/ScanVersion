import React from 'react';
import { CardContent, CardMedia, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import './card.css'; // Import additional CSS if needed

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
  <div className="food-menu-card relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:bg-light-orange">
    <div className="card-banner relative w-full overflow-hidden mb-2">
      <CardMedia
        component="img"
        height="auto"
        image={imageUrl}
        alt={title}
        className="card-image transition-transform duration-300 transform hover:scale-110"
      />
      {showBadge && badgeText && (
        <div className="badge absolute top-2 left-2 bg-deep-saffron text-white px-2 py-1 font-bold rounded">
          {badgeText}
        </div>
      )}
      {showButton && (
        <Button
          className="food-menu-btn absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-cinnabar text-white w-4/6 h-9 text-center leading-9 opacity-0 transition-opacity duration-300 hover:bg-deep-saffron rounded-full font-bold"
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
      <Typography variant="h6" component="div" className="card-title mb-2 font-bold text-xl">
        {title}
      </Typography>
      {children}
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
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
