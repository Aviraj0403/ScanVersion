import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => (
  <section
    className="relative bg-cover bg-center text-center py-16 px-4 md:py-24 md:px-8"
    style={{ backgroundImage: "url('/assets/images/hero-bg.jpg')" }}
  >
    <div className="container mx-auto flex flex-col items-center">
      <div className="relative z-10 max-w-3xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
          The Br Tech Have Excellent Of
          <span className="block text-orange-400">Quality Food!</span>
        </h2>
        <p className="text-base md:text-lg text-gray-200 mb-4 md:mb-6">
          The restaurants in Hangzhou also catered to many northern Chinese who had fled south from Kaifeng during
          the Jurchen invasion of the 1120s, while it is also known that many restaurants were run by families.
        </p>
        <Link to="/menu" className="bg-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded hover:bg-orange-600 transition duration-300">
        Order Now
      </Link>
      </div>
      <figure className="relative mt-6 md:mt-8 max-w-4xl">
        <img src="\assets\images\cta-banner.png" alt="Burger" className="w-full h-auto object-cover mx-auto" />
        <img
          src="\assets\images\sale-shape.png"
          alt="Get up to 50% off now"
          className="absolute top-0 right-0 transform -translate-x-1/4 md:-translate-x-1/2 scale-110"
        />
      </figure>
    </div>
  </section>
);

export default CTASection;
