import React from 'react'
import { Recycle, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Recycle className="text-[#10b981] w-8 h-8" />
              <span className="text-2xl font-bold text-slate-800 tracking-tight">EasyLife</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Conectando comunidades ribeirinhas a um futuro mais sustentável através da reciclagem inteligente e recompensas.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-slate-800 font-bold mb-6">Navegação</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500 font-medium">
              <li><a href="#" className="hover:text-[#10b981] transition-colors">Início</a></li>
              <li><a href="#" className="hover:text-[#10b981] transition-colors">Como funciona</a></li>
              <li><a href="#" className="hover:text-[#10b981] transition-colors">Pontos de coleta</a></li>
              <li><a href="#" className="hover:text-[#10b981] transition-colors">Recompensas</a></li>
              <li><a href="#" className="hover:text-[#10b981] transition-colors">Sobre nós</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-slate-800 font-bold mb-6">Contato</h4>
            <ul className="flex flex-col gap-4 text-sm text-slate-500">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10b981]">
                  <Mail size={16} />
                </div>
                contato@easylife.com
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10b981]">
                  <Phone size={16} />
                </div>
                (92) 99999-9999
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#10b981] shrink-0">
                  <MapPin size={16} />
                </div>
                Comunidade São Raimundo, <br />Manaus - AM
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-slate-800 font-bold mb-6">Fale</h4>
            <p className="text-slate-500 text-sm mb-4">Receba dicas de sustentabilidade e novidades.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#10b981]/20 focus:border-[#10b981]"
              />
              <button className="bg-[#10b981] text-white p-2 rounded-xl hover:bg-[#059669] transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-400 font-medium">
            © 2026 Easy Life. Todos os direitos reservados.
          </p>
          <div className="flex gap-8 text-xs text-slate-400 font-medium">
            <a href="#" className="hover:text-slate-600 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
