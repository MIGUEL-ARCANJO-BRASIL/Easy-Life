import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Zap, TrendingUp, History, Award, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export const RewardsPage: React.FC = () => {
  const { user } = useAuth()
  const [points, setPoints] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPoints = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('points_total')
          .eq('id', user.id)
          .single()
        
        if (data) setPoints(data.points_total)
        setLoading(false)
      }
    }
    fetchPoints()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-8 px-6 font-sans">
      <div className="max-w-md mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Suas <span className="text-[#10b981]">Conquistas</span></h1>
          <p className="text-slate-500 text-sm mt-1">Transforme seu lixo em impacto positivo.</p>
        </header>

        {/* Card de Pontos Principal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden mb-8"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Gift className="text-emerald-400" size={24} />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">Saldo Total</span>
                <h2 className="text-4xl font-black">{points.toLocaleString('pt-BR')} <span className="text-sm font-bold text-emerald-400">pts</span></h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-xs font-medium text-emerald-100">+250 pts esta semana</span>
            </div>

            <button className="w-full py-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-black/20 flex items-center justify-center gap-2">
              <Zap size={18} /> Resgatar Prêmios
            </button>
          </div>
          
          {/* Decoração de fundo */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>

        {/* Tabela de Preços/Valores */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Award className="text-emerald-500" size={20} />
            <h3 className="font-bold text-slate-800">Tabela de Conversão</h3>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Plástico', value: '10 pts/kg', color: 'bg-blue-50 text-blue-600' },
              { label: 'Metal / Alumínio', value: '25 pts/kg', color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Papel / Papelão', value: '05 pts/kg', color: 'bg-orange-50 text-orange-600' },
              { label: 'Vidro', value: '15 pts/kg', color: 'bg-purple-50 text-purple-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color.split(' ')[0]}`}></div>
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                </div>
                <span className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de Atividade (Mock) */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <History className="text-slate-400" size={18} />
            <h3 className="font-bold text-slate-800">Atividades Recentes</h3>
          </div>
          <button className="text-xs font-bold text-[#10b981] flex items-center gap-1">
            Ver tudo <ArrowRight size={12} />
          </button>
        </div>

        <div className="space-y-4">
          {[
            { title: 'Entrega de Plástico', date: 'Hoje, 14:20', points: '+50 pts' },
            { title: 'Entre de Metal', date: 'Ontem, 09:15', points: '+120 pts' },
          ].map((act, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{act.date}</p>
              </div>
              <span className="text-sm font-black text-emerald-500">{act.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
