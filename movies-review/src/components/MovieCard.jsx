import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ id, title, description, image, year, avgRating }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-[260px] bg-black rounded-lg overflow-hidden shadow-lg text-white m-4 mt-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ minHeight: '420px' }}
    >
      <div className="relative overflow-hidden h-60 transition-all duration-500 hover:h-96">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform transition-all duration-500"
        />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div className="p-3">
        <h2 className="text-base font-semibold mb-1">{title}</h2>
        {year && <p className="text-gray-400 text-xs mb-1">Released: {year}</p>}
        {avgRating && <p className="text-yellow-400 text-sm mb-1">⭐ {avgRating} / 5</p>}
        <p className="text-gray-300 mb-3 text-sm line-clamp-2">
          {description || 'No description available...'}
        </p>
        <button
          onClick={handleClick}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
        >
          Read more
        </button>
      </div>
    </div>
  );
}
