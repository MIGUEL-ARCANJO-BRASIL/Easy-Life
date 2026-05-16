import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CollectionMap } from '../../components/Map'
import { Search, MapPin, X, Filter, Navigation as NavIcon, Clock, Package, ExternalLink, Navigation } from 'lucide-react'
import { supabase } from '../../lib/supabase'

interface Point {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  materials: string[]
}

export const MapPage: React.FC = () => {
  const [points, setPoints] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPoint, setSelectedPoint] = useState<[number, number] | null>(null)
  const [selectedPointData, setSelectedPointData] = useState<Point | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  // Função para calcular distância em KM (Haversine)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  useEffect(() => {
    // Obter localização do usuário para os pontos mais próximos
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude])
      }, () => {
        setUserLocation([-3.119, -60.021]) // Centro de Manaus fallback
      })
    }
    const fetchPoints = async () => {
      const { data } = await supabase.from('collection_points').select('*')
      if (data) setPoints(data)
    }
    fetchPoints()
  }, [])

  const pointsWithDistance = points.map(p => {
    if (!userLocation) return { ...p, distance: 999 }
    return { ...p, distance: getDistance(userLocation[0], userLocation[1], p.latitude, p.longitude) }
  })

  const filteredPoints = pointsWithDistance.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.distance - b.distance)

  const closestPoints = [...pointsWithDistance].sort((a, b) => a.distance - b.distance).slice(0, 5)

  return (
    <div className="relative h-[calc(100vh-64px)] w-full bg-slate-50 overflow-hidden font-sans z-0 -mb-24 flex flex-col p-4 md:p-6 gap-4 md:gap-6">

      {/* Top Bar: Header & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 shrink-0">
        <div className="w-full md:w-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-black text-emerald-900 tracking-tight drop-shadow-md">
            Ecopontos
          </h1>
          <div className="md:hidden bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">On</span>
          </div>
        </div>

        <div className="flex-1 flex items-center gap-4 w-full">
          {/* Search Bar Inline */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-1 flex items-center gap-2 cursor-text hover:border-emerald-300 transition-colors"
          >
            <div className="flex-1 flex items-center gap-3 pl-3 py-2 md:py-3">
              <Search size={20} className="text-[#10b981]" />
              <span className="text-sm font-bold text-slate-400">Buscar local ou bairro...</span>
            </div>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button className="p-2 md:p-3 bg-emerald-50 text-[#10b981] rounded-xl mr-1">
              <Filter size={18} />
            </button>
          </div>

          <div className="hidden md:flex bg-white/90 backdrop-blur-md px-4 py-3 rounded-full shadow-sm items-center gap-2 border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Sincronizado</span>
          </div>
        </div>
      </div>

      {/* Categorias Rápidas */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar shrink-0">
        {['Todos', 'Plástico', 'Papel', 'Vidro', 'Metal'].map((cat, i) => (
          <button
            key={i}
            className={`shrink-0 px-5 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all shadow-sm ${i === 0
              ? 'bg-[#10b981] text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content Area (Map + Sidebar) */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden">

        {/* Map Container */}
        <div className="flex-1 bg-slate-200 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-inner border-4 border-white relative z-0">
          <CollectionMap
            externalPoints={points}
            forcedCenter={selectedPoint}
            onClearFocus={() => {
              setSelectedPoint(null)
              setSelectedPointData(null)
            }}
            onPointSelect={(point) => {
              setSelectedPoint([point.latitude, point.longitude])
              setSelectedPointData(point as Point)
            }}
          />
        </div>

        {/* Sidebar / Bottom List */}
        {!isSearchOpen && !selectedPointData && closestPoints.length > 0 && (
          <div className="w-full md:w-[280px] lg:w-[320px] xl:w-[360px] shrink-0 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center gap-2 px-2 shrink-0">
              <MapPin size={18} className="text-emerald-600" />
              <h3 className="text-sm md:text-base font-black text-emerald-900">Mais próximos</h3>
            </div>

            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto px-2 pb-4 pt-1 custom-scrollbar snap-x snap-mandatory md:snap-none flex-1">
              {closestPoints.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPoint([p.latitude, p.longitude])
                    setSelectedPointData(p)
                  }}
                  className="bg-white rounded-3xl p-4 md:p-5 shadow-sm border border-slate-200 shrink-0 w-[260px] md:w-full snap-center cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                      <span className="text-xs font-black">{index + 1}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                        {p.distance < 1
                          ? `${(p.distance * 1000).toFixed(0)} m`
                          : `${p.distance.toFixed(1)} km`}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1 truncate group-hover:text-emerald-600 transition-colors">{p.name}</h4>
                  <p className="text-xs text-slate-500 truncate mb-3">{p.address}</p>

                  <div className="flex flex-wrap gap-1">
                    {p.materials.slice(0, 3).map((m: string, i: number) => (
                      <span key={i} className="text-[9px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                        {m}
                      </span>
                    ))}
                    {p.materials.length > 3 && (
                      <span className="text-[9px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                        +{p.materials.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista Completa em Bottom Sheet (Busca Expandida) */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsSearchOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 md:bottom-auto md:top-24 left-0 right-0 md:left-auto md:right-6 z-50 bg-slate-50 md:rounded-3xl rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl overflow-hidden flex flex-col h-[85vh] md:h-[calc(100vh-140px)] w-full md:w-[400px] lg:w-[450px]"
            >
              <div className="bg-white px-6 pt-6 pb-4 border-b border-slate-100 shrink-0 rounded-t-[2.5rem]">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-2 px-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:shadow-sm transition-all border border-transparent focus-within:border-emerald-200">
                  <Search size={20} className="text-emerald-500" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Buscar por local ou bairro..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-400 py-3"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded-full text-slate-500 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {searchQuery ? `Resultados (${filteredPoints.length})` : 'Pontos Próximos a você'}
                </p>

                {filteredPoints.length > 0 ? (
                  <div className="space-y-3 pb-24">
                    {filteredPoints.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPoint([p.latitude, p.longitude])
                          setSelectedPointData(p)
                          setIsSearchOpen(false)
                        }}
                        className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-emerald-200 transition-colors cursor-pointer active:bg-slate-50 flex items-start gap-4"
                      >
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm mb-0.5 truncate">{p.name}</h4>
                          <p className="text-[11px] text-slate-500 truncate mb-1">{p.address}</p>
                          <div className="flex items-center gap-1 text-emerald-600 mb-2">
                            <Navigation size={10} />
                            <span className="text-[10px] font-bold">
                              {p.distance < 1 ? `${(p.distance * 1000).toFixed(0)} m` : `${p.distance.toFixed(1)} km`}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {p.materials.slice(0, 3).map((m, i) => (
                              <span key={i} className="text-[8px] font-bold uppercase bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md">
                                {m}
                              </span>
                            ))}
                            {p.materials.length > 3 && (
                              <span className="text-[8px] font-bold bg-slate-50 text-slate-400 px-2 py-0.5 rounded-md">
                                +{p.materials.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                      <MapPin size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-600">Nenhum ponto encontrado.</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">Tente buscar por outro bairro ou material.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Removing old floating Sincronizado Button as it was placed inside the map card */}

      {/* Bottom Sheet com Detalhes do Ponto */}
      <AnimatePresence>
        {selectedPointData && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm z-30"
              onClick={() => {
                setSelectedPointData(null)
                setSelectedPoint(null)
              }}
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 md:bottom-6 left-0 right-0 md:left-auto md:right-6 z-40 bg-white md:rounded-3xl rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl p-6 pb-8 md:pb-6 border-t border-slate-100 md:border md:border-slate-200 w-full md:w-[400px]"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1">{selectedPointData.name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin size={14} className="text-emerald-500" />
                    <p className="text-sm font-medium">{selectedPointData.address}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedPointData(null)
                    setSelectedPoint(null)
                  }}
                  className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Materiais Aceitos</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedPointData.materials.map((m, i) => (
                    <span key={i} className="text-xs font-bold uppercase bg-white border border-slate-200 text-emerald-600 px-3 py-1.5 rounded-xl shadow-sm">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPointData.latitude},${selectedPointData.longitude}`, '_blank')}
                  className="flex-1 py-4 bg-emerald-50 text-emerald-700 font-bold rounded-2xl transition-all hover:bg-emerald-100 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={18} /> Google Maps
                </button>
                <button
                  onClick={() => setSelectedPointData(null)}
                  className="flex-1 py-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                >
                  <NavIcon size={18} /> Traçar Rota
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
