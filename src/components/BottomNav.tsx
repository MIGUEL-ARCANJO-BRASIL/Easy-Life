import React from 'react'
import { Map, Gift, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export const BottomNav: React.FC = () => {
  const location = useLocation()
  
  const tabs = [
    { id: 'mapa', label: 'Mapa', icon: <Map size={24} />, path: '/app/mapa' },
    { id: 'recompensas', label: 'Ganhar', icon: <Gift size={24} />, path: '/app/recompensas' },
    { id: 'perfil', label: 'Perfil', icon: <User size={24} />, path: '/app/perfil' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <motion.div
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              className="flex-1 flex justify-center"
            >
              <Link 
                to={tab.path}
                className="relative flex flex-col items-center justify-center w-full h-full gap-1 pt-1"
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicatorTop"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#10b981] rounded-b-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className={`p-1 transition-colors duration-300 ${
                  isActive ? 'text-[#10b981]' : 'text-slate-400'
                }`}>
                  {tab.icon}
                </div>
                
                <span className={`text-[10px] font-bold tracking-wide transition-colors duration-300 ${
                  isActive ? 'text-[#10b981]' : 'text-slate-400'
                }`}>
                  {tab.label}
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
