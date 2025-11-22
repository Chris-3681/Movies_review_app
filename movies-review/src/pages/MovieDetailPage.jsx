import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewPopup from '../components/ReviewPopup';

const API_BASE = 'https://movies-review-app-3.onrender.com'; 

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingTrailer, setEditingTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // 1. Fetch movie details
        const res = await fetch(`${API_BASE}/api/movies/${id}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch movie. Status: ${res.status}`);
        }
        const data = await res.json();

        setMovie(data);
        setTrailerUrl(data.trailer_url || '');

        // Safe mapping in case data.reviews is missing or null
        const safeReviews = (data.reviews || []).map((r) => ({
          ...r,
          username: r.username || `User ${r.user_id}`,
        }));
        setReviews(safeReviews);

        // 2. Fetch watchlist to know if this movie is in it
        const watchRes = await fetch(`${API_BASE}/api/watchlist`);
        if (!watchRes.ok) {
          throw new Error(`Failed to fetch watchlist. Status: ${watchRes.status}`);
        }
        const watchlistData = await watchRes.json();
        setInWatchlist(watchlistData.some((item) => item.movie.id === data.id));
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleAddReview = (newReview) => {
    setReviews((prev) => [...prev, newReview]);
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const saveTrailer = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/movies/${movie.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trailer_url: trailerUrl }),
      });
      if (!res.ok) throw new Error('Failed to save trailer');
      const updatedMovie = await res.json();
      setMovie(updatedMovie);
      setEditingTrailer(false);
    } catch (err) {
      console.error(err);
      alert('Could not save trailer. Try again.');
    }
  };

  const toggleWatchlist = async () => {
    try {
      if (!inWatchlist) {
        // Add to watchlist
        const res = await fetch(`${API_BASE}/api/watchlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movie_id: movie.id }),
        });
        if (!res.ok) throw new Error('Failed to add to watchlist');
        setInWatchlist(true);
      } else {
        // Remove from watchlist
        const watchRes = await fetch(`${API_BASE}/api/watchlist`);
        if (!watchRes.ok) throw new Error('Failed to fetch watchlist');
        const watchlistData = await watchRes.json();
        const item = watchlistData.find((w) => w.movie.id === movie.id);
        if (!item) return;
        const delRes = await fetch(`${API_BASE}/api/watchlist/${item.id}`, {
          method: 'DELETE',
        });
        if (!delRes.ok) throw new Error('Failed to remove from watchlist');
        setInWatchlist(false);
      }
    } catch (err) {
      console.error(err);
      alert('Could not update watchlist. Try again.');
    }
  };

  const renderStars = (rating) => (
    <span className="text-yellow-400">
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Error / loading handling
  if (error) {
    return (
      <p className="text-red-400 text-center mt-10">
        Failed to load movie: {error}
      </p>
    );
  }

  if (!movie) {
    return (
      <p className="text-white text-center mt-10">
        Loading...
      </p>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <div className="flex flex-col md:flex-row md:space-x-6">
        {movie.poster_url && (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full md:w-1/3 rounded-lg shadow-lg mb-4 md:mb-0"
          />
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {movie.title} ({movie.release_year})
          </h1>

          {averageRating && (
            <p className="text-yellow-400 font-semibold mt-1">
              ⭐ Average Rating: {averageRating} / 5
            </p>
          )}

          <p className="mt-2">{movie.description}</p>

          {/* Trailer */}
          {movie.trailer_url ? (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Trailer</h3>
              <iframe
                width="100%"
                height="315"
                src={getEmbedUrl(movie.trailer_url)}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded"
              />
              <button
                onClick={() => setEditingTrailer(true)}
                className="mt-2 bg-blue-800 text-white px-3 py-1 rounded-full hover:bg-blue-900 text-sm transition-all duration-300 transform hover:scale-105"
              >
                Edit Trailer
              </button>
            </div>
          ) : (
            !editingTrailer && (
              <button
                onClick={() => setEditingTrailer(true)}
                className="mt-4 bg-blue-800 text-white px-3 py-1 rounded-full hover:bg-blue-900 text-sm transition-all duration-300 transform hover:scale-105"
              >
                Add Trailer
              </button>
            )
          )}

          {/* Edit/Add Trailer */}
          {editingTrailer && (
            <div className="mt-2">
              <input
                type="text"
                value={trailerUrl}
                onChange={(e) => setTrailerUrl(e.target.value)}
                placeholder="Paste trailer URL (YouTube)"
                className="w-full p-2 rounded text-black text-sm"
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={saveTrailer}
                  className="bg-green-800 text-white px-3 py-1 rounded-full hover:bg-green-900 text-sm transition-all duration-300 transform hover:scale-105"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingTrailer(false);
                    setTrailerUrl(movie.trailer_url || '');
                  }}
                  className="bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-900 text-sm transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
            <button
              onClick={() => setShowPopup(true)}
              className="bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-900 text-sm transition-all duration-300 transform hover:scale-105 mb-2 md:mb-0"
            >
              Add Review
            </button>

            <button
              onClick={toggleWatchlist}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 transform hover:scale-105 mb-2 md:mb-0 ${
                inWatchlist
                  ? 'bg-gray-700 hover:bg-gray-800'
                  : 'bg-black hover:bg-gray-900'
              }`}
            >
              {inWatchlist ? 'Already in Watchlist' : 'Add to Watchlist'}
            </button>

            <button
              onClick={() => navigate('/watchlist')}
              className="bg-red-800 text-white px-3 py-1 rounded-full hover:bg-red-900 text-sm transition-all duration-300 transform hover:scale-105 mb-2 md:mb-0"
            >
              Take me to Watchlist
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <ReviewPopup
          movieId={movie.id}
          onClose={() => setShowPopup(false)}
          onSubmit={handleAddReview}
        />
      )}

      {/* Reviews */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="border p-4 rounded shadow-sm bg-gray-800 text-sm"
              >
                <p className="font-semibold">{r.username}</p>
                <p>
                  {renderStars(r.rating)} ({r.rating}/5)
                </p>
                <p className="mt-1">{r.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet. Be the first to leave one!</p>
        )}
      </div>
    </div>
  );
}
