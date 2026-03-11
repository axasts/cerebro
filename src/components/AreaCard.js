import React, { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import ProyectoCard from './ProyectoCard'
import ConfirmarModal from './ConfirmarModal'

export default function AreaCard({ area, proyectos, proyectosCerrados, onEliminarArea, onEditarArea, onCrearProyecto, onEliminarProyecto, onCerrarProyecto, onReabrirProyecto, onVerProyecto, onVerArea, onEditarProyecto }) {
  const [nuevoProyecto, setNuevoProyecto] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [mostrarCerrados, setMostrarCerrados] = useState(false)
  const [confirmarEliminarArea, setConfirmarEliminarArea] = useState(false)
  const [confirmarEliminarProyecto, setConfirmarEliminarProyecto] = useState(null)
  const [editando, setEditando] = useState(false)
  const [nombreEdit, setNombreEdit] = useState(area.nombre)
  const [iconoEdit, setIconoEdit] = useState(area.icono || '📁')
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false)
  const [iconoProyecto, setIconoProyecto] = useState('📋')
  const [mostrarEmojiPickerProyecto, setMostrarEmojiPickerProyecto] = useState(false)

  const handleCrearProyecto = async (e) => {
    e.preventDefault()
    if (!nuevoProyecto.trim()) return
    await onCrearProyecto(nuevoProyecto.trim(), area.id, '', iconoProyecto)
    setNuevoProyecto('')
    setIconoProyecto('📋')
    setMostrarForm(false)
  }

  const handleGuardarEdicion = async () => {
    if (!nombreEdit.trim()) return
    await onEditarArea(area.id, nombreEdit.trim(), iconoEdit)
    setEditando(false)
    setMostrarEmojiPicker(false)
  }

  return (
    <div style={{
      background: '#16162a',
      border: '1px solid #22223a',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '0',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {editando ? (
          <div style={{ display: 'flex', gap: '6px', flex: 1, alignItems: 'center', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setMostrarEmojiPicker(!mostrarEmojiPicker)}
              style={{
                width: '36px', height: '36px',
                background: '#252540', border: '1px solid #2e2e4e',
                borderRadius: '8px', fontSize: '18px',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {iconoEdit}
            </button>
            {mostrarEmojiPicker && (
              <div style={{ position: 'absolute', top: '42px', left: 0, zIndex: 100 }}>
                <EmojiPicker
                  onEmojiClick={(e) => { setIconoEdit(e.emoji); setMostrarEmojiPicker(false) }}
                  theme="dark"
                  width={300}
                  height={380}
                />
              </div>
            )}
            <input
              type="text"
              value={nombreEdit}
              onChange={e => setNombreEdit(e.target.value)}
              autoFocus
              style={{
                flex: 1, padding: '7px 12px',
                background: '#252540', border: '1px solid #2e2e4e',
                borderRadius: '8px', color: '#e8e8ff',
                fontSize: '13px', outline: 'none',
                fontFamily: 'DM Sans, sans-serif'
              }}
            />
            <button onClick={handleGuardarEdicion} style={{
              padding: '6px 12px', background: '#7c3aed',
              border: 'none', borderRadius: '6px',
              color: 'white', fontSize: '12px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', flexShrink: 0
            }}>
              ✓
            </button>
            <button onClick={() => { setEditando(false); setMostrarEmojiPicker(false) }} style={{
              padding: '6px 12px', background: 'transparent',
              border: '1px solid #2e2e4e', borderRadius: '6px',
              color: '#3a3a5a', fontSize: '12px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', flexShrink: 0
            }}>
              ×
            </button>
          </div>
        ) : (
          <>
            <h3
  onClick={() => onVerArea(area)}
  style={{ fontFamily: 'Syne, sans-serif', color: '#e8e8ff', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
  onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
  onMouseLeave={e => e.currentTarget.style.color = '#e8e8ff'}
>
  <span>{area.icono || '📁'}</span>{area.nombre}
</h3>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setEditando(true)} style={{
                padding: '4px 10px', background: '#252540',
                border: '1px solid #2e2e4e', borderRadius: '6px',
                color: '#6b6b8a', fontSize: '11px', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                ✏️
              </button>
              <button onClick={() => setMostrarForm(!mostrarForm)} style={{
                padding: '4px 10px', background: '#7c3aed',
                border: 'none', borderRadius: '6px',
                color: 'white', fontSize: '11px', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                + Proyecto
              </button>
              <button onClick={() => setConfirmarEliminarArea(true)} style={{
                padding: '4px 10px', background: '#2d1515',
                border: 'none', borderRadius: '6px',
                color: '#f87171', fontSize: '11px', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>

      {/* FORM NUEVO PROYECTO */}
      {mostrarForm && (
        <form onSubmit={handleCrearProyecto} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setMostrarEmojiPickerProyecto(!mostrarEmojiPickerProyecto)}
              style={{
                width: '40px', height: '40px',
                background: '#252540', border: '1px solid #2e2e4e',
                borderRadius: '8px', fontSize: '18px',
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {iconoProyecto}
            </button>
            {mostrarEmojiPickerProyecto && (
              <div style={{ position: 'absolute', top: '46px', left: 0, zIndex: 100 }}>
                <EmojiPicker
                  onEmojiClick={(e) => { setIconoProyecto(e.emoji); setMostrarEmojiPickerProyecto(false) }}
                  theme="dark"
                  width={300}
                  height={380}
                />
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Nombre del proyecto"
            value={nuevoProyecto}
            onChange={e => setNuevoProyecto(e.target.value)}
            autoFocus
            style={{
              flex: 1, padding: '9px 12px',
              background: '#252540', border: '1px solid #2e2e4e',
              borderRadius: '8px', color: '#e8e8ff',
              fontSize: '13px', outline: 'none',
              fontFamily: 'DM Sans, sans-serif'
            }}
          />
          <button type="submit" style={{
            padding: '9px 14px', background: '#7c3aed',
            border: 'none', borderRadius: '8px',
            color: 'white', fontSize: '13px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Crear
          </button>
          <button type="button" onClick={() => setMostrarForm(false)} style={{
            padding: '9px 14px', background: 'transparent',
            border: '1px solid #2e2e4e', borderRadius: '8px',
            color: '#3a3a5a', fontSize: '13px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Cancelar
          </button>
        </form>
      )}

      {/* PROYECTOS ACTIVOS */}
      {proyectos.length === 0 ? (
        <p style={{ color: '#3a3a5a', fontSize: '12px' }}>No hay proyectos activos</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {proyectos.slice(0, 3).map(proyecto => (
            <ProyectoCard
              key={proyecto.id}
              proyecto={proyecto}
              onEliminar={onEliminarProyecto}
              onCerrar={onCerrarProyecto}
              onVer={onVerProyecto}
              onEditar={onEditarProyecto}
            />
          ))}
        
        {proyectos.length > 3 && (
  <button onClick={() => onVerArea(area)} style={{
    background: 'transparent', border: 'none',
    color: '#a78bfa', fontSize: '12px', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', padding: '0', marginTop: '4px'
  }}>
    Ver todos ({proyectos.length}) →
  </button>
)}
        
        </div>
      )}

      {/* PROYECTOS CERRADOS */}
      {proyectosCerrados?.length > 0 && (
        <div>
          <button onClick={() => setMostrarCerrados(!mostrarCerrados)} style={{
            background: 'transparent', border: 'none',
            color: '#3a3a5a', fontSize: '11px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', padding: '0',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            {mostrarCerrados ? '▾' : '▸'} {proyectosCerrados.length} proyecto{proyectosCerrados.length > 1 ? 's' : ''} cerrado{proyectosCerrados.length > 1 ? 's' : ''}
          </button>
          {mostrarCerrados && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              {proyectosCerrados.map(proyecto => (
                <div key={proyecto.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '9px 12px', background: '#1a1a2e',
                  borderRadius: '8px', border: '1px solid #22223a', opacity: 0.7
                }}>
                  <span style={{ fontSize: '12px', color: '#6b6b8a', fontFamily: 'DM Sans, sans-serif' }}>
                    {proyecto.nombre}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => onReabrirProyecto(proyecto.id)} style={{
                      padding: '3px 10px', background: '#1e2535',
                      border: '1px solid #2a3550', borderRadius: '6px',
                      color: '#94a3b8', fontSize: '11px', cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Reabrir
                    </button>
                    <button onClick={() => setConfirmarEliminarProyecto(proyecto.id)} style={{
                      padding: '3px 10px', background: '#2d1515',
                      border: 'none', borderRadius: '6px',
                      color: '#f87171', fontSize: '11px', cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODALES CONFIRMAR */}
      {confirmarEliminarArea && (
        <ConfirmarModal
          mensaje="Se eliminará el área y todos sus proyectos permanentemente."
          onConfirmar={() => { onEliminarArea(area.id); setConfirmarEliminarArea(false) }}
          onCerrar={() => setConfirmarEliminarArea(false)}
        />
      )}
      {confirmarEliminarProyecto && (
        <ConfirmarModal
          mensaje="Esta acción eliminará el proyecto permanentemente."
          onConfirmar={() => { onEliminarProyecto(confirmarEliminarProyecto); setConfirmarEliminarProyecto(null) }}
          onCerrar={() => setConfirmarEliminarProyecto(null)}
        />
      )}
    </div>
  )
}