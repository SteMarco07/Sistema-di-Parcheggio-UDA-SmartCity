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

  return (
    <div>
      <Navbar />
      <div className="join join-horizontal gap-5 mx-10 mt-10 px-auto">
        <div className="join join-item w-1100 h-82vh rounded-box" style={{ width: '1100px', height: '82vh', overflow: 'hidden' }}>
          <MapContainer center={position} zoom={zoom} style={{ height: '100%', width: '100%', zIndex: 0 }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ClickLogger />
          </MapContainer>
        </div>
        <ElencoParcheggi className="join join-item" />
      </div>
    </div>
  );
}

export default App;
