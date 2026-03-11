import React, { useState } from 'react'
import useTodasTareas from '../hooks/useTodasTareas'
import usePARA from '../hooks/usePARA'
import TareaModal from '../components/TareaModal'
import { supabase } from '../lib/supabase'
import TareaDetalle from '../components/TareaDetalle'
import ConfirmarModal from '../components/ConfirmarModal'
import BloqueModal from '../components/BloqueModal'
import useBloques from '../hooks/useBloques'

export default function Tareas({ session, contexto }) {
  const { tareas, loading } = useTodasTareas(session?.user?.id)
  const { areas, proyectos } = usePARA(session?.user?.id)
  const [filtroEstado, setFiltroEstado] = useState('pendientes')
  const [filtroPrioridad, setFiltroPrioridad] = useState('')
  const [filtroFecha, setFiltroFecha] = useState('')
  const [ordenar, setOrdenar] = useState('prioridad')
  const [tareasLocales, setTareasLocales] = useState(null)
  const [proyectosActivos, setProyectosActivos] = useState(null)
  const [modalTarea, setModalTarea] = useState(false)
  const [tareaDetalle, setTareaDetalle] = useState(contexto?.tareaDetalle || null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [tareaParaBloque, setTareaParaBloque] = useState(null)
  const [bloqueModal, setBloqueModal] = useState(false)
  const { crearBloque } = useBloques(session?.user?.id)

  const todasTareas = tareasLocales || tareas

  const proyectosConTareas = proyectos.filter(p =>
    todasTareas.some(t => t.proyecto_id === p.id)
  )

  const activos = proyectosActivos || proyectosConTareas.map(p => p.id)

  const toggleProyecto = (id) => {
    if (activos.includes(id)) {
      setProyectosActivos(activos.filter(p => p !== id))
    } else {
      setProyectosActivos([...activos, id])
    }
  }

  const nombreArea = (proyectoId) => {
    const proyecto = proyectos.find(p => p.id === proyectoId)
    return areas.find(a => a.id === proyecto?.area_id)?.nombre || '—'
  }

const coloresPrioridad = { alta: '#f87171', normal: '#a78bfa', baja: '#4dab8a' }
const bgPrioridad = { alta: '#3a1a1a', normal: '#2d1f5e', baja: '#0d2520' }

  const filtrarTareas = (tareasList) => tareasList
    .filter(t => {
      if (filtroEstado === 'pendientes' && t.completada) return false
      if (filtroEstado === 'completadas' && !t.completada) return false
      if (filtroPrioridad && t.prioridad !== filtroPrioridad) return false
      if (filtroFecha === 'con' && !t.fecha_limite) return false
      if (filtroFecha === 'sin' && t.fecha_limite) return false
      return true
    })
    .sort((a, b) => {
      if (ordenar === 'prioridad') {
        const orden = { alta: 0, normal: 1, baja: 2 }
        return orden[a.prioridad] - orden[b.prioridad]
      }
      if (ordenar === 'fecha') {
        if (!a.fecha_limite) return 1
        if (!b.fecha_limite) return -1
        return new Date(a.fecha_limite) - new Date(b.fecha_limite)
      }
      return new Date(b.creado_at) - new Date(a.creado_at)
    })

  const handleCompletar = async (id, completada) => {
    await supabase.from('tareas').update({ completada }).eq('id', id)
    setTareasLocales(prev => (prev || tareas).map(t => t.id === id ? { ...t, completada } : t))
  }

  const handleEliminar = async (id) => {
    await supabase.from('tareas').delete().eq('id', id)
    setTareasLocales(prev => (prev || tareas).filter(t => t.id !== id))
  }

  const selectStyle = {
    padding: '7px 12px',
    background: '#252540',
    border: '1px solid #2e2e4e',
    borderRadius: '8px',
    color: '#c0c0e0',
    fontSize: '12px',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif'
  }

  const totalTareas = proyectosConTareas
    .filter(p => activos.includes(p.id))
    .reduce((acc, p) => acc + filtrarTareas(todasTareas.filter(t => t.proyecto_id === p.id)).length, 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '700', color: '#e8e8ff', letterSpacing: '-0.5px' }}>Tareas</h2>
          <p style={{ color: '#3a3a5a', fontSize: '12px', marginTop: '3px', fontWeight: '300' }}>Vista global · {totalTareas} tareas</p>
        </div>
        <button onClick={() => setModalTarea(true)} style={{
          padding: '9px 18px', background: '#7c3aed',
          border: 'none', borderRadius: '8px',
          color: 'white', fontSize: '13px', cursor: 'pointer', fontWeight: '500'
        }}>
          + Nueva tarea
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#6b6b8a', letterSpacing: '1px', textTransform: 'uppercase', marginRight: '4px' }}>Filtrar</span>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={selectStyle}>
          <option value="pendientes">Pendientes</option>
          <option value="completadas">Completadas</option>
          <option value="todas">Todas</option>
        </select>
        <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)} style={selectStyle}>
          <option value="">Todas las prioridades</option>
          <option value="alta">Alta</option>
          <option value="normal">Normal</option>
          <option value="baja">Baja</option>
        </select>
        <select value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)} style={selectStyle}>
          <option value="">Con y sin fecha</option>
          <option value="con">Con fecha límite</option>
          <option value="sin">Sin fecha límite</option>
        </select>
        <select value={ordenar} onChange={e => setOrdenar(e.target.value)} style={{ ...selectStyle, borderColor: '#7c3aed', color: '#a78bfa' }}>
          <option value="prioridad">Ordenar: Prioridad</option>
          <option value="fecha">Ordenar: Fecha límite</option>
          <option value="creacion">Ordenar: Creación</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '28px' }}>
 <span style={{ fontSize: '11px', color: '#6b6b8a', letterSpacing: '1px', textTransform: 'uppercase', marginRight: '4px' }}>Proyectos</span>
