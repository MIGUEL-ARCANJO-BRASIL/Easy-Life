import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Zap, TrendingUp, History, Award, ArrowRight, Loader2, QrCode, X, Package, Box, Beer, Newspaper, CheckCircle, AlertCircle, ShoppingBag, Coins, Clock, Calendar, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

type UserRole = 'resident' | 'employee' | 'admin'

// Interface para transação
interface Transaction {
  id: string
  points: number
  material_type: string
  created_at: string
  employee_id?: string
  employee_name?: string
}

//Notificação Toast
const ToastNotification: React.FC<{
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <AlertCircle className="text-red-500" size={20} />,
    info: <Gift className="text-emerald-500" size={20} />
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-emerald-50 border-emerald-200 text-emerald-800'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${colors[type]}`}
      style={{ maxWidth: 'calc(100% - 2rem)' }}
    >
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  )
}

// Componente para ver todas as transações
const TransactionsHistoryDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  transactions: Transaction[]
}> = ({ isOpen, onClose, transactions }) => {
  const getMaterialIcon = (type: string) => {
    const icons: Record<string, any> = {
      plastic: Package,
      metal: Box,
      paper: Newspaper,
      glass: Beer
    }
    const Icon = icons[type] || Package
    return <Icon size={16} />
  }

  const getMaterialColor = (type: string) => {
    const colors: Record<string, string> = {
      plastic: 'text-blue-600 bg-blue-50',
      metal: 'text-emerald-600 bg-emerald-50',
      paper: 'text-orange-600 bg-orange-50',
      glass: 'text-purple-600 bg-purple-50'
    }
    return colors[type] || 'text-slate-600 bg-slate-50'
  }

  const getMaterialName = (type: string) => {
    const names: Record<string, string> = {
      plastic: 'Plástico',
      metal: 'Metal',
      paper: 'Papel',
      glass: 'Vidro'
    }
    return names[type] || type
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Hoje'
    if (days === 1) return 'Ontem'
    if (days < 7) return `${days} dias atrás`
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pt-0 pb-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Histórico Completo</h3>
                <p className="text-sm text-slate-500">Todas as suas transações</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Nenhuma transação encontrada</p>
                <p className="text-xs text-slate-400 mt-1">Comece a reciclar para ganhar pontos!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${getMaterialColor(transaction.material_type)}`}>
                          {getMaterialIcon(transaction.material_type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-800">
                              {getMaterialName(transaction.material_type)}
                            </h4>
                            <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                              +{transaction.points} pts
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock size={12} className="text-slate-400" />
                              <p className="text-[11px] text-slate-500">
                                {formatDate(transaction.created_at)}
                              </p>
                            </div>
                            {transaction.employee_name && (
                              <div className="flex items-center gap-1">
                                <Calendar size={12} className="text-slate-400" />
                                <p className="text-[11px] text-slate-500">
                                  por {transaction.employee_name}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total de pontos ganhos:</span>
                <span className="text-lg font-black text-emerald-600">
                  +{transactions.reduce((sum, t) => sum + t.points, 0)} pts
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

//Resgatar Prêmios
const RedeemRewardsDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  userPoints: number
  onRedeem: (rewardId: string, pointsCost: number, rewardName: string) => Promise<void>
}> = ({ isOpen, onClose, userPoints, onRedeem }) => {
  const [selectedReward, setSelectedReward] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const rewards = [
    { 
      id: 'discount_10', 
      name: 'Desconto de R$10', 
      points: 100, 
      icon: ShoppingBag,
      description: 'Válido em compras acima de R$50',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'discount_20', 
      name: 'Desconto de R$20', 
      points: 180, 
      icon: ShoppingBag,
      description: 'Válido em compras acima de R$80',
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      id: 'discount_50', 
      name: 'Desconto de R$50', 
      points: 400, 
      icon: ShoppingBag,
      description: 'Válido em compras acima de R$150',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'eco_kit', 
      name: 'Kit Eco-friendly', 
      points: 250, 
      icon: Gift,
      description: 'Sacolas reutilizáveis + squeeze',
      color: 'from-orange-500 to-orange-600'
    },
    { 
      id: 'plant', 
      name: 'Muda de Árvore', 
      points: 150, 
      icon: Gift,
      description: 'Plante uma árvore nativa',
      color: 'from-green-500 to-green-600'
    }
  ]

  const selectedRewardData = rewards.find(r => r.id === selectedReward)
  const canRedeem = selectedRewardData && userPoints >= selectedRewardData.points

  const handleRedeem = async () => {
    if (!selectedRewardData || !canRedeem) return
    
    setLoading(true)
    await onRedeem(selectedRewardData.id, selectedRewardData.points, selectedRewardData.name)
    setLoading(false)
    handleClose()
  }

  const handleClose = () => {
    setSelectedReward(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Resgatar Prêmios</h3>
                <p className="text-sm text-slate-500">
                  Seus pontos: <span className="font-bold text-emerald-600">{userPoints} pts</span>
                </p>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {rewards.map((reward) => {
                const Icon = reward.icon
                const isAvailable = userPoints >= reward.points
                
                return (
                  <button
                    key={reward.id}
                    onClick={() => setSelectedReward(reward.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedReward === reward.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-300'
                    } ${!isAvailable ? 'opacity-50' : ''}`}
                    disabled={!isAvailable}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-r ${reward.color} text-white`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-900">{reward.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{reward.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-emerald-600">{reward.points} pts</span>
                          </div>
                        </div>
                        {!isAvailable && (
                          <p className="text-xs text-red-500 mt-1">
                            Faltam {reward.points - userPoints} pontos
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {selectedRewardData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-emerald-50 rounded-xl"
              >
                <p className="text-sm text-emerald-800">
                  Você irá resgatar: <strong>{selectedRewardData.name}</strong>
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Custo: {selectedRewardData.points} pontos
                </p>
                {canRedeem && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Após o resgate, você ficará com {userPoints - selectedRewardData.points} pontos
                  </p>
                )}
              </motion.div>
            )}

            <button
              onClick={handleRedeem}
              disabled={!canRedeem || loading}
              className={`w-full mt-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                canRedeem
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Coins size={18} />
                  Resgatar Agora
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

//Scanner QR Code
const QRScannerDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  onScan: (data: string) => void
}> = ({ isOpen, onClose, onScan }) => {
  const scannerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeRef = useRef<any>(null)

  useEffect(() => {
    const initScanner = async () => {
      if (isOpen && scannerRef.current) {
        try {
          const { Html5Qrcode } = await import('html5-qrcode')
          
          html5QrCodeRef.current = new Html5Qrcode("scanner-container")
          
          const qrCodeSuccessCallback = (decodedText: string) => {
            console.log('QR Code escaneado:', decodedText)
            onScan(decodedText)
            stopScanner()
          }

          const config = { fps: 10, qrbox: { width: 250, height: 250 } }

          await html5QrCodeRef.current.start(
            { facingMode: "environment" },
            config,
            qrCodeSuccessCallback
          )
        } catch (err) {
          console.error("Erro ao iniciar scanner:", err)
        }
      }
    }

    initScanner()

    return () => {
      stopScanner()
    }
  }, [isOpen, onScan])

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop()
      } catch (err) {
        console.error("Erro ao parar scanner:", err)
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Escanear QR Code</h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div id="scanner-container" ref={scannerRef} className="w-full aspect-square rounded-xl overflow-hidden bg-slate-100"></div>
            
            <p className="text-sm text-slate-500 text-center mt-4">
              Posicione o QR Code do residente no centro da câmera
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

//adicionar pontos
const AddPointsDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSubmit: (userId: string, points: number, materialType: string) => void
  userName: string
  userId: string
}> = ({ isOpen, onClose, onSubmit, userName, userId }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const [weight, setWeight] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  const materialTypes = [
    { id: 'plastic', name: 'Plástico', pointsPerKg: 10, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'metal', name: 'Metal/Alumínio', pointsPerKg: 25, icon: Box, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'paper', name: 'Papel/Papelão', pointsPerKg: 5, icon: Newspaper, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'glass', name: 'Vidro', pointsPerKg: 15, icon: Beer, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const selectedMaterialData = materialTypes.find(m => m.id === selectedMaterial)
  const totalPoints = selectedMaterialData ? selectedMaterialData.pointsPerKg * weight : 0

  const handleSubmit = async () => {
    if (!selectedMaterial || weight <= 0) return
    
    setLoading(true)
    await onSubmit(userId, totalPoints, selectedMaterial)
    setLoading(false)
    handleClose()
  }

  const handleClose = () => {
    setSelectedMaterial(null)
    setWeight(1)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Adicionar Pontos</h3>
                <p className="text-sm text-slate-500">Residente: <span className="font-semibold">{userName}</span></p>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Tipo de Material</label>
                <div className="grid grid-cols-2 gap-3">
                  {materialTypes.map((material) => {
                    const Icon = material.icon
                    return (
                      <button
                        key={material.id}
                        onClick={() => setSelectedMaterial(material.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMaterial === material.id
                            ? `${material.bg} border-emerald-500`
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${material.color}`} />
                        <span className="text-sm font-medium text-slate-700">{material.name}</span>
                        <p className="text-xs text-slate-500">{material.pointsPerKg} pts/kg</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedMaterial && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="block text-sm font-bold text-slate-700 mb-2">Peso (kg)</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setWeight(Math.max(0.1, weight - 0.5))}
                      className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0))}
                      step="0.1"
                      className="flex-1 text-center text-2xl font-bold bg-slate-50 rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => setWeight(weight + 0.5)}
                      className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-emerald-50 rounded-xl text-center">
                    <p className="text-sm text-emerald-600 font-medium">Pontos a serem adicionados</p>
                    <p className="text-3xl font-black text-emerald-700">{totalPoints} pts</p>
                  </div>
                </motion.div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!selectedMaterial || loading}
                className="w-full py-4 bg-[#10b981] hover:bg-[#059669] disabled:bg-slate-300 text-white font-bold rounded-xl transition-all"
              >
                {loading ? 'Processando...' : 'Confirmar Entrega'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Componente Principal
export const RewardsPage: React.FC = () => {
  const { user } = useAuth()
  const [points, setPoints] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showAddPoints, setShowAddPoints] = useState(false)
  const [showRedeemRewards, setShowRedeemRewards] = useState(false)
  const [showFullHistory, setShowFullHistory] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTransactions, setLoadingTransactions] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('points_total, role')
          .eq('id', user.id)
          .single()
        
        if (profileError) {
          console.error('Erro ao buscar perfil:', profileError)
        }
        
        if (profile) {
          setPoints(profile.points_total || 0)
          setUserRole(profile.role as UserRole || 'resident')
          
          // Se for residente, buscar transações
          if (profile.role === 'resident') {
            await fetchTransactions()
          }
        }

        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    fetchUserData()
  }, [user])

const fetchTransactions = async () => {
  if (!user) {
    console.log('⚠️ Usuário não autenticado')
    return
  }
  
  setLoadingTransactions(true)
  console.log('🔍 Buscando transações para o usuário:', user.id)
  
  try {
    const { error: tableCheckError } = await supabase
      .from('transactions')
      .select('id')
      .limit(1)
    
    if (tableCheckError && tableCheckError.code === '42P01') {
      console.error('❌ Tabela "transactions" não existe no banco de dados!')
      setTransactions([])
      setLoadingTransactions(false)
      return
    }
    
    // Buscar transações
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        points,
        material_type,
        created_at,
        employee_id
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) {
      console.error('❌ Erro ao buscar transações:', error)
      throw error
    }
    
    console.log(`✅ Encontradas ${data?.length || 0} transações`)
    
    if (data && data.length > 0) {
      console.log('📋 Primeira transação:', data[0])
    }
    
    // Buscar nomes dos funcionários
    const transactionsWithNames = await Promise.all(
      (data || []).map(async (transaction) => {
        let employee_name = null
        if (transaction.employee_id) {
          const { data: employee } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', transaction.employee_id)
            .single()
          employee_name = employee?.name
        }
        return {
          ...transaction,
          employee_name
        }
      })
    )
    
    setTransactions(transactionsWithNames)
    
  } catch (error) {
    console.error('❌ Erro ao buscar transações:', error)
    setTransactions([])
  } finally {
    setLoadingTransactions(false)
  }
}

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type })
  }

  const handleQRCodeScanned = async (qrData: string) => {
    try {
      let userId = qrData.trim()
      
      try {
        const parsed = JSON.parse(userId)
        userId = parsed.userId || parsed.user_id || parsed.id || userId
      } catch {
      }
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(userId)) {
        throw new Error('UUID inválido')
      }
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, points_total, role')
        .eq('id', userId)
        .maybeSingle()
      
      if (profileError) throw profileError
      if (!profile) throw new Error('Usuário não encontrado')
      
      if (profile.id === user?.id) {
        showNotification('Você não pode validar seus próprios pontos!', 'error')
        setShowQRScanner(false)
        return
      }
      
      setSelectedUser({ id: profile.id, name: profile.name || 'Usuário' })
      setShowQRScanner(false)
      setShowAddPoints(true)
      
    } catch (error) {
      showNotification(`Erro: ${error instanceof Error ? error.message : 'QR Code inválido'}`, 'error')
      setShowQRScanner(false)
    }
  }

const handleAddPoints = async (userId: string, pointsToAdd: number, materialType: string) => {
  console.log('🚀 ===== INICIANDO ADIÇÃO DE PONTOS =====')
  console.log('📝 Dados recebidos:')
  console.log('  - userId:', userId)
  console.log('  - pointsToAdd:', pointsToAdd)
  console.log('  - materialType:', materialType)
  console.log('  - employee_id:', user?.id)
  
  try {
    //Buscar pontos atuais
    console.log('📊 Passo 1: Buscando pontos atuais...')
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('points_total')
      .eq('id', userId)
    
    if (fetchError) {
      console.error('❌ Erro ao buscar perfil:', fetchError)
      throw fetchError
    }
    
    if (!profiles || profiles.length === 0) {
      throw new Error('Perfil não encontrado')
    }
    
    const currentPoints = profiles[0].points_total || 0
    const newTotal = currentPoints + pointsToAdd
    
    console.log('  - Pontos atuais:', currentPoints)
    console.log('  - Novo total:', newTotal)
    
    //Atualizar pontos no perfil
    console.log('📊 Passo 2: Atualizando pontos no perfil...')
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points_total: newTotal })
      .eq('id', userId)
    
    if (updateError) {
      console.error('❌ Erro ao atualizar pontos:', updateError)
      throw updateError
    }
    
    
    const transactionData = {
      user_id: userId,
      points: pointsToAdd,
      material_type: materialType,
      employee_id: user?.id,
      created_at: new Date().toISOString()
    }
    
    console.log('  - Dados da transação:', transactionData)
    
    // Tenta inserir e retorna o resultado
    const { data: insertedData, error: txError } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select() // Importante: retorna os dados inseridos
    
    if (txError) {
      console.error('❌ ERRO DETALHADO ao inserir transação:')
      console.error('  - Código:', txError.code)
      console.error('  - Mensagem:', txError.message)
      console.error('  - Detalhes:', txError.details)
      console.error('  - Dica:', txError.hint)
      
      // Verifica tipos específicos de erro
      if (txError.code === '42P01') {
        console.error('  ⚠️ A tabela "transactions" NÃO EXISTE!')
        showNotification('Erro: Tabela de transações não encontrada! Contate o suporte.', 'error')
      } else if (txError.code === '42501') {
        console.error('  ⚠️ Permissão negada! Verifique as políticas RLS.')
        showNotification('Erro: Permissão negada para registrar transação.', 'error')
      } else if (txError.code === '23503') {
        console.error('  ⚠️ Chave estrangeira inválida! user_id ou employee_id não existe.')
        showNotification('Erro: Usuário ou funcionário inválido.', 'error')
      } else {
        showNotification(`Erro ao registrar transação: ${txError.message}`, 'error')
      }
    } else {
      console.log('✅ Transação registrada com sucesso!')
      console.log('  - Dados inseridos:', insertedData)
      showNotification(`${pointsToAdd} pontos adicionados para ${selectedUser?.name}!`, 'success')
    }
    
    // 4. Atualizar UI se for o próprio usuário
    if (userId === user?.id) {
      console.log('📊 Passo 4: Atualizando UI...')
      setPoints(newTotal)
      await fetchTransactions() // Recarregar transações
    }
    
    setShowAddPoints(false)
    console.log('🏁 ===== PROCESSO CONCLUÍDO =====')
    
  } catch (error) {
    console.error('❌ Erro geral no processo:', error)
    showNotification(`Erro ao adicionar pontos: ${error instanceof Error ? error.message : 'Tente novamente'}`, 'error')
  }
}

  const handleRedeemReward = async (rewardId: string, pointsCost: number, rewardName: string) => {
    try {
      if (points < pointsCost) {
        showNotification(`Pontos insuficientes! Você tem ${points} pontos.`, 'error')
        return
      }
      
      const newPoints = points - pointsCost
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ points_total: newPoints })
        .eq('id', user?.id)
      
      if (updateError) throw updateError
      
      // Registrar resgate
      try {
        await supabase.from('redemptions').insert({
          user_id: user?.id,
          reward_id: rewardId,
          reward_name: rewardName,
          points_spent: pointsCost,
          created_at: new Date().toISOString()
        })
      } catch (e) {
        console.warn('Não foi possível registrar resgate:', e)
      }
      
      setPoints(newPoints)
      showNotification(`Parabéns! Você resgatou ${rewardName}! 🎉`, 'success')
      
    } catch (error) {
      showNotification(`Erro ao resgatar: ${error instanceof Error ? error.message : 'Tente novamente'}`, 'error')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Hoje'
    if (days === 1) return 'Ontem'
    if (days < 7) return `${days} dias atrás`
    return date.toLocaleDateString('pt-BR')
  }

  const getMaterialIcon = (type: string) => {
    const icons: Record<string, any> = {
      plastic: Package,
      metal: Box,
      paper: Newspaper,
      glass: Beer
    }
    const Icon = icons[type] || Package
    return <Icon size={16} />
  }

  const getMaterialColor = (type: string) => {
    const colors: Record<string, string> = {
      plastic: 'text-blue-600 bg-blue-50',
      metal: 'text-emerald-600 bg-emerald-50',
      paper: 'text-orange-600 bg-orange-50',
      glass: 'text-purple-600 bg-purple-50'
    }
    return colors[type] || 'text-slate-600 bg-slate-50'
  }

  const getMaterialName = (type: string) => {
    const names: Record<string, string> = {
      plastic: 'Plástico',
      metal: 'Metal',
      paper: 'Papel',
      glass: 'Vidro'
    }
    return names[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    )
  }

  // Interface para Employee/Admin
  if (userRole === 'employee' || userRole === 'admin') {
    return (
      <>
        <div className="min-h-screen bg-slate-50 pb-24 pt-8 px-6 font-sans">
          <div className="max-w-md mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Painel <span className="text-[#10b981]">Validador</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">Valide e gerencie os pontos dos residentes.</p>
            </header>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-[2rem] p-8 text-white shadow-2xl mb-8"
            >
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-white/10 rounded-full mb-4">
                  <QrCode size={32} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Validar Entrega</h2>
                <p className="text-emerald-100 text-sm">
                  Use o scanner para adicionar pontos ao morador
                </p>
              </div>

              <button 
                onClick={() => setShowQRScanner(true)}
                className="w-full py-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <QrCode size={20} /> Escanear QR Code
              </button>
            </motion.div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
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
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color.split(' ')[0]}`}></div>
                      <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <QRScannerDialog 
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onScan={handleQRCodeScanned}
        />

        <AddPointsDialog
          isOpen={showAddPoints}
          onClose={() => setShowAddPoints(false)}
          onSubmit={handleAddPoints}
          userName={selectedUser?.name || ''}
          userId={selectedUser?.id || ''}
        />

        <AnimatePresence>
          {notification && (
            <ToastNotification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
        </AnimatePresence>
      </>
    )
  }

  // Interface para Resident
  const recentTransactions = transactions.slice(0, 3)

  return (
    <>
      <div className="min-h-screen bg-slate-50 pb-24 pt-8 px-6 font-sans">
        <div className="max-w-md mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Suas <span className="text-[#10b981]">Conquistas</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">Transforme seu lixo em impacto positivo.</p>
          </header>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden mb-8"
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
              
              <button 
                onClick={() => setShowRedeemRewards(true)}
                className="w-full py-4 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-black/20 flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} /> Resgatar Prêmios
              </button>
            </div>
            
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>

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

          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <History className="text-slate-400" size={18} />
              <h3 className="font-bold text-slate-800">Atividades Recentes</h3>
            </div>
            {transactions.length > 3 && (
              <button 
                onClick={() => setShowFullHistory(true)}
                className="text-xs font-bold text-[#10b981] flex items-center gap-1 hover:gap-2 transition-all"
              >
                Ver todas ({transactions.length}) <ArrowRight size={12} />
              </button>
            )}
          </div>

          {loadingTransactions ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-emerald-500" size={24} />
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">Nenhuma atividade ainda</p>
              <p className="text-xs text-slate-400 mt-1">Comece a reciclar para ganhar pontos!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl ${getMaterialColor(transaction.material_type)}`}>
                        {getMaterialIcon(transaction.material_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800">
                            {getMaterialName(transaction.material_type)}
                          </h4>
                          <span className="text-xs font-black text-emerald-600">
                            +{transaction.points} pts
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            <p className="text-[11px] text-slate-500">
                              {formatDate(transaction.created_at)}
                            </p>
                          </div>
                          {transaction.employee_name && (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} className="text-slate-400" />
                              <p className="text-[11px] text-slate-500">
                                por {transaction.employee_name}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <RedeemRewardsDialog
        isOpen={showRedeemRewards}
        onClose={() => setShowRedeemRewards(false)}
        userPoints={points}
        onRedeem={handleRedeemReward}
      />

      <TransactionsHistoryDialog
        isOpen={showFullHistory}
        onClose={() => setShowFullHistory(false)}
        transactions={transactions}
      />

      <AnimatePresence>
        {notification && (
          <ToastNotification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}