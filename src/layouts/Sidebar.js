import React from 'react'
import { supabase } from '../lib/supabase'

  const navItems = [
  { id: 'dashboard', label: 'Inicio' },
  { id: 'inbox', label: 'Inbox' },
  { id: 'tareas', label: 'Tareas' },
  { id: 'para', label: 'Áreas' },
  { id: 'brain', label: 'Biblioteca' },
  { id: 'calendario', label: 'Calendario' },
]

export default function Sidebar({ paginaActiva, setPaginaActiva, session }) {
  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <aside style={{
      width: '210px',
      minWidth: '210px',
      background: '#16162a',
      borderRight: '1px solid #22223a',
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 14px',
      height: '100vh'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 10px',
        marginBottom: '36px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#7c3aed',
          boxShadow: '0 0 10px #7c3aed88'
        }} />
        <span style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '17px',
          fontWeight: '800',
          color: '#e0e0f5',
          letterSpacing: '-0.3px'
        }}>Cerebro</span>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setPaginaActiva(id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '9px 12px',
              borderRadius: '8px',
              border: 'none',
              background: paginaActiva === id ? '#22204a' : 'transparent',
              color: paginaActiva === id ? '#a78bfa' : '#6b6b8a',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: paginaActiva === id ? '500' : '400',
              marginBottom: '2px',
              fontFamily: 'DM Sans, sans-serif',
              textAlign: 'left'
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <div style={{
        padding: '10px 12px',
        fontSize: '11px',
        color: '#6b6b8a',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: '#2a2a4a',
          border: '1px solid #3a3a5a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: '#5a5a8a',
          flexShrink: 0
        }}>
          {session?.user?.email?.[0]?.toUpperCase()}
        </div>
        <span style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontSize: '11px'
        }}>
          {session?.user?.email}
        </span>
      </div>

      <button
        onClick={handleLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '9px 12px',
          borderRadius: '8px',
          border: 'none',
          background: 'transparent',
          color: '#6b6b8a',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'DM Sans, sans-serif',
          marginTop: '8px'
        }}
      >
        Cerrar sesión
      </button>
    </aside>
  )
}