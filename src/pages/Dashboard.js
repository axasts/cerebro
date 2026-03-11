import React, { useState } from 'react'
import useInbox from '../hooks/useInbox'
import usePARA from '../hooks/usePARA'
import useNotas from '../hooks/useNotas'
import useTodasTareas from '../hooks/useTodasTareas'
import useBloques from '../hooks/useBloques'
import ProcesarModal from '../components/ProcesarModal'
import BloqueModal from '../components/BloqueModal'

const hoy = new Date().toISOString().split('T')[0]

const coloresPrioridad = { alta: '#f87171', normal: '#a78bfa', baja: '#4dab8a' }
const bgPrioridad = { alta: '#3a1a1a', normal: '#2d1f5e', baja: '#0d2520' }

export default function Dashboard({ session, navegarA }) {
  const userId = session?.user?.id
  const { items, procesarItem } = useInbox(userId)
  const { proyectos, areas } = usePARA(userId)
  const { notas } = useNotas(userId)
  const { tareas } = useTodasTareas(userId)
  const [itemProcesando, setItemProcesando] = useState(null)
  const { bloquesPorFecha, crearBloque } = useBloques(userId)
    const [tareaParaBloque, setTareaParaBloque] = useState(null)
 const [bloqueModal, setBloqueModal] = useState(false)

  const bloquesHoy = bloquesPorFecha(hoy)
  const tareasAlta = tareas.filter(t => t.prioridad === 'alta').slice(0, 5)
  const proyectosActivos = proyectos.slice(0, 4)
  const notasRecientes = notas.slice(0, 3)
  const itemsInbox = items.slice(0, 4)

  const fecha = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const fechaCapital = fecha.charAt(0).toUpperCase() + fecha.slice(1)

  const sectionTitle = {
    fontSize: '10px', color: '#6b6b8a',
    textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '500'
  }
  const sectionLink = {
    fontSize: '11px', color: '#a78bfa',
    cursor: 'pointer', background: 'none',
    border: 'none', fontFamily: 'DM Sans, sans-serif'
  }
  const card = {
    background: '#16162a', border: '1px solid #22223a',
    borderRadius: '14px', padding: '20px'
  }

  return (
    <div>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: '800', color: '#e8e8ff', letterSpacing: '-0.5px' }}>
            🧠 Sala de Operaciones
          </h2>
          <p style={{ color: '#3a3a5a', fontSize: '12px', marginTop: '4px', fontWeight: '300' }}>{fechaCapital}</p>
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Tareas pendientes', value: tareas.length, sub: `${tareas.filter(t => t.prioridad === 'alta').length} de alta prioridad`, accent: true },
          { label: 'En inbox', value: items.length, sub: 'Sin procesar' },
          { label: 'Proyectos activos', value: proyectos.length, sub: `En ${areas.length} áreas` },
          { label: 'Notas', value: notas.length, sub: 'En biblioteca' },
        ].map(({ label, value, sub, accent }) => (
          <div key={label} style={{
            background: accent ? '#1e1a38' : '#252540',
            border: `1px solid ${accent ? '#3d2870' : '#2a2a46'}`,
            borderRadius: '12px', padding: '18px 20px'
          }}>
            <div style={{ fontSize: '10px', color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>{label}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '700', color: accent ? '#a78bfa' : '#e8e8ff', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '11px', color: '#3a3a5a', marginTop: '6px' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* FILA 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>

        {/* TAREAS PRIORITARIAS */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={sectionTitle}>Tareas prioritarias</span>
            <button style={sectionLink} onClick={() => navegarA('tareas')}>Ver todas →</button>
          </div>
          {tareasAlta.length === 0 ? (
            <p style={{ color: '#3a3a5a', fontSize: '12px' }}>No hay tareas de alta prioridad 🎉</p>
          ) : tareasAlta.map(tarea => (
            <div key={tarea.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', background: '#252540',
              borderRadius: '8px', border: '1px solid #2a2a46', marginBottom: '6px'
            }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid #2e2e4e', flexShrink: 0 }} />
              <span
                onClick={() => { setTareaParaBloque(tarea); setBloqueModal(true) }}
                style={{ flex: 1, fontSize: '12px', color: '#c0c0e0', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8e8ff'}
                onMouseLeave={e => e.currentTarget.style.color = '#c0c0e0'}
              >
                {tarea.titulo}
              </span>
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: bgPrioridad[tarea.prioridad], color: coloresPrioridad[tarea.prioridad], fontWeight: '500' }}>
                {tarea.prioridad}
              </span>
              {tarea.fecha_limite && (
                <span style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                  background: new Date(tarea.fecha_limite) < new Date() ? '#2d1515' : '#1e2535',
                  border: `1px solid ${new Date(tarea.fecha_limite) < new Date() ? '#3a1a1a' : '#2a3550'}`,
                  color: new Date(tarea.fecha_limite) < new Date() ? '#f87171' : '#94a3b8'
                }}>
                  {new Date(tarea.fecha_limite + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* INBOX */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={sectionTitle}>Inbox</span>
            <button style={sectionLink} onClick={() => navegarA('inbox')}>Procesar →</button>
          </div>
          {itemsInbox.length === 0 ? (
            <p style={{ color: '#3a3a5a', fontSize: '12px' }}>Inbox vacío ✨</p>
          ) : itemsInbox.map(item => (
            <div
              key={item.id}
              onClick={() => setItemProcesando(item)}
              style={{
                padding: '9px 12px', background: '#252540',
                borderRadius: '8px', border: '1px solid #2a2a46', marginBottom: '6px',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a46'}
            >
              <div style={{ fontSize: '12px', color: '#c0c0e0' }}>{item.contenido}</div>
              {item.descripcion && <div style={{ fontSize: '11px', color: '#6b6b8a', marginTop: '2px' }}>{item.descripcion}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* FILA 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>

        {/* PROYECTOS ACTIVOS */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={sectionTitle}>Proyectos activos</span>
            <button style={sectionLink} onClick={() => navegarA('para')}>Ver áreas →</button>
          </div>
          {proyectosActivos.length === 0 ? (
            <p style={{ color: '#3a3a5a', fontSize: '12px' }}>No hay proyectos activos</p>
          ) : proyectosActivos.map(proyecto => {
            const area = areas.find(a => a.id === proyecto.area_id)
            return (
              <div key={proyecto.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', background: '#252540',
                borderRadius: '8px', border: '1px solid #2a2a46', marginBottom: '6px'
              }}>
                <span style={{ fontSize: '16px' }}>{proyecto.icono || '📋'}</span>
                <div style={{ flex: 1 }}>
                  <div
                    onClick={() => navegarA('para', { proyectoActivo: proyecto })}
                    style={{ fontSize: '12px', color: '#c0c0e0', fontWeight: '500', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#e8e8ff'}
                    onMouseLeave={e => e.currentTarget.style.color = '#c0c0e0'}
                  >
                    {proyecto.nombre}
                  </div>
                  {area && <div style={{ fontSize: '10px', color: '#6b6b8a', marginTop: '1px' }}>{area.icono} {area.nombre}</div>}
                </div>
              </div>
            )
          })}
        </div>

        {/* CALENDARIO HOY */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={sectionTitle}>Hoy en el calendario</span>
            <button style={sectionLink} onClick={() => navegarA('calendario')}>Ver semana →</button>
          </div>
          {bloquesHoy.length === 0 ? (
            <p style={{ color: '#3a3a5a', fontSize: '12px' }}>Sin bloques hoy</p>
          ) : bloquesHoy.slice(0, 4).map(bloque => (
            <div key={bloque.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', background: '#252540',
              borderRadius: '8px', border: '1px solid #2a2a46', marginBottom: '6px'
            }}>
              <div style={{ width: '3px', height: '28px', background: '#7c3aed', borderRadius: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '10px', color: '#a78bfa', fontWeight: '500', minWidth: '38px' }}>
                {bloque.hora_inicio.substring(0, 5)}
              </div>
              <span style={{ fontSize: '12px', color: '#c0c0e0', flex: 1 }}>{bloque.titulo}</span>
            </div>
          ))}
        </div>

        {/* NOTAS RECIENTES */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={sectionTitle}>Notas recientes</span>
            <button style={sectionLink} onClick={() => navegarA('brain')}>Ver biblioteca →</button>
          </div>
          {notasRecientes.length === 0 ? (
            <p style={{ color: '#3a3a5a', fontSize: '12px' }}>No hay notas todavía</p>
          ) : notasRecientes.map(nota => (
            <div key={nota.id} style={{
              padding: '9px 12px', background: '#252540',
              borderRadius: '8px', border: '1px solid #2a2a46', marginBottom: '6px'
            }}>
              <div
                onClick={() => navegarA('brain', { notaEditando: nota })}
                style={{ fontSize: '12px', color: '#c0c0e0', fontWeight: '500', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8e8ff'}
                onMouseLeave={e => e.currentTarget.style.color = '#c0c0e0'}
              >
                {nota.titulo}
              </div>
              {nota.etiquetas?.length > 0 && (
                <div style={{ fontSize: '10px', color: '#6b6b8a', marginTop: '3px' }}>
                  {nota.etiquetas.slice(0, 3).map(t => `#${t}`).join(' · ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PROCESAR MODAL */}
      {itemProcesando && (
        <ProcesarModal
          item={itemProcesando}
          areas={areas}
          proyectos={proyectos}
          onCerrar={() => setItemProcesando(null)}
          onGuardar={async () => {
            await procesarItem(itemProcesando.id)
            setItemProcesando(null)
          }}
        />
      )}

      {bloqueModal && tareaParaBloque && (
        <BloqueModal
          bloque={{ titulo: tareaParaBloque.titulo, proyecto_id: tareaParaBloque.proyecto_id, tarea_id: tareaParaBloque.id }}
          fecha={hoy}
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