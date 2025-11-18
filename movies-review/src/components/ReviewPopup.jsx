import React, { useState } from 'react';

export default function ReviewPopup({ movieId, onClose, onSubmit }) {
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const apiBase = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || rating === 0 || comment.length < 10) {
      alert("Please fill in all fields and ensure comment is at least 10 characters.");
      return;
    }

    try {
      const response = await fetch(`${apiBase}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': username, // pass username
        },
        body: JSON.stringify({ movie_id: movieId, rating, comment }),
      });

      if (response.ok) {
        const newReview = await response.json();
        newReview.username = username;
        onSubmit(newReview);
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const Star = ({ starValue }) => (
    <span
      className={`text-2xl cursor-pointer ${
        starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-600'
      }`}
      onClick={() => setRating(starValue)}
      onMouseEnter={() => setHoverRating(starValue)}
      onMouseLeave={() => setHoverRating(0)}
    >
      ★
    </span>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-xl p-6 w-96 shadow-xl">
        <h2 className="text-2xl font-bold mb-5 border-b border-gray-700 pb-2">Leave a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-700 p-2 rounded bg-gray-800 text-white"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} starValue={star} />)}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-700 p-2 rounded bg-gray-800 text-white"
              minLength={10}
              placeholder="Write your review..."
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