<button
  onClick={() => setProyectosActivos(proyectosConTareas.map(p => p.id))}
  style={{ padding: '3px 10px', background: '#1e2535', border: '1px solid #2a3550', borderRadius: '20px', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
>
  Todos
</button>
<button
  onClick={() => setProyectosActivos([])}
  style={{ padding: '3px 10px', background: '#1e2535', border: '1px solid #2a3550', borderRadius: '20px', color: '#94a3b8', fontSize: '11px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
>
  Ninguno
</button>
 <select
    onChange={e => {
      const id = e.target.value
      if (!id) return
      if (activos.includes(id)) {
        setProyectosActivos(activos.filter(p => p !== id))
      } else {
        setProyectosActivos([...activos, id])
      }
      e.target.value = ''
    }}
    style={selectStyle}
  >
    <option value="">Selecciona proyectos</option>
    {areas.map(area => {
      const pDeArea = proyectosConTareas.filter(p => {
        const proyecto = proyectos.find(pr => pr.id === p.id)
        return proyecto?.area_id === area.id
      })
      if (pDeArea.length === 0) return null
      return (
        <optgroup key={area.id} label={area.nombre}>
          {pDeArea.map(p => (
            <option key={p.id} value={p.id}>
              {activos.includes(p.id) ? '✓ ' : '○ '}{p.nombre}
            </option>
          ))}
        </optgroup>
      )
    })}

    {(() => {
      const sinArea = proyectosConTareas.filter(p => {
        const proyecto = proyectos.find(pr => pr.id === p.id)
        return !proyecto?.area_id
      })
      if (sinArea.length === 0) return null
      return (
        <optgroup label="Sin área">
          {sinArea.map(p => (
            <option key={p.id} value={p.id}>
              {activos.includes(p.id) ? '✓ ' : '○ '}{p.nombre}
            </option>
          ))}
        </optgroup>
      )
    })()}
  </select>

  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
    {proyectosConTareas.filter(p => activos.includes(p.id)).map(p => (
      <div
        key={p.id}
        onClick={() => setProyectosActivos(activos.filter(id => id !== p.id))}
        style={{
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          cursor: 'pointer',
          border: '1px solid #7c3aed',
          background: '#22204a',
          color: '#a78bfa',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {p.nombre} <span style={{ fontSize: '10px', opacity: 0.6 }}>×</span>
      </div>
    ))}
  </div>
</div>

      {loading ? (
        <p style={{ color: '#3a3a5a', fontSize: '13px' }}>Cargando...</p>
      ) : (
        proyectosConTareas
          .filter(p => activos.includes(p.id))
          .map(proyecto => {
            const tareasProy = filtrarTareas(todasTareas.filter(t => t.proyecto_id === proyecto.id))
            if (tareasProy.length === 0) return null
            return (
              <div key={proyecto.id} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 4px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#5a5a8a' }}>
                    {proyecto.nombre}
                  </span>
<span style={{ fontSize: '12px', color: '#94a3b8', padding: '2px 8px', background: '#1e2535', borderRadius: '10px', border: '1px solid #2a3550' }}>                    {nombreArea(proyecto.id)}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6b6b8a', marginLeft: 'auto' }}>
                    {tareasProy.length} tareas
                  </span>
                </div>

                <div style={{ background: '#16162a', borderRadius: '12px', border: '1px solid #22223a', overflow: 'hidden' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '28px 1fr 90px 110px 32px',
                    padding: '9px 16px',
                    borderBottom: '1px solid #22223a',
                    gap: '12px'
                  }}>
                    {['', 'Tarea', 'Prioridad', 'Fecha límite', ''].map((h, i) => (
  <div key={i} style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#6b6b8a', fontWeight: '500', textAlign: i === 2 || i === 3 ? 'center' : 'left' }}>
    {h}
  </div>
))}
                  </div>

                  {tareasProy.map(tarea => (
                    <div key={tarea.id} style={{
                      display: 'grid',
                      gridTemplateColumns: '28px 1fr 90px 110px 32px',
                      padding: '11px 16px',
                      borderBottom: '1px solid #1e1e30',
                      gap: '12px',
                      alignItems: 'center',
                      opacity: tarea.completada ? 0.4 : 1
                    }}>
                      <input
                        type="checkbox"
                        checked={tarea.completada}
                        onChange={e => handleCompletar(tarea.id, e.target.checked)}
                        style={{ cursor: 'pointer', accentColor: '#7c3aed', width: '16px', height: '16px' }}
                      />
                      <span
  onClick={() => { setTareaParaBloque(tarea); setBloqueModal(true) }}
  style={{ fontSize: '13px', color: '#c0c0e0', textDecoration: tarea.completada ? 'line-through' : 'none', cursor: 'pointer' }}
  onMouseEnter={e => e.currentTarget.style.color = '#e8e8ff'}
  onMouseLeave={e => e.currentTarget.style.color = '#c0c0e0'}
>
  {tarea.titulo}
</span>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{
                          fontSize: '11px',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: bgPrioridad[tarea.prioridad],
                          color: coloresPrioridad[tarea.prioridad],
                          fontWeight: '500'
                        }}>
                          {tarea.prioridad}
                        </span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        {tarea.fecha_limite ? (
                          <span style={{
                            fontSize: '11px',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            background: new Date(tarea.fecha_limite) < new Date() ? '#2d1515' : '#1e2535',
border: `1px solid ${new Date(tarea.fecha_limite) < new Date() ? '#3a1a1a' : '#2a3550'}`,
color: new Date(tarea.fecha_limite) < new Date() ? '#f87171' : '#94a3b8'
                          }}>
                            {new Date(tarea.fecha_limite + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#2e2e4e' }}>—</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <div
                          onClick={() => setTareaDetalle(tarea)}
                          style={{ color: '#3a3a5a', fontSize: '13px', cursor: 'pointer', padding: '0 2px' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                          onMouseLeave={e => e.currentTarget.style.color = '#3a3a5a'}
                          title="Editar"
                        >
                          ✏️
                        </div>
                        <div
                          onClick={() => setConfirmarEliminar(tarea.id)}
                          style={{ color: '#3a3a5a', fontSize: '14px', cursor: 'pointer', padding: '0 2px' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                          onMouseLeave={e => e.currentTarget.style.color = '#3a3a5a'}
                        >
                          🗑
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
      )}
    
    {confirmarEliminar && (
  <ConfirmarModal
    mensaje="Esta acción eliminará la tarea permanentemente."
    onConfirmar={() => { handleEliminar(confirmarEliminar); setConfirmarEliminar(null) }}
    onCerrar={() => setConfirmarEliminar(null)}
  />
)}
    
    {tareaDetalle && (
  <TareaDetalle
    tarea={tareaDetalle}
    onCerrar={() => setTareaDetalle(null)}
    onActualizar={(actualizada) => {
      setTareasLocales(prev => (prev || tareas).map(t => t.id === actualizada.id ? actualizada : t))
      setTareaDetalle(null)
    }}
  />
)}
    
    {modalTarea && (
  <TareaModal
    session={session}
    onGuardar={(nueva) => setTareasLocales(prev => [nueva, ...(prev || tareas)])}
    onCerrar={() => setModalTarea(false)}
  />
)}

{bloqueModal && tareaParaBloque && (
      <BloqueModal
        bloque={{ titulo: tareaParaBloque.titulo, proyecto_id: tareaParaBloque.proyecto_id, tarea_id: tareaParaBloque.id }}
        fecha={new Date().toISOString().split('T')[0]}
        horaInicial="09:00"
        proyectos={proyectos}
        tareas={tareas}
        onGuardar={async (datos) => {
          await crearBloque(datos.titulo, datos.fecha, datos.hora_inicio, datos.hora_fin, tareaParaBloque.id, tareaParaBloque.proyecto_id)
          setBloqueModal(false)
          setTareaParaBloque(null)
        }}
        onCerrar={() => { setBloqueModal(false); setTareaParaBloque(null) }}
        onEliminar={() => {}}
      />
    )}
    
    </div>
  )
}