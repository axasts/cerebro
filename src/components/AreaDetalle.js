import React, { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import ProyectoCard from './ProyectoCard'
import ProyectoDetalle from './ProyectoDetalle'
import ConfirmarModal from './ConfirmarModal'
import useTareas from '../hooks/useTareas'

function ProyectoCardDetalle({ proyecto, onVerProyecto, onEliminar, onCerrar, onEditar, userId }) {
  const { tareas, loading } = useTareas(userId, proyecto.id)

  return (
    <div
      style={{
        background: '#16162a',
        border: '1px solid #22223a',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4
          onClick={() => onVerProyecto(proyecto)}
          style={{
            fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700',
            color: '#e8e8ff', display: 'flex', alignItems: 'center', gap: '8px',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
          onMouseLeave={e => e.currentTarget.style.color = '#e8e8ff'}
        >
          <span>{proyecto.icono || '📋'}</span>{proyecto.nombre}
        </h4>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={() => onVerProyecto(proyecto)} style={{
            padding: '3px 10px', background: '#3d2870',
            border: 'none', borderRadius: '5px',
            color: 'white', fontSize: '11px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>Abrir</button>
          <button onClick={() => onEditar(proyecto)} style={{
            padding: '3px 10px', background: '#252540',
            border: '1px solid #2e2e4e', borderRadius: '5px',
            color: '#6b6b8a', fontSize: '11px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>✏️</button>
          <button onClick={() => onCerrar(proyecto.id)} style={{
            padding: '3px 10px', background: '#1e2535',
            border: '1px solid #2a3550', borderRadius: '5px',
            color: '#94a3b8', fontSize: '11px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>Cerrar</button>
          <button onClick={() => onEliminar(proyecto.id)} style={{
            padding: '3px 10px', background: '#2d1515',
            border: 'none', borderRadius: '5px',
            color: '#f87171', fontSize: '11px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>×</button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#3a3a5a', fontSize: '11px' }}>Cargando...</p>
      ) : tareas.length === 0 ? (
        <p style={{ color: '#3a3a5a', fontSize: '11px' }}>Sin tareas</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {tareas.filter(t => !t.completada).slice(0, 3).map(tarea => (
            <div key={tarea.id} style={{
              fontSize: '13px', color: '#6b6b8a',
              padding: '10px 14px', background: '#1e1e32',
              borderRadius: '6px', fontFamily: 'DM Sans, sans-serif',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{ color: '#3a3a5a' }}>○</span> {tarea.titulo}
            </div>
          ))}
          {tareas.filter(t => !t.completada).length > 3 && (
            <p style={{ color: '#3a3a5a', fontSize: '11px', marginTop: '2px' }}>
              +{tareas.filter(t => !t.completada).length - 3} más
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function AreaDetalle({ area, proyectos, proyectosCerrados, onVolver, onCrearProyecto, onEliminarProyecto, onCerrarProyecto, onReabrirProyecto, onEditarProyecto, session }) {
  const [proyectoActivo, setProyectoActivo] = useState(null)
  const [nuevoProyecto, setNuevoProyecto] = useState('')
  const [iconoProyecto, setIconoProyecto] = useState('📋')
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [mostrarCerrados, setMostrarCerrados] = useState(false)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [editandoProyecto, setEditandoProyecto] = useState(null)
  const [nombreEdit, setNombreEdit] = useState('')
  const [iconoEdit, setIconoEdit] = useState('📋')
  const [mostrarEmojiPickerEdit, setMostrarEmojiPickerEdit] = useState(false)

  const handleCrearProyecto = async (e) => {
    e.preventDefault()
    if (!nuevoProyecto.trim()) return
    await onCrearProyecto(nuevoProyecto.trim(), area.id, '', iconoProyecto)
    setNuevoProyecto('')
    setIconoProyecto('📋')
    setMostrarForm(false)
    setMostrarEmojiPicker(false)
  }

  const handleEditarProyecto = (proyecto) => {
    setEditandoProyecto(proyecto)
    setNombreEdit(proyecto.nombre)
    setIconoEdit(proyecto.icono || '📋')
  }

  const handleGuardarEdicion = async () => {
    if (!nombreEdit.trim()) return
    await onEditarProyecto(editandoProyecto.id, nombreEdit.trim(), iconoEdit)
    setEditandoProyecto(null)
    setMostrarEmojiPickerEdit(false)
  }

  if (proyectoActivo) {
    return (
      <ProyectoDetalle
        proyecto={proyectoActivo}
        onVolver={() => setProyectoActivo(null)}
        session={session}
      />
    )
  }

  return (
    <div>
      <button onClick={onVolver} style={{
        background: 'transparent', border: 'none',
        color: '#a78bfa', cursor: 'pointer',
        fontSize: '13px', marginBottom: '24px',
        padding: 0, fontFamily: 'DM Sans, sans-serif'
      }}>
        ← Volver
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '700', color: '#e8e8ff', letterSpacing: '-0.5px' }}>
            {area.icono || '📁'} {area.nombre}
          </h2>
          <p style={{ color: '#3a3a5a', fontSize: '12px', marginTop: '3px' }}>
            {proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''} activo{proyectos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{
          padding: '9px 18px', background: '#7c3aed',
          border: 'none', borderRadius: '8px',
          color: 'white', fontSize: '13px', cursor: 'pointer',
          fontWeight: '500', fontFamily: 'DM Sans, sans-serif'
        }}>
          + Nuevo proyecto
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={handleCrearProyecto} style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setMostrarEmojiPicker(!mostrarEmojiPicker)} style={{
              width: '46px', height: '46px', background: '#252540',
              border: '1px solid #2e2e4e', borderRadius: '10px',
              fontSize: '22px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {iconoProyecto}
            </button>
            {mostrarEmojiPicker && (
              <div style={{ position: 'absolute', top: '52px', left: 0, zIndex: 100 }}>
                <EmojiPicker
                  onEmojiClick={(e) => { setIconoProyecto(e.emoji); setMostrarEmojiPicker(false) }}
                  theme="dark" width={320} height={400}
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
              flex: 1, padding: '11px 16px',
              background: '#252540', border: '1px solid #2e2e4e',
              borderRadius: '10px', color: '#e8e8ff',
              fontSize: '13px', outline: 'none',
              fontFamily: 'DM Sans, sans-serif'
            }}
          />
          <button type="submit" style={{
            padding: '11px 18px', background: '#7c3aed',
            border: 'none', borderRadius: '10px',
            color: 'white', fontSize: '13px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>Crear</button>
          <button type="button" onClick={() => setMostrarForm(false)} style={{
            padding: '11px 18px', background: 'transparent',
            border: '1px solid #2e2e4e', borderRadius: '10px',
            color: '#3a3a5a', fontSize: '13px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>Cancelar</button>
        </form>
      )}

      {/* MODAL EDITAR PROYECTO */}
      {editandoProyecto && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#16162a', border: '1px solid #22223a',
            borderRadius: '14px', padding: '28px', width: '400px', maxWidth: '90vw'
          }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '16px', fontWeight: '700', color: '#e8e8ff', marginBottom: '20px' }}>
              Editar proyecto
            </h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <button type="button" onClick={() => setMostrarEmojiPickerEdit(!mostrarEmojiPickerEdit)} style={{
                  width: '46px', height: '46px', background: '#252540',
                  border: '1px solid #2e2e4e', borderRadius: '10px',
                  fontSize: '22px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {iconoEdit}
                </button>
                {mostrarEmojiPickerEdit && (
                  <div style={{ position: 'absolute', top: '52px', left: 0, zIndex: 100 }}>
                    <EmojiPicker
                      onEmojiClick={(e) => { setIconoEdit(e.emoji); setMostrarEmojiPickerEdit(false) }}
                      theme="dark" width={300} height={380}
                    />
                  </div>
                )}
              </div>
              <input
                type="text"
                value={nombreEdit}
                onChange={e => setNombreEdit(e.target.value)}
                autoFocus
                style={{
                  flex: 1, padding: '11px 16px',
                  background: '#252540', border: '1px solid #2e2e4e',
                  borderRadius: '10px', color: '#e8e8ff',
                  fontSize: '13px', outline: 'none',
                  fontFamily: 'DM Sans, sans-serif'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditandoProyecto(null)} style={{
                padding: '10px 20px', background: 'transparent',
                border: '1px solid #2e2e4e', borderRadius: '8px',
                color: '#3a3a5a', fontSize: '13px', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}>Cancelar</button>
              <button onClick={handleGuardarEdicion} style={{
                padding: '10px 20px', background: '#7c3aed',
                border: 'none', borderRadius: '8px',
                color: 'white', fontSize: '13px', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif'
              }}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {proyectos.length === 0 ? (
        <p style={{ color: '#3a3a5a', fontSize: '13px' }}>No hay proyectos activos</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {proyectos.map(proyecto => (
            <ProyectoCardDetalle
  key={proyecto.id}
  proyecto={proyecto}
  onVerProyecto={setProyectoActivo}
  onEliminar={(id) => setConfirmarEliminar(id)}
  onCerrar={onCerrarProyecto}
  onEditar={handleEditarProyecto}
  userId={session?.user?.id}
/>
          ))}
        </div>
      )}

      {proyectosCerrados?.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <button onClick={() => setMostrarCerrados(!mostrarCerrados)} style={{
            background: 'transparent', border: 'none',
            color: '#3a3a5a', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif', padding: '0',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            {mostrarCerrados ? '▾' : '▸'} {proyectosCerrados.length} proyecto{proyectosCerrados.length > 1 ? 's' : ''} cerrado{proyectosCerrados.length > 1 ? 's' : ''}
          </button>
          {mostrarCerrados && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
              {proyectosCerrados.map(proyecto => (
                <div key={proyecto.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 16px', background: '#1a1a2e',
                  borderRadius: '8px', border: '1px solid #22223a', opacity: 0.7
                }}>
                  <span style={{ fontSize: '13px', color: '#6b6b8a', fontFamily: 'DM Sans, sans-serif' }}>
                    {proyecto.icono || '📋'} {proyecto.nombre}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => onReabrirProyecto(proyecto.id)} style={{
                      padding: '4px 12px', background: '#1e2535',
                      border: '1px solid #2a3550', borderRadius: '6px',
                      color: '#94a3b8', fontSize: '12px', cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>Reabrir</button>
                    <button onClick={() => setConfirmarEliminar(proyecto.id)} style={{
                      padding: '4px 12px', background: '#2d1515',
                      border: 'none', borderRadius: '6px',
                      color: '#f87171', fontSize: '12px', cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif'
                    }}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {confirmarEliminar && (
        <ConfirmarModal
          mensaje="Esta acción eliminará el proyecto permanentemente."
          onConfirmar={() => { onEliminarProyecto(confirmarEliminar); setConfirmarEliminar(null) }}
          onCerrar={() => setConfirmarEliminar(null)}
        />
      )}
    </div>
  )
}