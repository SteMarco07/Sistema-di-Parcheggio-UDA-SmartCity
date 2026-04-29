import { useState, useEffect, useCallback, useRef } from 'react'
import { useMap, Marker } from 'react-map-gl'
import Supercluster from 'supercluster'

function ClusteredMarkers({ parcheggi, onMarkerClick }) {
  const { current: map } = useMap()

  const [clusters, setClusters] = useState([])

  // ✅ supercluster stabile (NON globale)
  const superclusterRef = useRef(
    new Supercluster({ radius: 60, maxZoom: 15 })
  )

  // 🔄 aggiorna cluster
  const updateClusters = useCallback(() => {
    if (!map) return

    const bounds = map.getBounds()
    if (!bounds) return

    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth()
    ]

    const zoom = Math.floor(map.getZoom())

    const newClusters = superclusterRef.current.getClusters(bbox, zoom)
    setClusters(newClusters)
  }, [map])

  // 📦 carica punti quando cambiano i parcheggi
  useEffect(() => {
    if (!parcheggi || parcheggi.length === 0) {
      setClusters([])
      return
    }

    const points = parcheggi
      .filter(p => p && p.longitude != null && p.latitude != null)
      .map((p) => ({
        type: 'Feature',
        properties: { cluster: false, parcheggio: p },
        geometry: {
          type: 'Point',
          coordinates: [p.longitude, p.latitude]
        },
      }))

    // reset + load (importantissimo)
    superclusterRef.current = new Supercluster({ radius: 60, maxZoom: 15 })
    superclusterRef.current.load(points)

    updateClusters()
  }, [parcheggi, updateClusters])

  // 🎯 aggiorna quando muovi la mappa
  useEffect(() => {
    if (!map) return

    map.on('move', updateClusters)

    return () => {
      map.off('move', updateClusters)
    }
  }, [map, updateClusters])

  return clusters.map((cluster) => {
    const [lng, lat] = cluster.geometry.coordinates
    const { cluster: isCluster, point_count, parcheggio } = cluster.properties

    if (isCluster) {
      return (
        <ClusterMarker
          key={`cluster-${cluster.id}`}
          lng={lng}
          lat={lat}
          count={point_count}
          onClick={() => {
            const expansionZoom = Math.min(
              superclusterRef.current.getClusterExpansionZoom(cluster.id),
              20
            )
            map.easeTo({ center: [lng, lat], zoom: expansionZoom })
          }}
        />
      )
    }

    return (
      <SingleMarker
        key={`marker-${parcheggio.id}`}
        parcheggio={parcheggio}
        onClick={() => onMarkerClick(parcheggio)}
      />
    )
  })
}

// 🎨 colore marker
function getMarkerColor(parcheggio) {
  const total = parcheggio.total_spots
  const free =
    parcheggio.posti_liberi ??
    parcheggio.available_spots ??
    parcheggio.free_spots ??
    null

  if (!total || free == null) return '#EF4444'

  const ratio = free / total

  if (ratio > 0.5) return '#22C55E'
  if (ratio > 0.2) return '#F59E0B'
  if (ratio > 0) return '#FF7236'
  return '#EF4444'
}

// 📍 marker singolo
function SingleMarker({ parcheggio, onClick }) {
  const color = getMarkerColor(parcheggio)

  return (
    <Marker
      longitude={parcheggio.longitude ?? parcheggio.lng}
      latitude={parcheggio.latitude ?? parcheggio.lat}
      onClick={onClick}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'transform .15s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          background: color,
          boxShadow: '0 2px 8px rgba(0,0,0,.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.85)',
            transform: 'rotate(45deg)',
          }} />
        </div>
        <div style={{ width: 2, height: 10, background: 'rgba(0,0,0,.12)' }} />
        <div style={{ width: 8, height: 3, background: 'rgba(0,0,0,.10)', borderRadius: '50%' }} />
      </div>
    </Marker>
  )
}

// 🔵 cluster marker
function ClusterMarker({ lng, lat, count, onClick }) {
  const tier = count < 5 ? 0 : count < 20 ? 1 : 2

  const cores = [32, 36, 44]
  const rings = [44, 52, 62]

  const colors = ['#1D8F9E', '#0F5B6E', '#084250']
  const alphas = [
    'rgba(29, 143, 158, 0.18)',
    'rgba(15, 91, 110, 0.18)',
    'rgba(8, 66, 80, 0.18)'
  ]

  const label = count > 99 ? '99+' : String(count)

  return (
    <Marker longitude={lng} latitude={lat} onClick={onClick}>
      <div
        style={{
          width: rings[tier],
          height: rings[tier],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          width: rings[tier],
          height: rings[tier],
          borderRadius: '50%',
          background: alphas[tier],
        }} />

        <div style={{
          width: cores[tier],
          height: cores[tier],
          borderRadius: '50%',
          background: colors[tier],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 13,
          fontWeight: 500,
          zIndex: 1,
        }}>
          {label}
        </div>
      </div>
    </Marker>
  )
}

export default ClusteredMarkers