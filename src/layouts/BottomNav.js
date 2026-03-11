import React from 'react'
import { supabase } from '../lib/supabase'

const items = [
  { id: 'dashboard', icon: '🧠', label: 'Inicio' },
  { id: 'inbox', icon: '📥', label: 'Inbox' },
  { id: 'tareas', icon: '✅', label: 'Tareas' },
  { id: 'para', icon: '📁', label: 'Áreas' },
  { id: 'brain', icon: '📚', label: 'Biblioteca' },
]

export default function BottomNav({ paginaActiva, navegarA, session }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      height: '64px',
      background: '#16162a',
      borderTop: '1px solid #22223a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => navegarA(item.id)}
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '3px',
            background: 'none', border: 'none',
            cursor: 'pointer', padding: '8px 12px',
            color: paginaActiva === item.id ? '#a78bfa' : '#3a3a5a',
            fontFamily: 'DM Sans, sans-serif'
          }}
        >
          <span style={{ fontSize: '20px' }}>{item.icon}</span>
          <span style={{
            fontSize: '10px', fontWeight: '500',
            color: paginaActiva === item.id ? '#a78bfa' : '#3a3a5a'
          }}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  )
}