import { useState, useEffect } from 'react'
import Map, { Popup, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useStore } from '../store.jsx'
import ParcheggioPopup from './parcheggi/ParcheggioPopup.jsx'
import ClusteredMarkers from './Markers.jsx'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZmFiaW9zMDciLCJhIjoiY21tcTU2aDNoMHRuMDMxc2RycHZqZ2Z2OCJ9._GIagSs30ZeuZRHeLw02pA'

function add3DBuildings(map) {
  map.addLayer({
    id: '3d-buildings',
    source: 'composite',
    'source-layer': 'building',
    filter: ['==', 'extrude', 'true'],
    type: 'fill-extrusion',
    minzoom: 14,
    paint: {
      'fill-extrusion-color': '#aaa',
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'min_height'],
      'fill-extrusion-opacity': 0.8,
    },
  })
}

function Mappa() {
  const { parcheggiFiltrati = [], position, zoom, modifyPosition, modifyZoom } = useStore()
  const [selectedParcheggio, setSelectedParcheggio] = useState(null)

  const [viewState, setViewState] = useState({
    longitude: position[1],
    latitude: position[0],
    zoom,
    pitch: 45,
    bearing: 0,
  })

  useEffect(() => {
    setViewState(v => ({ ...v, longitude: position[1], latitude: position[0], zoom }))
  }, [position, zoom])

  function handleMove(evt) {
    const { longitude, latitude, zoom } = evt.viewState
    setViewState(evt.viewState)
    modifyPosition([latitude, longitude])
    modifyZoom(zoom)
  }

  return (
    <Map
      {...viewState}
      onMove={handleMove}
      style={{ height: '100%', width: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={MAPBOX_TOKEN}
      onLoad={(e) => add3DBuildings(e.target)}
    >
      <NavigationControl position="top-right" />

      <ClusteredMarkers
        parcheggi={parcheggiFiltrati}
        onMarkerClick={setSelectedParcheggio}
      />

      {selectedParcheggio && (
        <Popup
          longitude={selectedParcheggio.lng}
          latitude={selectedParcheggio.lat}
          onClose={() => setSelectedParcheggio(null)}
          closeOnClick={false}
        >
          <ParcheggioPopup parcheggio={selectedParcheggio} />
        </Popup>
      )}
    </Map>
  )
}

export default Mappa