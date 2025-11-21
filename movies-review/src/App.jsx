import { useState } from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Movies from "./pages/Movies"
import Watchlist from "./pages/Watchlist"
import MovieDetailPage from './pages/MovieDetailPage'
import AddMoviePage from './pages/AddMoviePage';
import Footer from "./components/Footer";
function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Movies />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/add" element={<AddMoviePage />} />

        </Routes>
         <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
