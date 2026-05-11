import React from 'react'
import { Recycle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export const Navbar: React.FC = () => {
  const location = useLocation()

  const institutionalLinks = [
    { path: '/', label: 'Início', type: 'link' },
    { path: '/#como-funciona', label: 'Como funciona', type: 'anchor' },
    { path: '/#sobre-nos', label: 'Sobre nós', type: 'anchor' },
  ]

  const functionalLinks = [
    { path: '/pontos', label: 'Pontos de Coleta' },
    { path: '/recompensas', label: 'Recompensas' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Recycle className="text-[#10b981] w-8 h-8" />
          <span className="text-2xl font-bold text-slate-800 tracking-tight">EasyLife</span>
        </Link>

        {/* Navegação Agrupada */}
        <div className="hidden md:flex items-center">
          {/* Grupo 1: Institucional */}
          <div className="flex items-center gap-6 text-sm font-medium">
            {institutionalLinks.map(link => (
              link.type === 'link' ? (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-all duration-300 pb-1 border-b-2 flex items-center h-7 ${isActive(link.path)
                    ? 'text-[#10b981] border-[#10b981]'
                    : 'text-slate-500 border-transparent hover:text-[#10b981]'
                    }`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.path}
                  href={link.path}
                  className="text-slate-500 border-b-2 border-transparent hover:text-[#10b981] transition-all pb-1 flex items-center h-7"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Separador */}
          <div className="w-[1px] h-6 bg-slate-200 mx-8" />

          {/* Grupo 2: Funcional (Novas Páginas) */}
          <div className="flex items-center gap-6 text-sm font-bold">
            {functionalLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-all duration-300 pb-1 border-b-2 flex items-center h-7 ${isActive(link.path)
                  ? 'text-[#10b981] border-[#10b981]'
                  : 'text-slate-500 border-transparent hover:text-[#10b981]'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Ações de Autenticação */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/login" className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-[#10b981] transition-all">Entrar</Link>
          <Link to="/register" className="px-6 py-2 text-sm font-bold text-white bg-[#10b981] hover:bg-[#059669] rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95">Cadastrar</Link>
        </div>
      </div>
    </nav>
  )
}
