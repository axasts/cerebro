import React, { useState } from 'react'
import ConfirmarModal from './ConfirmarModal'

export default function NotaCard({ nota, onEditar, onEliminar }) {

const [confirmarEliminar, setConfirmarEliminar] = useState(false)

  return (
    <div
      onClick={() => onEditar(nota)}
      style={{
        background: '#252540',
        border: '1px solid #2a2a46',
        borderRadius: '10px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'border-color 0.15s'
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#3a3a5e'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a46'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h4 style={{ fontFamily: 'Syne, sans-serif', color: '#e8e8ff', fontSize: '14px', fontWeight: '700', lineHeight: '1.4' }}>
          {nota.titulo}
        </h4>
        <button
          onClick={e => { e.stopPropagation(); setConfirmarEliminar(true) }}
          style={{ background: 'transparent', border: 'none', color: '#3a3a5a', cursor: 'pointer', fontSize: '16px', lineHeight: 1, flexShrink: 0, marginLeft: '8px' }}
          onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
          onMouseLeave={e => e.currentTarget.style.color = '#3a3a5a'}
        >
          ×
        </button>
      </div>

      {nota.contenido && (
        <p style={{
          color: '#4a4a6a', fontSize: '12px', lineHeight: '1.5', marginBottom: '8px',
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {nota.contenido}
        </p>
      )}

      {nota.url && (
        <a
          href={nota.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ color: '#a78bfa', fontSize: '12px', textDecoration: 'none' }}
        >
          🔗 {nota.url}
        </a>
      )}

      {nota.etiquetas?.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
          {nota.etiquetas.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px',
              background: '#2d1f5e',
              border: 'none',
              borderRadius: '20px',
              color: '#a78bfa',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {confirmarEliminar && (
  <ConfirmarModal
    mensaje="Esta acción eliminará la nota permanentemente."
    onConfirmar={() => { onEliminar(nota.id); setConfirmarEliminar(false) }}
    onCerrar={() => setConfirmarEliminar(false)}
  />
)}

    </div>
  )
}