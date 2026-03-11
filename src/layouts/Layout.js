import React, { useState } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import Inbox from '../pages/Inbox'
import PARA from '../pages/PARA'
import Brain from '../pages/Brain'
import Calendario from '../pages/Calendario'
import Tareas from '../pages/Tareas'
import Dashboard from '../pages/Dashboard'
import useIsMobile from '../hooks/useIsMobile'

export default function Layout({ session }) {
  const [paginaActiva, setPaginaActiva] = useState('dashboard')
  const [contexto, setContexto] = useState(null)
  const isMobile = useIsMobile()

  const navegarA = (pagina, ctx = null) => {
    setContexto(ctx)
    setPaginaActiva(pagina)
  }

  const renderPagina = () => {
    switch (paginaActiva) {
      case 'dashboard': return <Dashboard session={session} navegarA={navegarA} />
      case 'inbox': return <Inbox session={session} contexto={contexto} />
      case 'para': return <PARA session={session} contexto={contexto} />
      case 'brain': return <Brain session={session} contexto={contexto} />
      case 'calendario': return <Calendario session={session} />
      case 'tareas': return <Tareas session={session} contexto={contexto} />
      default: return <Dashboard session={session} navegarA={navegarA} />
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0f0f0f' }}>
      {!isMobile && (
        <Sidebar paginaActiva={paginaActiva} setPaginaActiva={(p) => navegarA(p)} session={session} />
      )}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: isMobile ? '24px 16px 80px 16px' : '36px 40px',
        background: '#1e1e32'
      }}>
        {renderPagina()}
      </main>
      {isMobile && (
        <BottomNav paginaActiva={paginaActiva} navegarA={navegarA} session={session} />
      )}
    </div>
  )
}