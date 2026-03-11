import React from 'react'

export default function ConfirmarModal({ mensaje, onConfirmar, onCerrar }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: '#16162a',
        border: '1px solid #22223a',
        borderRadius: '14px',
        padding: '32px',
        paddingTop: '36px',
        width: '380px',
        maxWidth: '90vw'
      }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: '700', color: '#e8e8ff', marginBottom: '12px', lineHeight: '1.4' }}>
          ¿Estás seguro?
        </h3>
        <p style={{ fontSize: '13px', color: '#6b6b8a', marginBottom: '28px', lineHeight: '1.6' }}>
          {mensaje}
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onCerrar} style={{
            padding: '10px 20px', background: 'transparent',
            border: '1px solid #2e2e4e', borderRadius: '8px',
            color: '#6b6b8a', fontSize: '13px', cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif'
          }}>
            Cancelar
          </button>
          <button onClick={onConfirmar} style={{
            padding: '10px 20px', background: '#2d1515',
            border: '1px solid #3a1a1a', borderRadius: '8px',
            color: '#f87171', fontSize: '13px', cursor: 'pointer',
            fontWeight: '500', fontFamily: 'DM Sans, sans-serif'
          }}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}