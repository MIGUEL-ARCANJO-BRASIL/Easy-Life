import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Recycle, ArrowRight, ShieldCheck, User, CreditCard, Lock, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const registerSchema = z.object({
  name: z.string().min(3, 'Nome muito curto'),
  cpf: z.string().min(14, 'CPF completo é obrigatório').max(14),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      cpf: '',
      password: '',
      confirmPassword: ''
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

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError(null)
    
    const cleanCPF = data.cpf.replace(/\D/g, '')
    const email = `${cleanCPF}@easylife.com`

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: data.password,
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: data.name,
            cpf: data.cpf,
            role: 'resident',
            points_total: 0
          })

        if (profileError) throw profileError

        setShowSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 2500)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Ocorreu um erro ao criar sua conta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden"
    >
      {/* Botão Voltar */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-[#10b981] font-bold transition-colors group z-10"
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
          <ArrowLeft size={20} />
        </div>
        <span className="hidden md:block">Voltar para o início</span>
      </Link>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-6"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 p-6 rounded-[2rem] shadow-2xl shadow-emerald-200/40 flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shrink-0 animate-bounce">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 leading-tight">Conta Criada!</h3>
                <p className="text-sm text-slate-500 mt-0.5">Redirecionando para o login...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 p-10 border border-slate-50 transition-all duration-500 ${showSuccess ? 'blur-md grayscale opacity-50 scale-95 pointer-events-none' : ''}`}
      >
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="w-16 h-16 bg-[#10b981]/10 rounded-2xl flex items-center justify-center mb-4 hover:scale-110 transition-transform">
            <Recycle className="text-[#10b981] w-10 h-10" />
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2 text-center">Criar sua conta</h1>
          <p className="text-slate-500 text-center text-sm px-4">
            Junte-se à comunidade São Raimundo e comece a ganhar pontos hoje mesmo.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input 
                      {...field}
                      disabled={isLoading}
                      type="text" 
                      placeholder="Ex: Maria Silva"
                      className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-[#10b981]/10 focus:border-[#10b981] transition-all bg-slate-50/50 text-slate-700 font-medium placeholder:text-slate-300 disabled:opacity-50"
                    />
                  )}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-2 ml-1">{errors.name.message}</p>}
            </div>

            <div className="md:col-span-2">
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
                      autoComplete="off"
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
                      autoComplete="new-password"
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

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <input 
                      {...field}
                      disabled={isLoading}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-14 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-[#10b981]/10 focus:border-[#10b981] transition-all bg-slate-50/50 text-slate-700 font-medium placeholder:text-slate-300 disabled:opacity-50"
                    />
                  )}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-500 transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-2 ml-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Criando conta...
              </>
            ) : (
              <>
                Criar Conta Grátis
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col items-center gap-6">
          <p className="text-sm text-slate-400">
            Já tem uma conta? {' '}
            <Link to="/login" className="text-[#10b981] font-bold hover:underline">
              Fazer login
            </Link>
          </p>
          
          <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em] bg-slate-50 px-4 py-2 rounded-full">
            <ShieldCheck size={12} />
            Privacidade Garantida
          </div>
        </div>
      </motion.div>
      
      <div className="mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
        © 2026 Easy Life • Sustentabilidade Real
      </div>
    </motion.div>
  )
}
