
import React, { useState } from 'react';
import './TestimonialsSection.css'; // Import the CSS file

const TestimonialsSection = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [name, setName] = useState('');

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
  };

  const showForm = () => {
    setFormVisible(true);
    setSubmitted(false);
  };

  const goBackHome = () => {
    setFormVisible(false);
    setSubmitted(false);
    setRating(0);
    setReview('');
    setName('');
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  return (
    <section className="bg-white text-center py-16 px-4 md:py-24 md:px-8">
      <div className="container mx-auto">
        <p className="text-lg text-gray-500 mb-4">Testimonials</p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
          Our Customers <span className="text-orange-400">Reviews</span>
        </h2>
        <p className="text-base md:text-lg text-gray-600 mb-10">
          Food is any substance consumed to provide nutritional support for an organism.
        </p>
        <ul className="flex flex-wrap justify-center gap-6 mb-10">
          {[1, 2, 3].map(index => (
            <li key={index} className="bg-white p-4 md:p-6 shadow-lg rounded w-full md:w-80">
              <div className="flex items-center mb-4">
                <img
                  src={`/assets/aviraj.jpg`}
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

        {formVisible ? (
          submitted ? (
            <div>
              <p className="text-lg text-green-500">Thank you for your review!</p>
              <button className="back-button" onClick={goBackHome}>
                Back to Home
              </button>
            </div>
          ) : (
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Your Review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="input-field"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="star-rating mb-4">
                <p className="mb-2">Your Rating:</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className={`w-6 h-6 cursor-pointer ${
                        star <= rating ? 'text-yellow-500' : 'text-gray-400'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l2.39 7.68L22 10l-6 4.5L18 22l-6-4-6 4 2-7.5L2 10l7.61-1.32L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <button type="submit" className="submit-button">
                Submit Review
              </button>
            </form>
          )
        ) : (
          <button className="review-button" onClick={showForm}>
            Review
          </button>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;



