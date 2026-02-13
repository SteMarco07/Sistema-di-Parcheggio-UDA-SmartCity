import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react'



function App() {

  const [position, setPosition] = useState(JSON.parse(localStorage.getItem('lastClick'))
   || [45.55584514965588, 10.216172766008182])
  const [zoom, setZoom] = useState(JSON.parse(localStorage.getItem('lastZoom')) || 18)
  function ClickLogger() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        const zoom = e.target.getZoom()
        // console.log('Clicked at:', lat, lng)
        localStorage.setItem('lastClick', JSON.stringify({ lat, lng }))
        localStorage.setItem('lastZoom', JSON.stringify(zoom))
      }
    })
  }


  return (
    <div style={{ margin: '0 auto', marginTop: '20px', marginBottom: '20px', width: '1200px', height: '90vh' }}>
      <MapContainer center={position} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ClickLogger />
      </MapContainer>
    </div>
  );
}

export default App;
