import { useEffect } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from 'react-leaflet'
import { useStore } from '../store.jsx'
import ParcheggioCardPopup from './parcheggi/ParcheggioPopup.jsx';
import ParcheggioPopup from './parcheggi/ParcheggioPopup.jsx';


function MapSync() {
  const map = useMap()
  const { position, zoom } = useStore()

  useEffect(() => {
    if (map && position) {
      map.setView(position, zoom)
    }
  }, [map, position, zoom])

  return null
}

function CenterLogger() {
  const { modifyPosition, modifyZoom } = useStore()

  useMapEvents({
    // quando l'utente termina il pan/zoom della mappa, prendo il centro e salvo
    moveend(e) {
      const center = e.target.getCenter()
      const z = e.target.getZoom()
      modifyPosition([center.lat, center.lng])
      modifyZoom(z)
    }
  })

  return null
}

function Mappa({ ricerca }) {
  const { parcheggi, position, zoom } = useStore()

  const filteredParcheggi = parcheggi.filter((p) =>
    (p.nome ?? "").toLowerCase().includes(ricerca.toLowerCase()) || (p.descrizione ?? "").toLowerCase().includes(ricerca.toLowerCase())
  );

  return (
    <MapContainer center={position} zoom={zoom} style={{ height: '100%', width: '100%', zIndex: 0 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
      {
        filteredParcheggi.map((parcheggio) => (
          <Marker key={parcheggio.id} position={[parcheggio.lat, parcheggio.lng]}>
            <Popup>
             <ParcheggioPopup parcheggio={parcheggio} />
            </Popup>
          </Marker>
        ))
      }
      <MapSync />
      <CenterLogger />
    </MapContainer>
  )
}

export default Mappa;