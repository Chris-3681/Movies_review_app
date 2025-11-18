import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';
import Navbar from '../components/Navbar';

export default function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // DIRECT, NO ENV VAR
    fetch('http://127.0.0.1:5000/api/movies')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setMovies(data))
      .catch(err => console.error('Failed to fetch movies:', err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="mt-6 px-4">
        <h1 className="text-white text-2xl font-bold mb-4">All Movies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <MovieCard
              id={movie.id}
              key={movie.id}
              title={movie.title}
              year={movie.release_year}
              description={movie.description}
              image={movie.poster_url}
              avgRating={movie.avg_rating}
            />
          ))}
        </div>
      </div>
    </>
  );
}
