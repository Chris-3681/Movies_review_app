import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddMoviePage() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [trailerUrl, setTrailerUrl] = useState('');  // <-- new
  const [message, setMessage] = useState('');
  const apiBase = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const movieData = {
      title: title.trim(),
      release_year: parseInt(year),
      description,
      poster_url: posterUrl,
      trailer_url: trailerUrl   // <-- send to backend
    };

    try {
      const res = await axios.post(`${apiBase}/api/movies`, movieData);
      setMessage(res.data.message || 'Movie added successfully!');
      
      setTitle('');
      setYear('');
      setDescription('');
      setPosterUrl('');
      setTrailerUrl('');  // <-- reset field
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add movie.';
      setMessage(errorMsg);
      console.error('Add movie error:', errorMsg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Add a Movie</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border rounded text-black bg-white"
        />

        <input
          type="number"
          placeholder="Release Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="w-full p-2 border rounded text-black bg-white"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded text-black bg-white"
        />

        <input
          type="text"
          placeholder="Poster URL"
          value={posterUrl}
          onChange={(e) => setPosterUrl(e.target.value)}
          className="w-full p-2 border rounded text-black bg-white"
        />

        <input
          type="text"
          placeholder="Trailer URL"
          value={trailerUrl}
          onChange={(e) => setTrailerUrl(e.target.value)}
          className="w-full p-2 border rounded text-black bg-white"
        />

        {posterUrl && (
          <img src={posterUrl} alt="Poster Preview" className="w-full mt-4 rounded" />
        )}

        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-green-600">{message}</p>
      )}
    </div>
  );
}
