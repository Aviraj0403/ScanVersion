import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { formatCurrency } from '../../utils/helpers.js';
import { addItem, removeItem, getCurrentQuantityById } from '../cart/cartSlice.js';
import UpdateItemQuantity from '../cart/UpdateItemQuantity.jsx';
import StarRating from './StarRating/StarRating.jsx';
import Card from '../../components/Card/Card.jsx';
import { useSpring, animated } from '@react-spring/web';
import './menuItem.css';

const MenuItem = ({ pizza }) => {
  const dispatch = useDispatch();
  const { id, name, unitPrice, ingredients, soldOut, imageUrl, discount } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const isInCart = currentQuantity > 0;
  
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  // Spring configuration for cart animation
  const [props, set] = useSpring(() => ({
    opacity: 1,
    transform: 'scale(1)',
    config: { duration: 300 },
  }));

  const handleAddToCart = () => {
    if (isButtonDisabled || soldOut) return;

    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice * 1,
    };
    dispatch(addItem(newItem));
    set({ opacity: 0, transform: 'scale(1.2)' });
    setTimeout(() => {
      set({ opacity: 1, transform: 'scale(1)' });
    }, 300);
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 300);
  };

  const handleRemoveFromCart = () => {
    if (isButtonDisabled) return;

    dispatch(removeItem(id));
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 300);
  };

  const handleRatingChange = (newRating) => {
    console.log('New rating:', newRating);
  };

  return (
    <Card
      imageUrl={imageUrl}
      title={name}
      badgeText={discount}
      showBadge={!!discount}
      showButton={!soldOut}
      onButtonClick={isInCart ? handleRemoveFromCart : handleAddToCart}
      buttonText={isInCart ? "Remove" : "Order Now"}
      onButtonClickDisabled={soldOut || isButtonDisabled}
    >
      <animated.div style={props} className="rating-wrapper">
        <StarRating
          rating={0}
          onRatingChange={handleRatingChange}
        />
      </animated.div>
      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
        {ingredients?.join(', ')}
      </Typography>
      <Typography variant="body2" color="orange" className="price-text">
        {formatCurrency(unitPrice)}
      </Typography>
      {pizza.originalPrice && (
        <del className="del">{formatCurrency(pizza.originalPrice)}</del>
      )}
      {isInCart && (
        <UpdateItemQuantity pizzaId={id} quantity={currentQuantity} />
      )}
    </Card>
  );
};

export default MenuItem;
