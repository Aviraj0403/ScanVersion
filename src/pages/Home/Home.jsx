
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CreateUser from '../user/CreateUser';
import { Link } from 'react-router-dom';
import CTASection from '../../components/Section/CTASection';
import DeliverySection from '../../components/Section/DeliverySection';
import TestimonialsSection from '../../components/Section/TestimonialsSection';
import './Home.css'; // Import CSS for slider

const images = [
  '/assets/slideimg/slide1.jpeg',
  '/assets/slideimg/slide2.jpeg',
  '/assets/slideimg/slide3.jpeg',
];

const Home = () => {
  const username = useSelector((state) => state.user.name);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

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

        {/* Image Slider Section */}
        <div className="slider-container">
          <img src={images[currentImage]} alt="Restaurant slide" className="slider-image" />
          <div className="slider-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentImage ? 'active' : ''}`}
                onClick={() => setCurrentImage(index)}
              ></span>
            ))}
          </div>
        </div>
      </header>

      <div>
        <CTASection />
        <DeliverySection />
        <TestimonialsSection />
      </div>
    </div>
  );
};

export default Home;
