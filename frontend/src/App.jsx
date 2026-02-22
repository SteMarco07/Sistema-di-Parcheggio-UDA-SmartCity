import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store.jsx'

import Navbar from './components/Navbar.jsx';

import PaginaParcheggi from './pages/PaginaParcheggi.jsx';
import PaginaPrenotazioni from './pages/PaginaPrenotazioni.jsx';
import PaginaAutenticazione from './pages/PaginaAutenticazione.jsx';

function App() {
  const { loadFromLocalStorage } = useStore();

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <BrowserRouter>


      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="h-16 flex-none" aria-hidden />
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />

          <Route path="/parcheggi" element={
            <>
              <Navbar />
              <PaginaParcheggi />
            </>
          }
          />

          <Route path="/prenotazioni" element={
            <>
              <Navbar />
              <PaginaPrenotazioni />
            </>
          }
          />

          <Route path="/auth" element={
            <PaginaAutenticazione />
          }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

