import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardMedia, Typography, IconButton, Tooltip, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { formatCurrency } from '../../utils/helpers.js';
import { addItem, removeItem, getCurrentQuantityById } from '../cart/cartSlice.js';
import UpdateItemQuantity from '../cart/UpdateItemQuantity.jsx';

const MenuItem = ({ pizza }) => {
  const dispatch = useDispatch();
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const isInCart = currentQuantity > 0;

  const handleAddToCart = () => {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice * 1,
    };
    dispatch(addItem(newItem));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeItem(id));
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2, transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.05)' } }}>
      <CardMedia
        component="img"
        height="140"
        image={imageUrl}
        alt={name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {name}
        </Typography>
        {soldOut ? (
          <Typography variant="body2" color="text.secondary">
            Sold Out!
          </Typography>
        ) : (
          <Typography variant="body2" color="orange">
            {formatCurrency(unitPrice)}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
          {ingredients?.join(', ')}
        </Typography>
      </CardContent>
      <CardContent>
        {isInCart ? (
          <UpdateItemQuantity pizzaId={id} quantity={currentQuantity} />
        ) : (
          !soldOut && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddToCart}
              sx={{ marginTop: 2 }}
            >
              Add to Cart
            </Button>
          )
        )}
      </CardContent>
      {isInCart && (
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tooltip title="Remove from Cart">
            <IconButton color="error" onClick={handleRemoveFromCart}>
              <RemoveIcon />
            </IconButton>
          </Tooltip>
        </CardContent>
      )}
    </Card>
  );
};

export default MenuItem;
