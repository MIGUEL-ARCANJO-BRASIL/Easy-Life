import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CollectionMap } from '../../components/Map'
import { Search, MapPin, Navigation, X, Filter } from 'lucide-react'
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
  const [points, setPoints] = useState<Point[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPoint, setSelectedPoint] = useState<[number, number] | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const fetchPoints = async () => {
      const { data } = await supabase.from('collection_points').select('*')
      if (data) setPoints(data)
    }
    fetchPoints()
  }, [])

  const filteredPoints = points.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative h-screen w-full bg-slate-50 overflow-hidden">
      {/* Mapa em Tela Cheia */}
      <div className="absolute inset-0 z-0">
        <CollectionMap externalPoints={points} forcedCenter={selectedPoint} onClearFocus={() => setSelectedPoint(null)} />
      </div>

      {/* Floating Search Bar */}
      <div className="absolute top-6 left-6 right-6 z-20 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-2 flex items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-3 pl-3">
              <Search size={20} className="text-[#10b981]" />
              <input 
                type="text" 
                placeholder="Buscar ponto de coleta..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsSearchOpen(true)
                }}
                className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 placeholder:text-slate-400 py-3"
              />
            </div>
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setIsSearchOpen(false) }}
                className="p-2 hover:bg-slate-100 rounded-2xl transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            )}
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            <button className="p-3 bg-emerald-50 text-[#10b981] rounded-2xl">
              <Filter size={20} />
            </button>
          </motion.div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearchOpen && searchQuery && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white overflow-hidden max-h-[60vh] overflow-y-auto custom-scrollbar"
              >
                {filteredPoints.length > 0 ? (
                  <div className="p-2">
                    {filteredPoints.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => {
                          setSelectedPoint([p.latitude, p.longitude])
                          setIsSearchOpen(false)
                        }}
                        className="w-full flex items-start gap-4 p-4 hover:bg-emerald-50/50 rounded-2xl transition-all text-left group"
                      >
                        <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                          <MapPin size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-emerald-700">{p.name}</h4>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.address}</p>
                          <div className="flex gap-1.5 mt-2">
                            {p.materials.slice(0, 3).map((m, i) => (
                              <span key={i} className="text-[8px] font-bold uppercase bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md">{m}</span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-sm text-slate-400 font-medium">Nenhum ponto encontrado.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Botão flutuante de Ajuda ou Info */}
      <div className="absolute bottom-24 left-6 z-20">
        <div className="bg-white/80 backdrop-blur-lg px-4 py-3 rounded-2xl shadow-xl border border-white flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest">Sincronizado em Manaus</span>
        </div>
      </div>
    </div>
  )
}
