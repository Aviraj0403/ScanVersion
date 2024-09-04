import React from 'react';
import Card from './Card'; // Adjust the import path as needed

const CardContainer = ({ items }) => (
  <div className="card-container">
    {items.map(item => (
      <Card
        key={item.id}
        imageUrl={item.imageUrl}
        title={item.title}
        subtitle={item.subtitle}
        badgeText={item.badgeText}
        showBadge={!!item.badgeText}
        showButton={!item.soldOut}
        onButtonClick={() => console.log(`Clicked item ${item.id}`)}
        buttonText={item.isInCart ? 'Remove' : 'Order Now'}
        onButtonClickDisabled={item.soldOut}
      >
        {/* Additional content can be inserted here */}
      </Card>
    ))}
  </div>
);

export default CardContainer;
