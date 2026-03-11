import React, { useState } from 'react'
import useNotas from '../hooks/useNotas'
import usePARA from '../hooks/usePARA'
import NotaCard from '../components/NotaCard'
import NotaModal from '../components/NotaModal'

export default function Brain({ session, contexto }) {
  const { notas, loading, crearNota, editarNota, eliminarNota } = useNotas(session?.user?.id)
  const { areas, proyectos } = usePARA(session?.user?.id)
  const [notaEditando, setNotaEditando] = useState(contexto?.notaEditando || null)
const [modalAbierto, setModalAbierto] = useState(!!contexto?.notaEditando)
  const [busqueda, setBusqueda] = useState('')
  const [filtroArea, setFiltroArea] = useState('')
  const [filtroEtiqueta, setFiltroEtiqueta] = useState('')

  const todasEtiquetas = [...new Set(notas.flatMap(n => n.etiquetas || []))]

  const notasFiltradas = notas.filter(n => {
    const coincideBusqueda = !busqueda || n.titulo.toLowerCase().includes(busqueda.toLowerCase()) || n.contenido?.toLowerCase().includes(busqueda.toLowerCase())
    const coincideArea = !filtroArea || n.area_id === filtroArea
    const coincideEtiqueta = !filtroEtiqueta || n.etiquetas?.includes(filtroEtiqueta)
    return coincideBusqueda && coincideArea && coincideEtiqueta
  })

  const handleGuardar = async (datos) => {
    if (notaEditando?.id) {
      await editarNota(notaEditando.id, datos)
    } else {
      await crearNota(datos.titulo, datos.contenido, datos.area_id, datos.proyecto_id, datos.etiquetas, datos.url)
    }
    setModalAbierto(false)
    setNotaEditando(null)
  }

  const handleEditar = (nota) => {
    setNotaEditando(nota)
    setModalAbierto(true)
  }

  const handleNueva = () => {
    setNotaEditando(null)
    setModalAbierto(true)
  }

  const selectStyle = {
    padding: '8px 12px',
    background: '#252540',
    border: '1px solid #2e2e4e',
    borderRadius: '8px',
    color: '#c0c0e0',
    fontSize: '12px',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '700', color: '#e8e8ff', letterSpacing: '-0.5px' }}>Biblioteca</h2>
        </div>
        <button onClick={handleNueva} style={{
          padding: '9px 18px', background: '#7c3aed',
          border: 'none', borderRadius: '8px',
          color: 'white', fontSize: '13px', cursor: 'pointer',
          fontWeight: '500', fontFamily: 'DM Sans, sans-serif'
        }}>
          + Nueva nota
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar notas..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            flex: 1, minWidth: '200px',
            padding: '8px 14px',
            background: '#252540',
            border: '1px solid #2e2e4e',
            borderRadius: '8px',
            color: '#e8e8ff',
            fontSize: '13px',
            outline: 'none',
            fontFamily: 'DM Sans, sans-serif'
          }}
        />
        <select value={filtroArea} onChange={e => setFiltroArea(e.target.value)} style={selectStyle}>
          <option value="">Todas las áreas</option>
          {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>
        {todasEtiquetas.length > 0 && (
          <select value={filtroEtiqueta} onChange={e => setFiltroEtiqueta(e.target.value)} style={selectStyle}>
            <option value="">Todas las etiquetas</option>
            {todasEtiquetas.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
      </div>

      {loading ? (
        <p style={{ color: '#3a3a5a', fontSize: '13px' }}>Cargando...</p>
      ) : notasFiltradas.length === 0 ? (
        <p style={{ color: '#3a3a5a', fontSize: '13px' }}>No hay notas todavía</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {notasFiltradas.map(nota => (
            <NotaCard key={nota.id} nota={nota} onEditar={handleEditar} onEliminar={eliminarNota} />
          ))}
        </div>
      )}

      {modalAbierto && (
        <NotaModal
          nota={notaEditando}
          areas={areas}
          proyectos={proyectos}
          onGuardar={handleGuardar}
          onCerrar={() => { setModalAbierto(false); setNotaEditando(null) }}
        />
      )}
    </div>
  )
}