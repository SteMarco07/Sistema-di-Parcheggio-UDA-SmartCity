import 'leaflet/dist/leaflet.css';
import { use, useEffect } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store.jsx'

import Navbar from './components/Navbar.jsx';

import PaginaParcheggi from './pages/PaginaParcheggi.jsx';
import PaginaPrenotazioni from './pages/PaginaPrenotazioni.jsx';
import PaginaAutenticazione from './pages/PaginaAutenticazione.jsx';
import PaginaProfilo from './pages/PaginaProfilo.jsx';
import PaginaDashboard from './pages/PaginaDashboard.jsx';

function App() {
  const { loadFromLocalStorage, fetchPrenotazioni, utente, token } = useStore();

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage, token]);

  return (
    <BrowserRouter>


      <div className="min-h-screen flex flex-col bg-gray-100">

        <Routes>
          {/* Indirizzamento automatico verso la pagina di autenticazione */}
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* Rotta verso la pagina di autenticazione */}
          <Route path="/auth" element={
            <PaginaAutenticazione />
          }
          />

          {
            token ? (
              <>
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


                <Route path="/profilo" element={
                  <>
                    <Navbar />
                    <PaginaProfilo />
                  </>
                }
                />

                <Route path="/dashboard" element={
                  <>
                    <Navbar />
                    <PaginaDashboard />
                  </>
                }
                />

              </>
            ) : (
              // Se non c'è token, reindirizza alla pagina di autenticazione
              <Route path="*" element={<Navigate to="/auth" replace />} />
            )
          }

          <Route path="*" element={<Navigate to="/auth" replace />} />
          
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;

