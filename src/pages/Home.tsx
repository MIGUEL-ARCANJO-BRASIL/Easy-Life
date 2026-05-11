import React from 'react'
import { motion } from 'framer-motion'
import {
  Recycle,
  MapPin,
  Leaf,
  Users,
  Gift,
  BookOpen,
  Award,
  Zap,
  Globe,
  GraduationCap,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden"
    >
      <Navbar />

      {/* Hero */}
      <section id="inicio" className="pt-40 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <Leaf size={14} /> Sustentabilidade em Manaus
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">Recicle hoje, <br /><span className="text-[#10b981] relative italic">mude o amanhã.</span></h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">Easy Life conecta você aos pontos de coleta, recompensa suas atitudes e ajuda a construir um futuro melhor para nossa cidade.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/pontos" className="px-8 py-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-200 transition-all active:scale-95 group">
                Encontrar Pontos <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/recompensas" className="px-8 py-4 bg-slate-50 text-slate-700 font-bold rounded-2xl hover:bg-slate-100 transition-all">Ver Recompensas</Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl z-10 border-[12px] border-white ring-1 ring-slate-100">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200" alt="Reciclagem" className="w-full h-[550px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#10b981]/20 to-transparent"></div>
            </div>
            {/* Elementos flutuantes decorativos */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full -z-10 blur-3xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-100 rounded-full -z-10 blur-3xl opacity-60"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 mb-24 relative z-30">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
          {[
            { icon: <Leaf className="text-emerald-400" />, value: '+ 12t', label: 'Reciclados' },
            { icon: <Users className="text-emerald-400" />, value: '8k+', label: 'Usuários' },
            { icon: <Zap className="text-emerald-400" />, value: '23k', label: 'Pontos Gerados' },
            { icon: <Globe className="text-emerald-400" />, value: 'Manaus', label: 'Impacto Local' },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="mb-2 opacity-50">{stat.icon}</div>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Como o <span className="text-[#10b981]">Easy Life</span> funciona?</h2>
          <div className="w-20 h-1.5 bg-[#10b981] mx-auto mt-6 rounded-full mb-16"></div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: MapPin, title: 'Localize', desc: 'Encontre pontos de coleta próximos no nosso app.', color: 'bg-emerald-50 text-emerald-600' },
              { icon: Recycle, title: 'Separe', desc: 'Separe plástico, metal, papel e vidro em casa.', color: 'bg-blue-50 text-blue-600' },
              { icon: Zap, title: 'Entregue', desc: 'Leve ao ponto e valide sua entrega via QR Code.', color: 'bg-yellow-50 text-yellow-600' },
              { icon: Award, title: 'Ganhe', desc: 'Receba pontos e troque por benefícios reais.', color: 'bg-purple-50 text-purple-600' },
            ].map((step, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  <step.icon size={28} />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-3">{step.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recompensas Preview */}
      <section id="recompensas" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Suas atitudes valem <br /> <span className="text-[#10b981]">recompensas reais</span></h2>
              <p className="text-slate-600 mb-10 leading-relaxed">Não é apenas sobre o meio ambiente, é sobre valorizar seu esforço. Cada grama reciclada se torna crédito para você usar em lojas parceiras.</p>
              <div className="space-y-8">
                {[
                  { title: 'Descontos em Compras', desc: 'Troque seus pontos por cupons em mercados parceiros.', icon: <Gift className="text-emerald-500" /> },
                  { title: 'Benefícios Locais', desc: 'Descontos em transportes e serviços em Manaus.', icon: <MapPin className="text-emerald-500" /> },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">{item.icon}</div>
                    <div><h4 className="font-bold text-slate-800 text-lg">{item.title}</h4><p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="relative">
              <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-8">Tabela de Pontos</h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <span className="font-medium">1kg de Plástico</span>
                      <span className="bg-[#10b981] px-4 py-1 rounded-full text-xs font-black">10 PTS</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <span className="font-medium">1kg de Metal</span>
                      <span className="bg-[#10b981] px-4 py-1 rounded-full text-xs font-black">25 PTS</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">1kg de Papel</span>
                      <span className="bg-[#10b981] px-4 py-1 rounded-full text-xs font-black">05 PTS</span>
                    </div>
                  </div>
                  <div className="mt-12 p-6 bg-slate-800/50 rounded-2xl border border-slate-700 text-center">
                    <p className="text-sm font-medium text-slate-300">Cada 100 pontos = R$ 5,00 em descontos!</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educação */}
      <section id="educacao" className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl font-extrabold mb-16">Educação <span className="text-[#10b981]">Ambiental</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Lave as embalagens', desc: 'Evite contaminação para facilitar a reciclagem de plásticos.', icon: Recycle },
              { title: 'Reduza plásticos', desc: 'Sempre que possível, use ecobags e evite descartáveis.', icon: Globe },
              { title: 'Separe em casa', desc: 'Tenha um cesto apenas para secos e outro para orgânicos.', icon: BookOpen },
            ].map((edu, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-white/5 border border-white/10 hover:border-[#10b981]/50 transition-all group">
                <div className="text-[#10b981] mb-8 mx-auto w-fit group-hover:scale-110 transition-transform">
                  <edu.icon size={40} />
                </div>
                <h4 className="text-xl font-bold mb-4">{edu.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{edu.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre Nós */}
      <section id="sobre-nos" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-50 rounded-[3rem] -z-10 rotate-2"></div>
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" alt="Equipe" className="rounded-[2.5rem] shadow-2xl relative z-10" />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl z-20 border border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">5º</div>
                  <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sistemas de</p><p className="font-black text-slate-800">Informação</p></div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                <GraduationCap size={16} /> Projeto Fametro - Manaus
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">Quem <span className="text-[#10b981]">idealizou</span> este projeto?</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Somos um grupo de estudantes do **5° período de Sistemas de Informação da Fametro**, em Manaus. O **Easy Life** nasceu do desejo de usar a tecnologia para combater a poluição nos nossos igarapés e rios, incentivando a reciclagem de forma prática e recompensadora para toda a comunidade manauara.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 flex-1"><h4 className="text-2xl font-bold text-slate-800">Inovação</h4><p className="text-xs text-slate-500 font-medium">Tecnologia Sustentável</p></div>
                <div className="px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 flex-1"><h4 className="text-2xl font-bold text-slate-800">Manaus</h4><p className="text-xs text-slate-500 font-medium">Impacto Regional</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  )
}
