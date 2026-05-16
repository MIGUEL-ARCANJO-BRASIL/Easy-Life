// ProfilePage.tsx - VERSÃO MELHORADA
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, QrCode, Settings, LogOut, ChevronRight, Shield, Bell, HelpCircle, Loader2, Copy, Check, Leaf } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { QRCodeSVG } from 'qrcode.react'

export const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) setProfile(data)
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user])

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const copyToClipboard = async () => {
    if (user?.id) {
      await navigator.clipboard.writeText(user.id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // ✅ Melhorado: Gerar objeto com mais informações (opcional)
  const qrData = user?.id || ''  // Mantém apenas UUID para simplicidade

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-8">
      {/* Dynamic Header */}
      <div className="relative pt-12 pb-24 px-6 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-b-[3rem] overflow-hidden shadow-lg shadow-emerald-500/20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-900/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

        <header className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center text-white mb-5 border-4 border-white/40 shadow-2xl relative"
          >
            <User size={56} strokeWidth={1.5} />
            <div className="absolute -bottom-2 -right-2 bg-white text-emerald-500 p-2 rounded-xl shadow-lg border-2 border-emerald-100">
              <Leaf size={16} className="fill-emerald-100" />
            </div>
          </motion.div>
          <motion.h2
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-2xl font-black text-white tracking-tight mb-1 drop-shadow-md"
          >
            {profile?.name || 'Usuário'}
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-emerald-50 text-sm font-medium bg-black/10 px-4 py-1 rounded-full backdrop-blur-sm"
          >
            {profile?.cpf || user?.email}
          </motion.p>
        </header>
      </div>

      <div className="max-w-md mx-auto px-6 -mt-16 relative z-20">
        {/* QR Code Section - Interactive Flip Card */}
        <div className="perspective-1000 mb-10 h-[380px]">
          <motion.div
            className="w-full h-full relative preserve-3d cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front Side */}
            <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-6 bg-emerald-50 px-4 py-2 rounded-full">
                <QrCode className="text-emerald-500" size={18} />
                <h3 className="font-extrabold text-emerald-800 uppercase tracking-widest text-xs">Seu Easy Code</h3>
              </div>

              <div className="w-48 h-48 bg-white rounded-3xl p-4 border-2 border-slate-100 flex items-center justify-center relative mb-6 shadow-[inset_0_4px_20px_rgba(0,0,0,0.03)] group transition-all">
                <QRCodeSVG value={qrData} size={160} level="H" includeMargin={true} bgColor="#ffffff" fgColor="#10b981" />
                <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors rounded-3xl"></div>
              </div>

              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px] mb-2">
                Apresente este código para validar suas entregas.
              </p>

              <div className="mt-auto flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full animate-pulse">
                <span>Toque para ver os detalhes</span>
              </div>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center justify-center text-center rotate-y-180 border border-slate-700">
              <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center text-emerald-400 mb-6 border border-slate-700 shadow-inner">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Identificador Seguro</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Este código único e criptografado garante que todos os seus pontos de reciclagem sejam computados de forma segura e exclusiva para sua conta.
              </p>

              <div className="w-full flex items-center justify-between bg-slate-800 px-4 py-3 rounded-2xl border border-slate-700">
                <code className="text-xs text-emerald-400 font-mono tracking-wider">
                  ID: {user?.id?.substring(0, 8)}...{user?.id?.substring(user.id.length - 4)}
                </code>
                <button
                  onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
                  className="p-2 hover:bg-slate-700 rounded-xl transition-colors bg-slate-900 shadow-sm"
                  title="Copiar ID completo"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-slate-300" />}
                </button>
              </div>

              <div className="absolute bottom-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Toque para voltar
              </div>
            </div>
          </motion.div>
        </div>

        {/* Menu Options */}
        <div className="space-y-3 mb-10">
          {[
            { icon: <Shield size={18} />, label: 'Privacidade e Segurança', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: <Bell size={18} />, label: 'Notificações', color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: <HelpCircle size={18} />, label: 'Central de Ajuda', color: 'text-purple-500', bg: 'bg-purple-50' },
            { icon: <Settings size={18} />, label: 'Configurações', color: 'text-slate-500', bg: 'bg-slate-100' },
          ].map((item, i) => (
            <motion.button
              whileTap={{ scale: 0.98 }}
              key={i}
              className="w-full bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between group hover:shadow-md hover:border-emerald-100 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{item.label}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full py-5 bg-white border border-rose-100 text-rose-500 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm"
        >
          <LogOut size={20} /> Sair da Conta
        </motion.button>

        <p className="text-center mt-10 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          Easy Life v1.0.0 • Manaus Tech
        </p>
      </div>
    </div>
  )
}