// src/components/PromoCard.js
import React from 'react';
import PropTypes from 'prop-types';
import './PromoCard.css';

const PromoCard = ({ promoType = 'default', title, description }) => (
  <div className={`promo-card promo-card--${promoType}`}>
    <div className="promo-card-image" />
    <div className="promo-card-content">
      <div className="promo-card-icon" />
      <h3 className="promo-card-title">{title}</h3>
      <p className="promo-card-description">{description}</p>
    </div>
  </div>
);

PromoCard.propTypes = {
  promoType: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default React.memo(PromoCard);
