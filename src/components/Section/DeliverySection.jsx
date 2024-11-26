import React from 'react';

const DeliverySection = () => (
  <section className="relative bg-gray-100 text-center py-16 px-4 md:py-24 md:px-8">
    <div className="container mx-auto flex flex-col items-center">
      <div className="relative z-10 max-w-3xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
          A Moments Of Delivered On <span className="text-orange-400">Right Time</span> & Place
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6">
          The restaurants in Hangzhou also catered to many northern Chinese who had fled south from Kaifeng during
          the Jurchen invasion of the 1120s, while it is also known that many restaurants were run by families.
        </p>
        <button className="bg-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded hover:bg-orange-600 transition duration-300">
          Call a Waiter
        </button>
      </div>
      <figure className="relative mt-6 md:mt-8 max-w-4xl">
        <img src="\assets\images\delivery-banner-bg.png" alt="Clouds" className="w-full h-auto object-cover mx-auto" />
        <img src="\assets\images\delivery-boy.svg" alt="Delivery boy" className="absolute top-0 left-0 transform -translate-x-1/4 md:-translate-x-1/2" />
      </figure>
    </div>
  </section>
);

export default DeliverySection;
