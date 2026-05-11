import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export const DashboardLayout: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <main className="pb-16">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  )
}
