import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTheme } from './hooks/useTheme'
import { PortfolioDataProvider } from './context/PortfolioDataContext'

// Public Site Components (eagerly loaded for instant first paint)
import { Preloader } from './components/Preloader'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { WhatIDo } from './components/WhatIDo'
import { Skills } from './components/Skills'
import { ToolsStrip } from './components/ToolsStrip'
import { Projects } from './components/Projects'
import { Timeline } from './components/Timeline'
import { HireBanner } from './components/HireBanner'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { BackToTop } from './components/BackToTop'

// Admin Dashboard Components (code-split / lazy loaded)
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })))
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview').then(m => ({ default: m.AdminOverview })))
const AdminSiteSettings = lazy(() => import('./pages/admin/AdminSiteSettings').then(m => ({ default: m.AdminSiteSettings })))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects').then(m => ({ default: m.AdminProjects })))
const AdminExperience = lazy(() => import('./pages/admin/AdminExperience').then(m => ({ default: m.AdminExperience })))
const AdminEducation = lazy(() => import('./pages/admin/AdminEducation').then(m => ({ default: m.AdminEducation })))
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills').then(m => ({ default: m.AdminSkills })))
const AdminWhatIDo = lazy(() => import('./pages/admin/AdminWhatIDo').then(m => ({ default: m.AdminWhatIDo })))
const AdminTools = lazy(() => import('./pages/admin/AdminTools').then(m => ({ default: m.AdminTools })))
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia').then(m => ({ default: m.AdminMedia })))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages').then(m => ({ default: m.AdminMessages })))

const queryClient = new QueryClient()

function PublicPortfolio() {
  const { dark, toggle } = useTheme()

  return (
    <div className={dark ? 'dark' : ''}>
      <Preloader />
      <a
        href="#welcome"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-violet-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar dark={dark} toggleTheme={toggle} />
      <main id="main-content">
        <Hero />
        <About />
        <WhatIDo />
        <Skills />
        <ToolsStrip />
        <Projects />
        <Timeline />
        <HireBanner />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

function AdminLoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-violet-500 border-t-transparent" />
        <p className="text-xs text-slate-400">Loading admin panel...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio Route */}
            <Route path="/" element={<PublicPortfolio />} />

            {/* Admin Login */}
            <Route
              path="/admin/login"
              element={
                <Suspense fallback={<AdminLoadingFallback />}>
                  <AdminLogin />
                </Suspense>
              }
            />

            {/* Admin Dashboard Protected Routes */}
            <Route
              path="/admin"
              element={
                <Suspense fallback={<AdminLoadingFallback />}>
                  <AdminLayout />
                </Suspense>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="settings" element={<AdminSiteSettings />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="education" element={<AdminEducation />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="what-i-do" element={<AdminWhatIDo />} />
              <Route path="tools" element={<AdminTools />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PortfolioDataProvider>
    </QueryClientProvider>
  )
}
