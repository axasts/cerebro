import React, { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import usePARA from '../hooks/usePARA'
import AreaCard from '../components/AreaCard'
import ProyectoDetalle from '../components/ProyectoDetalle'
import AreaDetalle from '../components/AreaDetalle'

export default function PARA({ session, contexto }) {
  const { areas, loading, crearArea, editarArea, eliminarArea, crearProyecto, editarProyecto, eliminarProyecto, cerrarProyecto, reabrirProyecto, proyectosPorArea, cerradosPorArea } = usePARA(session?.user?.id)
  const [nuevaArea, setNuevaArea] = useState('')
  const [iconoSeleccionado, setIconoSeleccionado] = useState('📁')
  const [mostrarFormArea, setMostrarFormArea] = useState(false)
  const [mostrarEmojiPicker, setMostrarEmojiPicker] = useState(false)
  const [proyectoActivo, setProyectoActivo] = useState(contexto?.proyectoActivo || null)
const [areaActiva, setAreaActiva] = useState(null)


  const handleCrearArea = async (e) => {
    e.preventDefault()
    if (!nuevaArea.trim()) return
    await crearArea(nuevaArea.trim(), iconoSeleccionado)
    setNuevaArea('')
    setIconoSeleccionado('📁')
    setMostrarFormArea(false)
    setMostrarEmojiPicker(false)
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

  if (areaActiva) {
    return (
      <AreaDetalle
        area={areaActiva}
        proyectos={proyectosPorArea(areaActiva.id)}
        proyectosCerrados={cerradosPorArea(areaActiva.id)}
        onVolver={() => setAreaActiva(null)}
        onCrearProyecto={crearProyecto}
        onEliminarProyecto={eliminarProyecto}
        onCerrarProyecto={cerrarProyecto}
        onReabrirProyecto={reabrirProyecto}
        onEditarProyecto={editarProyecto}
        session={session}
      />
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '700', color: '#e8e8ff', letterSpacing: '-0.5px' }}>Áreas</h2>
        </div>
        <button
          onClick={() => setMostrarFormArea(!mostrarFormArea)}
          style={{
            padding: '9px 18px', background: '#7c3aed',
            border: 'none', borderRadius: '8px',
            color: 'white', fontSize: '13px', cursor: 'pointer',
            fontWeight: '500', fontFamily: 'DM Sans, sans-serif'
          }}
        >
          + Nueva área
        </button>
      </div>

      {mostrarFormArea && (
        <form onSubmit={handleCrearArea} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setMostrarEmojiPicker(!mostrarEmojiPicker)}
                style={{
                  width: '46px', height: '46px',
                  background: '#252540', border: '1px solid #2e2e4e',
                  borderRadius: '10px', fontSize: '22px',
                  cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              >
                {iconoSeleccionado}
              </button>
              {mostrarEmojiPicker && (
                <div style={{ position: 'absolute', top: '52px', left: 0, zIndex: 100 }}>
                  <EmojiPicker
                    onEmojiClick={(e) => { setIconoSeleccionado(e.emoji); setMostrarEmojiPicker(false) }}
                    theme="dark"
                    width={320}
                    height={400}
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder="Nombre del área"
              value={nuevaArea}
              onChange={e => setNuevaArea(e.target.value)}
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
            }}>
              Crear
            </button>
            <button type="button" onClick={() => { setMostrarFormArea(false); setMostrarEmojiPicker(false) }} style={{
              padding: '11px 18px', background: 'transparent',
              border: '1px solid #2e2e4e', borderRadius: '10px',
              color: '#3a3a5a', fontSize: '13px', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif'
            }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: '#3a3a5a', fontSize: '13px' }}>Cargando...</p>
      ) : areas.length === 0 ? (
        <p style={{ color: '#3a3a5a', fontSize: '13px' }}>No hay áreas todavía. Crea tu primera área.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {areas.map(area => (
            <AreaCard
              key={area.id}
              area={area}
              proyectos={proyectosPorArea(area.id)}
              proyectosCerrados={cerradosPorArea(area.id)}
              onEliminarArea={eliminarArea}
              onCrearProyecto={crearProyecto}
              onEliminarProyecto={eliminarProyecto}
              onCerrarProyecto={cerrarProyecto}
              onReabrirProyecto={reabrirProyecto}
              onVerProyecto={setProyectoActivo}
              onEditarArea={editarArea}
              onVerArea={setAreaActiva}
              onEditarProyecto={editarProyecto}
            />
          ))}
        </div>
      )}
    </div>
  )
}