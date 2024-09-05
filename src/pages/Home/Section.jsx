import React from 'react';

// CTA Section Component
const CTASection = () => (
    <section className="relative bg-cover bg-center text-center py-16 px-4 md:py-24 md:px-8" 
    style={{
        backgroundImage: "url('/src/assets/images/hero-bg.jpg')",
      }}>
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
          <button className="bg-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded hover:bg-orange-600 transition duration-300">Order Now</button>
        </div>
        <figure className="relative mt-6 md:mt-8 max-w-4xl">
        <img src="src\assets\images\cta-banner.png" alt="Burger" className="w-full h-auto object-cover mx-auto" />
        <img src="src\assets\images\sale-shape.png" alt="Get up to 50% off now" className="absolute top-0 right-0 transform -translate-x-1/4 md:-translate-x-1/2 scale-110" />
        </figure>
      </div>
    </section>
  );
  

// Delivery Section Component
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
          <button className="bg-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded hover:bg-orange-600 transition duration-300"> Call a Waiter</button>
        </div>
        <figure className="relative mt-6 md:mt-8 max-w-4xl">
          <img src="src\assets\images\delivery-banner-bg.png" alt="Clouds" className="w-full h-auto object-cover mx-auto" />
          <img src="src\assets\images\delivery-boy.svg" alt="Delivery boy" className="absolute top-0 left-0 transform -translate-x-1/4 md:-translate-x-1/2" />
        </figure>
      </div>
    </section>
  );

// Testimonials Section Component
const TestimonialsSection = () => (
  <section className="bg-white text-center py-16 px-4 md:py-24 md:px-8">
    <div className="container mx-auto">
      <p className="text-lg text-gray-500 mb-4">Testimonials</p>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
        Our Customers <span className="text-orange-400">Reviews</span>
      </h2>
      <p className="text-base md:text-lg text-gray-600 mb-10">
        Food is any substance consumed to provide nutritional support for an organism.
      </p>
      <ul className="flex flex-wrap justify-center gap-6">
        {[1, 2, 3].map(index => (
          <li key={index} className="bg-white p-4 md:p-6 shadow-lg rounded w-full md:w-80">
            <div className="flex items-center mb-4">
              <img
                src="/src/assets/aviraj.jpg"
                alt={`Customer ${index}`}
                className="w-20 h-20 rounded-full mr-4 object-cover"
              />
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-1">Customer {index}</h3>
                <p className="text-gray-500">Position {index}</p>
              </div>
            </div>
            <blockquote className="text-gray-800 mb-4">
              "I would be lost without this restaurant. I would like to personally thank you for your outstanding product."
            </blockquote>
            <div className="flex space-x-1 text-yellow-500">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l2.39 7.68L22 10l-6 4.5L18 22l-6-4-6 4 2-7.5L2 10l7.61-1.32L12 2z" />
                </svg>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default TestimonialsSection;

  

export { CTASection, DeliverySection, TestimonialsSection };
