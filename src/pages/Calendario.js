import React, { useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import useBloques from '../hooks/useBloques'
import usePARA from '../hooks/usePARA'
import useTodasTareas from '../hooks/useTodasTareas'
import BloqueModal from '../components/BloqueModal'
import BloqueItem from '../components/BloqueItem'
import { useDroppable } from '@dnd-kit/core'

const HORA_ALTURA = 40 // px por hora
const HORAS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

const getDiasSemana = (fechaBase) => {
  const dias = []
  const inicio = new Date(fechaBase)
  const diaSemana = inicio.getDay()
  const diff = diaSemana === 0 ? -6 : 1 - diaSemana
  inicio.setDate(inicio.getDate() + diff)
  for (let i = 0; i < 7; i++) {
    const d = new Date(inicio)
    d.setDate(inicio.getDate() + i)
    dias.push(d)
  }
  return dias
}

const fechaISO = (date) => date.toISOString().split('T')[0]

const nombreDia = (date) => {
  const nombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  return nombres[date.getDay()]
}

const horaAMinutos = (hora) => {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

function ColumniaDia({ fechaDia, bloques, proyectos, onClickCelda, onEditarBloque }) {
  const { setNodeRef, isOver } = useDroppable({ id: fechaDia })

  const nombreProyecto = (proyectoId) => {
    const p = proyectos.find(p => p.id === proyectoId)
    return p ? p.nombre : null
  }

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const y = e.clientY - rect.top
        const minutos = Math.floor(y / HORA_ALTURA * 60)
        const horas = Math.floor(minutos / 60)
        const mins = Math.floor(minutos % 60 / 15) * 15
        const hora = `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
        onClickCelda(fechaDia, hora)
      }}
      style={{
        position: 'relative',
        height: `${24 * HORA_ALTURA}px`,
        background: isOver ? '#1e1e3a' : 'transparent',
        cursor: 'pointer'
      }}
    >
      {/* Líneas de hora */}
      {HORAS.map((hora, i) => (
        <div key={hora} style={{
          position: 'absolute',
          top: `${i * HORA_ALTURA}px`,
          left: 0, right: 0,
          borderTop: '1px solid #1e1e38',
          height: `${HORA_ALTURA}px`,
          pointerEvents: 'none'
        }} />
      ))}

      {/* Bloques */}
      {bloques.map(bloque => {
        const inicioMin = horaAMinutos(bloque.hora_inicio)
        const finMin = horaAMinutos(bloque.hora_fin)
        const top = (inicioMin / 60) * HORA_ALTURA
        const height = Math.max(((finMin - inicioMin) / 60) * HORA_ALTURA, 24)
        return (
          <div
            key={bloque.id}
            style={{
              position: 'absolute',
              top: `${top}px`,
              left: '2px',
              right: '2px',
              height: `${height}px`,
              zIndex: 10
            }}
          >
            <BloqueItem
              bloque={bloque}
              nombreProyecto={nombreProyecto(bloque.proyecto_id)}
              onClick={(e) => { e.stopPropagation(); onEditarBloque(bloque) }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default function Calendario({ session }) {
  const { bloques, loading, crearBloque, editarBloque, eliminarBloque, bloquesPorFecha } = useBloques(session?.user?.id)
  const { proyectos } = usePARA(session?.user?.id)
  const { tareas } = useTodasTareas(session?.user?.id)
  const [fechaBase, setFechaBase] = useState(new Date())
  const [modalAbierto, setModalAbierto] = useState(false)
  const [bloqueEditando, setBloqueEditando] = useState(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaISO(new Date()))
  const [horaSeleccionada, setHoraSeleccionada] = useState('09:00')
  const [bloqueArrastrado, setBloqueArrastrado] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 }
  }))

  const diasSemana = getDiasSemana(fechaBase)
  const hoy = fechaISO(new Date())

  const handleNuevoBloque = (fecha, hora) => {
    setFechaSeleccionada(fecha)
    setHoraSeleccionada(hora)
    setBloqueEditando(null)
    setModalAbierto(true)
  }

  const handleEditarBloque = (bloque) => {
    setBloqueEditando(bloque)
    setFechaSeleccionada(bloque.fecha)
    setHoraSeleccionada(bloque.hora_inicio)
    setModalAbierto(true)
  }

  const handleGuardar = async (datos) => {
    if (bloqueEditando?.id) {
      await editarBloque(bloqueEditando.id, datos)
    } else {
      await crearBloque(datos.titulo, datos.fecha, datos.hora_inicio, datos.hora_fin, datos.tarea_id, datos.proyecto_id)
    }
    setModalAbierto(false)
    setBloqueEditando(null)
  }

  const handleDragStart = (event) => {
    const bloque = bloques.find(b => b.id === event.active.id)
    setBloqueArrastrado(bloque)
  }

  const handleDragEnd = async (event) => {
    setBloqueArrastrado(null)
    const { active, over } = event
    if (!over) return
    const bloque = bloques.find(b => b.id === active.id)
    if (!bloque) return
    const nuevaFecha = over.id
    if (bloque.fecha === nuevaFecha) return
    const duracion = horaAMinutos(bloque.hora_fin) - horaAMinutos(bloque.hora_inicio)
    const inicioMin = horaAMinutos(bloque.hora_inicio)
    const finMin = inicioMin + duracion
    const horaFin = `${String(Math.floor(finMin / 60) % 24).padStart(2, '0')}:${String(finMin % 60).padStart(2, '0')}`
    await editarBloque(bloque.id, { fecha: nuevaFecha, hora_inicio: bloque.hora_inicio, hora_fin: horaFin })
  }

  const btnNavStyle = {
    padding: '6px 14px',
    background: '#252540',
    border: '1px solid #2e2e4e',
    borderRadius: '6px',
    color: '#6b6b8a',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'DM Sans, sans-serif'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '700', color: '#e8e8ff', letterSpacing: '-0.5px' }}>Calendario</h2>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button onClick={() => { const d = new Date(fechaBase); d.setDate(d.getDate() - 7); setFechaBase(d) }} style={btnNavStyle}>←</button>
          <button onClick={() => setFechaBase(new Date())} style={btnNavStyle}>Hoy</button>
          <button onClick={() => { const d = new Date(fechaBase); d.setDate(d.getDate() + 7); setFechaBase(d) }} style={btnNavStyle}>→</button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px repeat(7, 1fr)',
          background: '#22223a',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #22223a'
        }}>
          {/* Header */}
          <div style={{ background: '#16162a', borderBottom: '1px solid #22223a' }} />
          {diasSemana.map(dia => (
            <div key={fechaISO(dia)} style={{
              background: fechaISO(dia) === hoy ? '#1e1e3a' : '#16162a',
              padding: '10px 8px',
              textAlign: 'center',
              borderBottom: '1px solid #22223a',
              borderLeft: '1px solid #22223a'
            }}>
              <div style={{ color: '#6b6b8a', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>{nombreDia(dia)}</div>
              <div style={{
                color: fechaISO(dia) === hoy ? '#a78bfa' : '#94a3b8',
                fontSize: '16px',
                fontWeight: fechaISO(dia) === hoy ? '700' : '400',
                fontFamily: 'DM Sans, sans-serif'
              }}>
                {dia.getDate()}
              </div>
            </div>
          ))}

          {/* Columna horas + columnas días */}
          <div style={{ background: '#16162a' }}>
            {HORAS.map((hora, i) => (
              <div key={hora} style={{
                height: `${HORA_ALTURA}px`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '4px',
                color: '#6b6b8a',
                fontSize: '10px',
                borderTop: '1px solid #1e1e38'
              }}>
                {hora}
              </div>
            ))}
          </div>

          {diasSemana.map(dia => {
            const fechaDia = fechaISO(dia)
            const bloquesDelDia = bloquesPorFecha(fechaDia)
            return (
              <div key={fechaDia} style={{
                background: fechaDia === hoy ? '#1a1a2e' : '#16162a',
                borderLeft: '1px solid #22223a'
              }}>
                <ColumniaDia
                  fechaDia={fechaDia}
                  bloques={bloquesDelDia}
                  proyectos={proyectos}
                  onClickCelda={handleNuevoBloque}
                  onEditarBloque={handleEditarBloque}
                />
              </div>
            )
          })}
        </div>

        <DragOverlay>
          {bloqueArrastrado && (
            <div style={{
              background: '#2d1f5e',
              border: '1px solid #7c3aed',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              color: '#e8e8ff',
              opacity: 0.9,
              minWidth: '80px'
            }}>
              <div style={{ fontWeight: '600' }}>{bloqueArrastrado.titulo}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {modalAbierto && proyectos && tareas && (
        <BloqueModal
          bloque={bloqueEditando}
          fecha={fechaSeleccionada}
          horaInicial={horaSeleccionada}
          proyectos={proyectos}
          tareas={tareas}
          onGuardar={handleGuardar}
          onCerrar={() => { setModalAbierto(false); setBloqueEditando(null) }}
          onEliminar={async (id) => { await eliminarBloque(id); setModalAbierto(false); setBloqueEditando(null) }}
        />
      )}
    </div>
  )
}