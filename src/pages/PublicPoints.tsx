import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { CollectionMap } from '../components/Map'
import { supabase } from '../lib/supabase'
import { Search, MapPin, Navigation, Info, Clock } from 'lucide-react'

export const PublicPoints: React.FC = () => {
  const [points, setPoints] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedPoint, setSelectedPoint] = useState<any | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)

  // Função para calcular distância em KM (Haversine)
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Raio da Terra em KM
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  useEffect(() => {
    // Pegar localização do usuário
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
      setLoading(false)
    }
    fetchPoints()
  }, [])

  const filteredPoints = points
    .filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.address.toLowerCase().includes(search.toLowerCase())
    )
    .map(p => {
      if (!userLocation) return { ...p, distance: 999 }
      const dist = getDistance(userLocation[0], userLocation[1], p.latitude, p.longitude)
      return { ...p, distance: dist }
    })
    .sort((a, b) => a.distance - b.distance)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Pontos de <span className="text-[#10b981]">Coleta</span></h1>
            <p className="text-slate-500 font-medium italic">Encontre o local mais próximo para descartar seus resíduos.</p>
          </header>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Lateral */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                {/* Busca */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar por bairro ou material..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium"
                  />
                </div>

                {/* Lista Limitada a 4 cards visíveis */}
                <div className="space-y-3 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <AnimatePresence mode="popLayout">
                    {filteredPoints.length > 0 ? (
                      filteredPoints.map(point => (
                        <motion.div 
                          key={point.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setSelectedPoint(point)}
                          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                            selectedPoint?.id === point.id 
                              ? 'border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/5' 
                              : 'border-slate-50 hover:border-emerald-100 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col">
                              <h4 className={`font-black text-base transition-colors ${selectedPoint?.id === point.id ? 'text-emerald-700' : 'text-slate-800'}`}>
                                {point.name}
                              </h4>
                              {point.distance !== 999 && (
                                <span className={`text-xs font-bold mt-1 ${selectedPoint?.id === point.id ? 'text-emerald-700' : 'text-emerald-600'}`}>
                                  {point.distance < 1 
                                    ? `${(point.distance * 1000).toFixed(0)}m de distância` 
                                    : `${point.distance.toFixed(1)}km de distância`}
                                  {point.distance < 0.5 && " • Pertinho!"}
                                </span>
                              )}
                            </div>
                            <MapPin size={18} className={selectedPoint?.id === point.id ? 'text-emerald-600' : 'text-slate-300'} />
                          </div>
                          <p className="text-xs text-slate-400 font-medium mb-3">{point.address}</p>
                          
                          {/* Horário de Funcionamento */}
                          <div className="flex items-center gap-2 mb-4">
                            <Clock size={14} className={selectedPoint?.id === point.id ? 'text-emerald-600' : 'text-[#10b981]'} />
                            <span className={`text-xs font-bold ${selectedPoint?.id === point.id ? 'text-emerald-700' : 'text-slate-500'}`}>
                              {point.opening_hours || '08:00 - 17:00'}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {point.materials.map((m: string, i: number) => (
                              <span key={i} className="text-[10px] font-bold uppercase bg-white px-3 py-1 rounded-lg border border-slate-100 text-slate-400 group-hover:text-emerald-500 transition-colors">
                                {m}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-slate-400 text-sm font-medium italic">
                        Nenhum ponto encontrado.
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Mapa Principal */}
            <div className="lg:col-span-8 h-[740px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-100 border-4 border-white bg-white relative">
              
              {/* Dica Flutuante sobre o Mapa */}
              <div className="absolute top-6 right-6 z-[1000] pointer-events-none">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 max-w-xs"
                >
                  <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
                    <Navigation size={20} className="text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">Trace sua rota</h4>
                    <p className="text-[10px] text-emerald-100/70 font-medium">Clique em um ponto para ver o caminho.</p>
                  </div>
                </motion.div>
              </div>

              <CollectionMap 
                externalPoints={filteredPoints} 
                forcedCenter={selectedPoint ? [selectedPoint.latitude, selectedPoint.longitude] : null}
                onClearFocus={() => setSelectedPoint(null)}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
