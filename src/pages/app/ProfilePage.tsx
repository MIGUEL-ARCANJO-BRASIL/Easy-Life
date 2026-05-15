// ProfilePage.tsx - VERSÃO MELHORADA
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, QrCode, Settings, LogOut, ChevronRight, Shield, Bell, HelpCircle, Loader2, Copy, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { QRCodeSVG } from 'qrcode.react'

export const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

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
    <div className="min-h-screen bg-slate-50 pb-24 pt-8 px-6 font-sans">
      <div className="max-w-md mx-auto">
        <header className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-[#10b981] rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-100 mb-4 border-4 border-white">
            <User size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile?.name || 'Usuario'}</h2>
          <p className="text-slate-400 text-sm font-medium">{profile?.cpf || user?.email}</p>
        </header>

        {/* QR Code Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/60 border border-slate-50 flex flex-col items-center text-center mb-10"
        >
          <div className="flex items-center gap-2 mb-6">
            <QrCode className="text-emerald-500" size={20} />
            <h3 className="font-extrabold text-slate-800 uppercase tracking-widest text-xs">Identificador Único</h3>
          </div>
          
          {/* QR Code REAL gerado dinamicamente */}
          <div className="w-48 h-48 bg-white rounded-3xl p-4 border-2 border-emerald-200 flex items-center justify-center relative mb-6 shadow-lg">
            <QRCodeSVG 
              value={qrData}
              size={160}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#10b981"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-3xl pointer-events-none"></div>
          </div>

          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px]">
            Apresente este código ao operador no ponto de coleta para validar suas entregas.
          </p>
          
          {/* ID com botão de copiar */}
          <div className="mt-4 flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl">
            <code className="text-[10px] text-slate-500 font-mono">
              ID: {user?.id?.substring(0, 8)}...{user?.id?.substring(user.id.length - 4)}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-slate-200 rounded-md transition-colors"
              title="Copiar ID completo"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-400" />}
            </button>
          </div>
        </motion.div>

        {/* Menu Options - mantido igual */}
        <div className="space-y-3 mb-10">
          {[
            { icon: <Shield size={18} />, label: 'Privacidade e Segurança', color: 'text-blue-500' },
            { icon: <Bell size={18} />, label: 'Notificações', color: 'text-orange-500' },
            { icon: <HelpCircle size={18} />, label: 'Central de Ajuda', color: 'text-purple-500' },
            { icon: <Settings size={18} />, label: 'Configurações', color: 'text-slate-400' },
          ].map((item, i) => (
            <button key={i} className="w-full bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all active:scale-[0.98]">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl bg-slate-50 ${item.color}`}>
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-slate-700">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </button>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-5 bg-rose-50 text-rose-600 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-rose-100 transition-all active:scale-95"
        >
          <LogOut size={20} /> Sair da Conta
        </button>

        <p className="text-center mt-10 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          Easy Life v1.0.0 • Manaus Tech
        </p>
      </div>
    </div>
  )
}