import React from 'react';
import { useSelector } from 'react-redux';
import CreateUser from '../user/CreateUser';
import { Link } from 'react-router-dom';
import { CTASection, DeliverySection, TestimonialsSection } from './Section'; // Import the sections

const Home = () => {
  const username = useSelector((state) => state.user.name);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="flex flex-col items-center justify-center flex-grow bg-cover bg-center text-center py-12 px-4" style={{ backgroundImage: 'url(/path-to-your-background-image.jpg)' }}>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          The best Restaurant.
          <br />
          <span className="text-orange-500">Straight out of the oven, straight to you.</span>
        </h1>
        {username === "" ? (
          <CreateUser />
        ) : (
          <Link to="/menu" className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition-colors">
            Continue ordering, {username}!
          </Link>
        )}
      </header>
      <main className="flex-grow">
        <CTASection />
        <DeliverySection />
        <TestimonialsSection />
      </main>
    </div>
  );
};

export default Home;
