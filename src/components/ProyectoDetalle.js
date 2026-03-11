import React, { useState } from 'react'
import useTareas from '../hooks/useTareas'
import useNotas from '../hooks/useNotas'
import NotaCard from './NotaCard'
import NotaModal from './NotaModal'
import usePARA from '../hooks/usePARA'
import BloqueModal from './BloqueModal'
import useBloques from '../hooks/useBloques'
import ConfirmarModal from './ConfirmarModal'
import TareaModal from './TareaModal'
import TareaDetalle from './TareaDetalle'
import { supabase } from '../lib/supabase'

export default function ProyectoDetalle({ proyecto, onVolver, session }) {
  const { tareas, loading, crearTarea, completarTarea, eliminarTarea } = useTareas(session?.user?.id, proyecto.id)
  const { notas, crearNota, editarNota, eliminarNota, notasPorProyecto } = useNotas(session?.user?.id)
  const { areas, proyectos } = usePARA(session?.user?.id)
  const [notaModal, setNotaModal] = useState(false)
  const [notaEditando, setNotaEditando] = useState(null)
  const [fechaLimite, setFechaLimite] = useState('')
  const { crearBloque } = useBloques(session?.user?.id)
  const [bloqueModal, setBloqueModal] = useState(false)
  const [tareaParaCalendario, setTareaParaCalendario] = useState(null)
  const [nuevaTarea, setNuevaTarea] = useState('')
  const [prioridad, setPrioridad] = useState('normal')
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const notasDelProyecto = notasPorProyecto(proyecto.id)
  const [tareaModal, setTareaModal] = useState(false)
  const [tareaDetalle, setTareaDetalle] = useState(null)

  const handleGuardarNota = async (datos) => {
    if (notaEditando?.id) {
      await editarNota(notaEditando.id, datos)
    } else {
      await crearNota(datos.titulo, datos.contenido, proyecto.area_id, proyecto.id, datos.etiquetas, datos.url)
    }
    setNotaModal(false)
    setNotaEditando(null)
  }

  const handleCrearTarea = async (e) => {
    e.preventDefault()
    if (!nuevaTarea.trim()) return
    await crearTarea(nuevaTarea.trim(), prioridad, fechaLimite || null)
    setNuevaTarea('')
    setPrioridad('normal')
    setFechaLimite('')
  }

  const handleGuardarBloque = async (datos) => {
    await crearBloque(datos.titulo, datos.fecha, datos.hora_inicio, datos.hora_fin, tareaParaCalendario.id, proyecto.id)
    setBloqueModal(false)
    setTareaParaCalendario(null)
  }

  const coloresPrioridad = { alta: '#f87171', normal: '#a78bfa', baja: '#4dab8a' }
  const bgPrioridad = { alta: '#3a1a1a', normal: '#2d1f5e', baja: '#0d2520' }

  const inputStyle = {
    padding: '10px 14px',
    background: '#252540',
    border: '1px solid #2e2e4e',
    borderRadius: '8px',
    color: '#e8e8ff',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif'
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

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '700', color: '#e8e8ff', letterSpacing: '-0.5px' }}>
          {proyecto.nombre}
        </h2>
        {proyecto.descripcion && (
          <p style={{ color: '#3a3a5a', fontSize: '12px', marginTop: '4px' }}>{proyecto.descripcion}</p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
  <h3 style={{ fontSize: '11px', color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '500' }}>Tareas</h3>
  <button onClick={() => setTareaModal(true)} style={{
    padding: '7px 16px', background: '#7c3aed',
    border: 'none', borderRadius: '8px',
    color: 'white', fontSize: '12px', cursor: 'pointer',
    fontWeight: '500', fontFamily: 'DM Sans, sans-serif'
  }}>
    + Nueva tarea
  </button>
</div>

      {loading ? (
        <p style={{ color: '#3a3a5a', fontSize: '13px' }}>Cargando...</p>
      ) : tareas.length === 0 ? (
        <p style={{ color: '#3a3a5a', fontSize: '13px' }}>No hay tareas aún</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {tareas.map(tarea => (
            <div key={tarea.id} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 16px',
              background: '#252540',
              borderRadius: '10px',
              border: '1px solid #2a2a46',
              opacity: tarea.completada ? 0.4 : 1
            }}>
              <input
                type="checkbox"
                checked={tarea.completada}
                onChange={e => completarTarea(tarea.id, e.target.checked)}
                style={{ cursor: 'pointer', accentColor: '#7c3aed', width: '16px', height: '16px' }}
              />
              <span
  onClick={() => { setTareaParaCalendario(tarea); setBloqueModal(true) }}
  style={{
    flex: 1, fontSize: '13px', color: '#c0c0e0',
    textDecoration: tarea.completada ? 'line-through' : 'none',
    cursor: 'pointer'
  }}
  onMouseEnter={e => e.currentTarget.style.color = '#e8e8ff'}
  onMouseLeave={e => e.currentTarget.style.color = '#c0c0e0'}
>
  {tarea.titulo}
</span>
              <span style={{
                fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                background: bgPrioridad[tarea.prioridad],
                color: coloresPrioridad[tarea.prioridad], fontWeight: '500'
              }}>
                {tarea.prioridad}
              </span>
              {tarea.fecha_limite && (
                <span style={{
                  fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
                  background: new Date(tarea.fecha_limite) < new Date() ? '#2d1515' : '#1e2535',
                  border: `1px solid ${new Date(tarea.fecha_limite) < new Date() ? '#3a1a1a' : '#2a3550'}`,
                  color: new Date(tarea.fecha_limite) < new Date() ? '#f87171' : '#94a3b8'
                }}>
                  {new Date(tarea.fecha_limite + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              )}
              <button
                onClick={() => setTareaDetalle(tarea)}
                style={{ background: 'transparent', border: 'none', color: '#3a3a5a', cursor: 'pointer', fontSize: '13px', padding: '0 4px' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                onMouseLeave={e => e.currentTarget.style.color = '#3a3a5a'}
                title="Editar tarea"
              >
                ✏️
              </button>
              <button
                onClick={() => setConfirmarEliminar(tarea.id)}
                style={{ background: 'transparent', border: 'none', color: '#3a3a5a', cursor: 'pointer', fontSize: '16px' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                onMouseLeave={e => e.currentTarget.style.color = '#3a3a5a'}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '11px', color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '500' }}>Notas vinculadas</h3>
          <button
            onClick={() => { setNotaEditando(null); setNotaModal(true) }}
            style={{
              padding: '6px 14px', background: '#7c3aed',
              border: 'none', borderRadius: '6px',
              color: 'white', fontSize: '12px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            + Nueva nota
          </button>
        </div>

        {notasDelProyecto.length === 0 ? (
          <p style={{ color: '#3a3a5a', fontSize: '13px' }}>No hay notas vinculadas a este proyecto</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
            {notasDelProyecto.map(nota => (
              <NotaCard
                key={nota.id}
                nota={nota}
                onEditar={(n) => { setNotaEditando(n); setNotaModal(true) }}
                onEliminar={eliminarNota}
              />
            ))}
          </div>
        )}
      </div>
    
      {tareaDetalle && (
  <TareaDetalle
    tarea={tareaDetalle}
    onCerrar={() => setTareaDetalle(null)}
    onGuardar={async (datos) => {
      await supabase.from('tareas').update(datos).eq('id', tareaDetalle.id)
      setTareaDetalle(null)
    }}
  />
)}
      
      {confirmarEliminar && (
  <ConfirmarModal
    mensaje="Esta acción eliminará la tarea permanentemente."
    onConfirmar={() => { eliminarTarea(confirmarEliminar); setConfirmarEliminar(null) }}
    onCerrar={() => setConfirmarEliminar(null)}
  />
)}
      
    {tareaModal && (
  <TareaModal
    session={session}
    proyectoIdInicial={proyecto.id}
    onGuardar={async (nuevaTarea) => {
      await crearTarea(nuevaTarea.titulo, nuevaTarea.prioridad, nuevaTarea.fecha_limite, nuevaTarea.descripcion)
      setTareaModal(false)
    }}
    onCerrar={() => setTareaModal(false)}
  />
)}
      
      
      {notaModal && (
        <NotaModal
          nota={notaEditando}
          areas={areas}
          proyectos={proyectos}
          onGuardar={handleGuardarNota}
          onCerrar={() => { setNotaModal(false); setNotaEditando(null) }}
          bloqueado={!notaEditando}
        />
      )}

      {bloqueModal && proyectos && tareas && tareaParaCalendario && (
        <BloqueModal
          bloque={{ titulo: tareaParaCalendario.titulo, proyecto_id: proyecto.id, tarea_id: tareaParaCalendario.id }}
          fecha={new Date().toISOString().split('T')[0]}
          horaInicial="09:00"
          proyectos={proyectos}
          tareas={tareas}
          onGuardar={handleGuardarBloque}
          onCerrar={() => { setBloqueModal(false); setTareaParaCalendario(null) }}
          onEliminar={() => {}}
        />
      )}
    </div>
  )
}