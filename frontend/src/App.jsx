import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store.jsx'

import Navbar from './components/Navbar.jsx';

import PaginaParcheggi from './pages/PaginaParcheggi.jsx';
import PaginaPrenotazioni from './pages/PaginaPrenotazioni.jsx';
import PaginaAutenticazione from './pages/PaginaAutenticazione.jsx';
import PaginaProfilo from './pages/PaginaProfilo.jsx';

function App() {
  const { loadFromLocalStorage, fetchParcheggi, fetchPrenotazioni } = useStore();

  useEffect(() => {
    loadFromLocalStorage();
    fetchParcheggi();
    fetchPrenotazioni();
  }, [loadFromLocalStorage, fetchParcheggi, fetchPrenotazioni]);

  return (
    <BrowserRouter>


      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="h-16 flex-none" aria-hidden />
        <Routes>
          {/* Indirizzamento automatico verso la pagina di autenticazione */}
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* Rotta verso la pagina con la mappa ed elenco dei parcheggi */}
          <Route path="/parcheggi" element={
            <>
              <Navbar />
              <PaginaParcheggi />
            </>
          }
          />
          {/* Rotta verso la pagina con le prenotazioni */}
          <Route path="/prenotazioni" element={
            <>
              <Navbar />
              <PaginaPrenotazioni />
            </>
          }
          />

          {/* Rotta verso la pagina di autenticazione */}
          <Route path="/auth" element={
            <PaginaAutenticazione />
          }
          />
          <Route path="/profilo" element={
            <>
              <Navbar />
              <PaginaProfilo />
            </>
          }
          />
        </Routes>
        
      </div>
    </BrowserRouter>
  );
}

export default App;

