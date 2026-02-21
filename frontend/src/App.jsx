import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react'
import Navbar from './Navbar.jsx';
import ElencoParcheggi from './ElencoParcheggi.jsx';

function App() {
  const storedClick = JSON.parse(localStorage.getItem('lastClick'));
  const initialPosition = storedClick && storedClick.lat != null && storedClick.lng != null
    ? [storedClick.lat, storedClick.lng]
    : [45.55584514965588, 10.216172766008182];

  const [position] = useState(initialPosition);
  const [zoom] = useState(() => JSON.parse(localStorage.getItem('lastZoom')) || 18);

  function ClickLogger() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const zoom = e.target.getZoom();
        localStorage.setItem('lastClick', JSON.stringify({ lat, lng }));
        localStorage.setItem('lastZoom', JSON.stringify(zoom));
      }
    });
    return null;
  }

  return (<>
    {/* Navbar fixed to top so it remains across pages */}
    <div className="fixed top-0 left-0 right-0 z-50">
      <Navbar />
    </div>

    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Spacer equal to navbar height to avoid overlap */}
      <div className="h-16 flex-none" aria-hidden />

      {/* Area Main: Occupa tutto lo spazio restante (100vh - 64px) */}
      <div className="h-[calc(100vh-64px)] w-full px-6 py-7 flex justify-center">

        {/* stack on small screens, side-by-side on md+ */}
        <div className="flex flex-col md:flex-row w-full max-w-[1750px] h-full gap-4 items-stretch">

          {/* Mappa: full width on mobile with set height, desktop uses full height */}
          <div className="w-full md:w-[70%] h-[50vh] md:h-full rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <MapContainer
              center={position}
              zoom={zoom}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <ClickLogger />
            </MapContainer>
          </div>

          {/* Elenco: full width on mobile, desktop uses 30% and scrolls */}
          <div className="w-full md:w-[30%] h-auto md:h-full bg-white overflow-hidden">
            <div className="h-auto md:h-full overflow-y-auto">
              <ElencoParcheggi />
            </div>
          </div>

        </div>
      </div>
    </div>
  </>
  );
}

export default App;
