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

const MenuItem = ({ fooditem }) => {
  const dispatch = useDispatch();
  const { _id, name, price, ingredients, soldOut, imageUrl, discount } = fooditem;
  const currentQuantity = useSelector(getCurrentQuantityById(_id));
  const isInCart = currentQuantity > 0;

  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [props, set] = useSpring(() => ({
    opacity: 1,
    transform: 'scale(1)',
    config: { duration: 300 },
  }));

  const handleAddToCart = () => {
    if (isButtonDisabled || soldOut) return;

    const newItem = {
      fooditemId: _id,
      name,
      quantity: 1,
      price,
      totalPrice: price,
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

    dispatch(removeItem(_id));
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 300);
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
        <StarRating rating={0} onRatingChange={() => {}} />
      </animated.div>
      <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
        {ingredients?.join(', ')}
      </Typography>
      <Typography variant="body2" color="orange" className="price-text">
        {formatCurrency(price)}
      </Typography>
      {fooditem.originalPrice && (
        <del className="del">{formatCurrency(fooditem.originalPrice)}</del>
      )}
      {isInCart && (
        <UpdateItemQuantity fooditemId={_id} quantity={currentQuantity} />
      )}
    </Card>
  );
};

export default MenuItem;
