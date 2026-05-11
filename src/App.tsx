import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import { Register } from './pages/Register'
import { PublicPoints } from './pages/PublicPoints'
import { PublicRewards } from './pages/PublicRewards'
import { DashboardLayout } from './pages/DashboardLayout'
import { MapPage } from './pages/app/MapPage'
import { RewardsPage } from './pages/app/RewardsPage'
import { ProfilePage } from './pages/app/ProfilePage'

function AppRoutes() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/pontos" element={<PublicPoints />} />
        <Route path="/recompensas" element={<PublicRewards />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/app" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/app" />} />
        
        {/* Dashboard PWA Routes */}
        <Route path="/app" element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="/app/mapa" replace />} />
          <Route path="mapa" element={<MapPage />} />
          <Route path="recompensas" element={<RewardsPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
