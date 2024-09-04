// src/components/PromoSection.js
import React from 'react';
import PromoCard from './PromoCard';
import './PromoSection.css';

const promoItems = [
  {
    type: 'mexican-pizza',
    title: "Mexican Pizza",
    description: "Brief description of the Mexican Pizza.",
  },
  {
    type: 'soft-drinks',
    title: "Soft Drinks",
    description: "Brief description of soft drinks.",
  },
  // Add more promo items here
];

const PromoSection = () => (
  <section className="section section-divider white promo">
    <div className="container">
      <ul className="promo-list has-scrollbar">
        {promoItems.map((item, index) => (
          <li key={index} className="promo-item">
            <PromoCard 
              promoType={item.type}
              title={item.title}
              description={item.description}
            />
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default PromoSection;
