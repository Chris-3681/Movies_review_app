import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const API_BASE = 'http://127.0.0.1:5000'; // Fix this properly

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWatchlist = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/watchlist`);
      if (!res.ok) throw new Error(`Failed to fetch watchlist: ${res.status}`);
      const data = await res.json();
      setWatchlist(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Could not load watchlist');
      alert(err.message || 'Could not load watchlist. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const removeItem = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/api/watchlist/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Failed to remove item: ${res.status}`);
      setWatchlist((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not remove item. Try again.');
    }
  };

  if (loading)
    return <p className="text-white text-center mt-10">Loading watchlist...</p>;

  if (error)
    return (
      <p className="text-red-500 text-center mt-10">
        Error loading watchlist: {error}
      </p>
    );

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">My Watchlist</h1>

        {watchlist.length > 0 ? (
          <div className="flex flex-wrap justify-center">
            {watchlist.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/movies/${item.movie.id}`)}
                className="w-[260px] bg-black rounded-lg overflow-hidden shadow-lg text-white m-4 mt-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden h-40 group">
                  {item.movie.poster_url ? (
                    <img
                      src={item.movie.poster_url}
                      alt={item.movie.title}
                      className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110 group-hover:h-64"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-300">No Image</span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <h2 className="text-base font-semibold mb-1">{item.movie.title}</h2>
                  <p className="text-gray-400 text-xs mb-1">
                    Released: {item.movie.release_year}
                  </p>
                  {item.note && (
                    <p className="text-gray-300 mb-2 text-sm">Note: {item.note}</p>
                  )}

                  <button
                    onClick={(e) => removeItem(item.id, e)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition text-sm w-full mt-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-10">You have no movies in your watchlist yet.</p>
        )}
      </div>
    </>
  );
}
