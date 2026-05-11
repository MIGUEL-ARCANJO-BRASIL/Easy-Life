import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Recycle, ArrowRight, ShieldCheck, Loader2, Lock, CreditCard, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const loginSchema = z.object({
  cpf: z.string().min(14, 'CPF completo é obrigatório').max(14),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      cpf: '',
      password: ''
    }
  })

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '')
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14)
  }

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)

    const cleanCPF = data.cpf.replace(/\D/g, '')
    const email = `${cleanCPF}@easylife.com`

    try {
      const { error: signInError } = await signIn({ email, password: data.password })
      if (signInError) throw signInError
      navigate('/app')
    } catch (err: any) {
      console.error(err)
      setError('CPF ou senha incorretos. Verifique seus dados.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans relative"
    >
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-[#10b981] font-bold transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
          <ArrowLeft size={20} />
        </div>
        <span className="hidden md:block">Voltar para o início</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 p-10 border border-slate-50"
      >
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="w-16 h-16 bg-[#10b981]/10 rounded-2xl flex items-center justify-center mb-4 hover:scale-110 transition-transform">
            <Recycle className="text-[#10b981] w-10 h-10" />
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2 text-center">Acesse sua conta</h1>
          <p className="text-slate-500 text-center text-sm px-4">
            Bem-vindo de volta! Continue sua jornada sustentável com a Easy Life.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">CPF</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    disabled={isLoading}
                    type="text"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    onChange={(e) => field.onChange(formatCPF(e.target.value))}
                    className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-[#10b981]/10 focus:border-[#10b981] transition-all bg-slate-50/50 text-slate-700 font-medium placeholder:text-slate-300 disabled:opacity-50"
                  />
                )}
              />
            </div>
            {errors.cpf && <p className="text-red-500 text-xs mt-2 ml-1">{errors.cpf.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    disabled={isLoading}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-14 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-[#10b981]/10 focus:border-[#10b981] transition-all bg-slate-50/50 text-slate-700 font-medium placeholder:text-slate-300 disabled:opacity-50"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] group disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Entrar no App
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center gap-6">
          <p className="text-sm text-slate-400">
            Não tem uma conta? {' '}
            <Link to="/register" className="text-[#10b981] font-bold hover:underline">
              Cadastre-se agora
            </Link>
          </p>

          <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] bg-slate-50 px-4 py-2 rounded-full">
            <ShieldCheck size={12} />
            Segurança LGPD
          </div>
        </div>
      </motion.div>

      <div className="mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        © 2026 Easy Life • Sustentabilidade Real
      </div>
    </motion.div>
  )
}
