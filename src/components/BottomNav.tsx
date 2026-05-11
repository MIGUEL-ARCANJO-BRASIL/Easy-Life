import React from 'react'
import { Map, Gift, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export const BottomNav: React.FC = () => {
  const location = useLocation()
  
  const tabs = [
    { id: 'mapa', label: 'Mapa', icon: <Map size={24} />, path: '/app/mapa' },
    { id: 'recompensas', label: 'Ganhar', icon: <Gift size={24} />, path: '/app/recompensas' },
    { id: 'perfil', label: 'Perfil', icon: <User size={24} />, path: '/app/perfil' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-6">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <Link 
              key={tab.id}
              to={tab.path}
              className={`relative flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                isActive ? 'text-[#10b981]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-emerald-50 scale-110' : 'bg-transparent'
              }`}>
                {tab.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-1'
              }`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
