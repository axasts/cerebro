import React, { useState } from 'react'
import useInbox from '../hooks/useInbox'
import usePARA from '../hooks/usePARA'
import useNotas from '../hooks/useNotas'
import NotaModal from '../components/NotaModal'
import { supabase } from '../lib/supabase'
import ProcesarModal from '../components/ProcesarModal'
import ConfirmarModal from '../components/ConfirmarModal'

export default function Inbox({ session, contexto }) {
  const { items, loading, añadirItem, eliminarItem, procesarItem } = useInbox(session?.user?.id)
  const { areas, proyectos } = usePARA(session?.user?.id)
  const { crearNota } = useNotas(session?.user?.id)
  const [texto, setTexto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [expandirCaptura, setExpandirCaptura] = useState(false)
  const [itemProcesando, setItemProcesando] = useState(contexto?.itemProcesando || null)
  const [notaModal, setNotaModal] = useState(false)
  const [notaInicial, setNotaInicial] = useState(null)
  const [itemOrigen, setItemOrigen] = useState(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!texto.trim()) return
    await añadirItem(texto.trim(), descripcion.trim())
    setTexto('')
    setDescripcion('')
    setExpandirCaptura(false)
  }

  const handleConvertirTarea = async (item, proyectoId, prioridad, fechaLimite = null) => {
    await supabase.from('tareas').insert([{
      titulo: item.contenido,
      descripcion: item.descripcion || '',
      proyecto_id: proyectoId,
      prioridad,
      fecha_limite: fechaLimite,
      user_id: session?.user?.id
    }])
    await procesarItem(item.id)
    setItemProcesando(null)
  }

  const handleConvertirNota = (item) => {
    setItemOrigen(item)
    setNotaInicial({ titulo: item.contenido, contenido: item.descripcion || '', url: '', etiquetas: [], area_id: '', proyecto_id: '' })
    setItemProcesando(null)
    setNotaModal(true)
  }

  const handleGuardarNota = async (datos) => {
    await crearNota(datos.titulo, datos.contenido, datos.area_id, datos.proyecto_id, datos.etiquetas, datos.url)
    await procesarItem(itemOrigen.id)
    setNotaModal(false)
    setNotaInicial(null)
    setItemOrigen(null)
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 16px',
    background: '#252540',
    border: '1px solid #2e2e4e',
    borderRadius: '10px',
    color: '#e8e8ff',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: '700', color: '#e8e8ff', letterSpacing: '-0.5px' }}>Inbox</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: expandirCaptura ? '10px' : '0' }}>
          <input
            type="text"
            placeholder="¿Qué tienes en la cabeza?"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onFocus={() => setExpandirCaptura(true)}
            style={inputStyle}
          />
          <button type="submit" style={{
            padding: '11px 20px',
            background: '#7c3aed',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: '500',
            whiteSpace: 'nowrap'
          }}>
            Añadir
          </button>
        </div>
        {expandirCaptura && (
          <textarea
            placeholder="Descripción, links, contexto... (opcional)"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
          />
        )}
      </form>

      {loading ? (
        <p style={{ color: '#3a3a5a', fontSize: '13px' }}>Cargando...</p>
      ) : items.length === 0 ? (
        <p style={{ color: '#3a3a5a', fontSize: '13px' }}>El inbox está vacío. ¡Bien hecho!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {items.map(item => (
            <div key={item.id} style={{
              padding: '12px 16px',
              background: '#252540',
              borderRadius: '10px',
              border: '1px solid #2a2a46'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#c0c0e0' }}>{item.contenido}</span>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0, marginLeft: '12px' }}>
                  <button onClick={() => setItemProcesando(item)} style={{
                    padding: '5px 12px',
                    background: '#3d2870',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    Procesar
                  </button>
                  <button onClick={() => setConfirmarEliminar(item.id)} style={{
                    padding: '5px 12px',
                    background: '#2d1515',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#f87171',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    Eliminar
                  </button>
                </div>
              </div>
              {item.descripcion && (
                <p style={{ fontSize: '12px', color: '#6b6b8a', marginTop: '6px', lineHeight: '1.5' }}>
                  {item.descripcion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {confirmarEliminar && (
  <ConfirmarModal
    mensaje="Esta acción eliminará el item del inbox permanentemente."
    onConfirmar={() => { eliminarItem(confirmarEliminar); setConfirmarEliminar(null) }}
    onCerrar={() => setConfirmarEliminar(null)}
  />
)}

      {itemProcesando && (
        <ProcesarModal
          item={itemProcesando}
          areas={areas}
          proyectos={proyectos}
          onConvertirTarea={handleConvertirTarea}
          onConvertirNota={handleConvertirNota}
          onCerrar={() => setItemProcesando(null)}
        />
      )}

      {notaModal && (
        <NotaModal
          nota={notaInicial}
          areas={areas}
          proyectos={proyectos}
          onGuardar={handleGuardarNota}
          onCerrar={() => { setNotaModal(false); setNotaInicial(null); setItemOrigen(null) }}
        />
      )}
    </div>
  )
}