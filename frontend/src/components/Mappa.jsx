import { useState, useEffect, useRef } from 'react'
import Map, { Popup, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useStore } from '../store.jsx'
import ParcheggioPopup from './parcheggi/ParcheggioPopup.jsx'
import ClusteredMarkers from './Markers.jsx'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

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

// ── SearchBar ────────────────────────────────────────────────────────────────
function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  // Chiudi dropdown cliccando fuori
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleChange(e) {
    const value = e.target.value
    setQuery(value)
    clearTimeout(debounceRef.current)

    if (value.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json`
          + `?access_token=${MAPBOX_TOKEN}`
          + `&language=it`
          + `&country=it`          // limita all'Italia
          + `&types=address,place,locality,neighborhood`
          + `&limit=6`
        const res = await fetch(url)
        const data = await res.json()
        setResults(data.features || [])
        setOpen(true)
      } catch (err) {
        console.error('Geocoding error:', err)
      } finally {
        setLoading(false)
      }
    }, 350)
  }

  function handleSelect(feature) {
    const [lng, lat] = feature.center
    setQuery(feature.place_name)
    setResults([])
    setOpen(false)
    onSelect({ lng, lat, name: feature.place_name })
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        transform: 'none',
        zIndex: 10,
        width: 'min(350px, 90vw)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Input */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: open && results.length ? '12px 12px 0 0' : '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
        padding: '6px 10px',
        gap: 8,
      }}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Cerca via, luogo..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 15,
            color: '#222',
            background: 'transparent',
          }}
        />

        {loading && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" >
            <path d="M12 2a10 10 0 0 1 10 10">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
            </path>
          </svg>
        )}

        {query && !loading && (
          <button onClick={handleClear} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: '#aaa' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown risultati */}
      {open && results.length > 0 && (
        <ul style={{
          margin: 0,
          padding: 0,
          listStyle: 'none',
          background: '#fff',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
          overflow: 'hidden',
          borderTop: '1px solid #f0f0f0',
        }}>
          {results.map((feature, i) => {
            // Separa nome principale dal resto dell'indirizzo
            const parts = feature.place_name.split(',')
            const main = parts[0]
            const secondary = parts.slice(1).join(',').trim()

            return (
              <li
                key={feature.id}
                onClick={() => handleSelect(feature)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: i < results.length - 1 ? '1px solid #f5f5f5' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f7f9ff'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                {/* Pin icon */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#6c8ebf" stroke="none" style={{ flexShrink: 0 }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {main}
                  </div>
                  {secondary && (
                    <div style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {secondary}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ── Mappa ────────────────────────────────────────────────────────────────────
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

  // Vola alla location selezionata dalla searchbar
  function handleSearchSelect({ lng, lat }) {
    const newView = {
      ...viewState,
      longitude: lng,
      latitude: lat,
      zoom: 16,
      transitionDuration: 800,
    }
    setViewState(newView)
    modifyPosition([lat, lng])
    modifyZoom(16)
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <SearchBar onSelect={handleSearchSelect} />

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
    </div>
  )
}

export default Mappa