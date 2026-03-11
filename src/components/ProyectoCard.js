import React, { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import ConfirmarModal from './ConfirmarModal'

export default function ProyectoCard({ proyecto, onEliminar, onCerrar, onVer, onEditar }) {
  const [confirmarEliminar, setConfirmarEliminar] = useState(false)
  const [editando, setEditando] = useState(false)
  const [nombreEdit, setNombreEdit] = useState(proyecto.nombre)
  const [iconoEdit, setIconoEdit] = useState(proyecto.icono || '📋')
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false)

  const handleGuardarEdicion = async () => {
    if (!nombreEdit.trim()) return
    await onEditar(proyecto.id, nombreEdit.trim(), iconoEdit)
    setEditando(false)
    setMostrarEmojiPicker(false)
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: '#1e1e32',
      borderRadius: '8px',
      border: '1px solid #2a2a46',
      position: 'relative'
    }}>
      {editando ? (
        <div style={{ display: 'flex', gap: '6px', flex: 1, alignItems: 'center', position: 'relative' }}>
          <button
            type="button"
            onClick={() => setMostrarEmojiPicker(!mostrarEmojiPicker)}
            style={{
              width: '32px', height: '32px',
              background: '#252540', border: '1px solid #2e2e4e',
              borderRadius: '6px', fontSize: '16px',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {iconoEdit}
          </button>
          {mostrarEmojiPicker && (
            <div style={{ position: 'absolute', top: '38px', left: 0, zIndex: 100 }}>
              <EmojiPicker
                onEmojiClick={(e) => { setIconoEdit(e.emoji); setMostrarEmojiPicker(false) }}
                theme="dark"
                width={300}
                height={360}
              />
            </div>
          )}
          <input
            type="text"
            value={nombreEdit}
            onChange={e => setNombreEdit(e.target.value)}
            autoFocus
            style={{
              flex: 1, padding: '6px 10px',
              background: '#252540', border: '1px solid #2e2e4e',
              borderRadius: '6px', color: '#e8e8ff',
              fontSize: '12px', outline: 'none',
              fontFamily: 'DM Sans, sans-serif'
            }}
          />
          <button onClick={handleGuardarEdicion} style={{
            padding: '5px 10px', background: '#7c3aed',
            border: 'none', borderRadius: '6px',
            color: 'white', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', flexShrink: 0
          }}>✓</button>
          <button onClick={() => { setEditando(false); setMostrarEmojiPicker(false) }} style={{
            padding: '5px 10px', background: 'transparent',
            border: '1px solid #2e2e4e', borderRadius: '6px',
            color: '#3a3a5a', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', flexShrink: 0
          }}>×</button>
        </div>
      ) : (
        <>
          <span
            onClick={() => onVer(proyecto)}
            style={{
              fontSize: '13px', color: '#c0c0e0',
              cursor: 'pointer', flex: 1,
              fontFamily: 'DM Sans, sans-serif',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}
          >
            <span>{proyecto.icono || '📋'}</span>{proyecto.nombre}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => onVer(proyecto)} style={{
              padding: '5px 12px', background: '#3d2870',
              border: 'none', borderRadius: '6px',
              color: '#ffffff', fontSize: '12px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>Abrir</button>
            <button onClick={() => setEditando(true)} style={{
              padding: '5px 12px', background: '#252540',
              border: '1px solid #2e2e4e', borderRadius: '6px',
              color: '#6b6b8a', fontSize: '12px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>✏️</button>
            <button onClick={() => onCerrar(proyecto.id)} style={{
              padding: '5px 12px', background: '#1e2535',
              border: '1px solid #2a3550', borderRadius: '6px',
              color: '#94a3b8', fontSize: '12px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>Cerrar</button>
            <button onClick={() => setConfirmarEliminar(true)} style={{
              padding: '5px 12px', background: '#2d1515',
              border: 'none', borderRadius: '6px',
              color: '#f87171', fontSize: '12px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>Eliminar</button>
          </div>
        </>
      )}

      {confirmarEliminar && (
        <ConfirmarModal
          mensaje="Esta acción eliminará el proyecto permanentemente."
          onConfirmar={() => { onEliminar(proyecto.id); setConfirmarEliminar(false) }}
          onCerrar={() => setConfirmarEliminar(false)}
        />
      )}
    </div>
  )
}