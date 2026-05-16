import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { Navigation, RefreshCw, LocateFixed, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Corrigindo o problema dos ícones do Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface CollectionPoint {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  materials: string[]
  opening_hours?: string
}

interface MapProps {
  externalPoints?: CollectionPoint[]
  forcedCenter?: [number, number] | null
  onClearFocus?: () => void
  onPointSelect?: (point: CollectionPoint) => void
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, 16, { duration: 1.5 })
    }
  }, [center, map])
  return null
}

export const CollectionMap: React.FC<MapProps> = ({ externalPoints, forcedCenter, onClearFocus, onPointSelect }) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null)
  const [internalPoints, setInternalPoints] = useState<CollectionPoint[]>([])
  const [routeData, setRouteData] = useState<[number, number][]>([])
  const [loading, setLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  const points = externalPoints || internalPoints

  const fetchUserLocation = (callback?: (pos: [number, number]) => void) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
          setUserPosition(coords)
          setLoading(false)
          if (callback) callback(coords)
        },
        () => {
          const fallback: [number, number] = [-3.119, -60.021]
          setUserPosition(fallback)
          setLoading(false)
          if (callback) callback(fallback)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    }
  }

  useEffect(() => {
    fetchUserLocation()
  }, [])

  useEffect(() => {
    if (externalPoints) return
    const fetchPoints = async () => {
      setIsSyncing(true)
      const { data } = await supabase.from('collection_points').select('*')
      if (data) setInternalPoints(data)
      setIsSyncing(false)
    }
    fetchPoints()
  }, [externalPoints])

  useEffect(() => {
    if (userPosition && forcedCenter) {
      const fetchRoute = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${userPosition[1]},${userPosition[0]};${forcedCenter[1]},${forcedCenter[0]}?overview=full&geometries=geojson`
          )
          const data = await response.json()
          if (data.routes && data.routes[0]) {
            const coordinates = data.routes[0].geometry.coordinates.map((coord: any) => [coord[1], coord[0]])
            setRouteData(coordinates)
          }
        } catch (error) {
          console.error("Erro ao buscar rota:", error)
        }
      }
      fetchRoute()
    } else {
      setRouteData([])
    }
  }, [userPosition, forcedCenter])

  const handleLocateMe = () => {
    setIsSyncing(true)
    if (onClearFocus) onClearFocus() // Limpa o ponto selecionado na Home
    fetchUserLocation(() => setIsSyncing(false))
  }

  const openInGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')
  }

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-slate-100 animate-pulse rounded-[2.5rem] flex items-center justify-center flex-col gap-4 text-emerald-500">
        <Navigation className="animate-bounce" size={32} />
        <p className="text-sm font-medium text-slate-400">Sincronizando...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white relative group">
      <MapContainer
        center={userPosition || [-3.119, -60.021]}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPosition && (
          <Marker position={userPosition}>
            <Popup>Você está aqui</Popup>
          </Marker>
        )}

        {points.map(point => (
          <Marker 
            key={point.id} 
            position={[point.latitude, point.longitude]}
            eventHandlers={{
              click: () => {
                if (onPointSelect) onPointSelect(point)
              }
            }}
          />
        ))}

        {routeData.length > 0 && (
          <Polyline
            positions={routeData}
            pathOptions={{ color: '#10b981', weight: 4, dashArray: '10, 10', lineCap: 'round' }}
          />
        )}

        <MapController center={forcedCenter || userPosition} />
      </MapContainer>

      <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
        <button
          onClick={handleLocateMe}
          className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 hover:bg-slate-50 transition-all active:scale-90 flex items-center justify-center group"
          title="Minha Localização"
        >
          <LocateFixed size={22} className="text-[#10b981] group-hover:scale-110 transition-transform" />
        </button>

        {isSyncing && (
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/50 flex items-center gap-2">
            <RefreshCw size={12} className="animate-spin text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-600 uppercase">Buscando...</span>
          </div>
        )}
      </div>

    </div>
  )
}
