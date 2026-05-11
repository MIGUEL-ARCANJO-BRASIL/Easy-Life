import React from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Award, Zap, Star, ShoppingBag, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

export const PublicRewards: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-6 mb-24">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
            >
              <Award size={14} /> Sistema de Recompensas
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Reciclar nunca foi tão <br /><span className="text-[#10b981]">vantajoso.</span></h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">Cada grama de resíduo que você separa e entrega ajuda o planeta e enche o seu bolso com benefícios reais em Manaus.</p>
          </div>
        </section>

        {/* Como Ganhar */}
        <section className="px-6 py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">Como ganhar pontos?</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: 'Plástico', pts: '10 pts/kg', icon: <div className="w-2 h-2 rounded-full bg-blue-500" />, desc: 'Garrafas PET, embalagens de limpeza, potes de comida.' },
                { title: 'Metal', pts: '25 pts/kg', icon: <div className="w-2 h-2 rounded-full bg-emerald-500" />, desc: 'Latinhas de alumínio, tampas de metal, panelas velhas.' },
                { title: 'Papel', pts: '05 pts/kg', icon: <div className="w-2 h-2 rounded-full bg-orange-500" />, desc: 'Papelão, jornais, revistas, folhas de caderno.' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-colors">{item.icon}</div>
                    <span className="text-xl font-black text-emerald-500">{item.pts}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Onde Gastar */}
        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight">Troque seus pontos por <br /><span className="text-[#10b981]">benefícios exclusivos</span></h2>
              <div className="space-y-6">
                {[
                  { icon: <ShoppingBag />, title: 'Vouchers de Compras', desc: 'Descontos em supermercados e feiras locais de Manaus.' },
                  { icon: <Truck />, title: 'Crédito em Transporte', desc: 'Recargas para o cartão de passagem de ônibus.' },
                  { icon: <Star />, title: 'Experiências Locais', desc: 'Ingressos para eventos culturais e passeios.' },
                ].map((benefit, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">{benefit.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-800">{benefit.title}</h4>
                      <p className="text-sm text-slate-500">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-flex items-center gap-2 mt-12 px-10 py-5 bg-[#10b981] text-white font-bold rounded-2xl shadow-xl shadow-emerald-100 hover:scale-105 transition-all active:scale-95 group">
                Criar minha conta agora <Zap size={18} className="fill-white" />
              </Link>
            </div>
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1200" alt="Recompensas" className="rounded-[3rem] shadow-2xl" />
               <div className="absolute -top-10 -right-10 bg-white p-8 rounded-3xl shadow-xl border border-slate-50 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Impacto Real</span>
                  <span className="text-4xl font-black text-emerald-500">100%</span>
                  <span className="text-[10px] font-bold text-slate-800">Sustentável</span>
               </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
