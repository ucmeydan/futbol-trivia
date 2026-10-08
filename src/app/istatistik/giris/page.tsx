'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GirisPage() {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/istatistik-giris', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    if (res.ok) {
      router.push('/istatistik');
    } else {
      setError(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#020617', display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b', borderRadius: 16,
        padding: 40, width: 320,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 36 }}>⚽</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '8px 0 4px' }}>Admin Girişi</h1>
          <p style={{ color: '#475569', fontSize: 13, margin: 0 }}>Futbol Trivia İstatistikleri</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Şifre"
            value={key}
            onChange={e => { setKey(e.target.value); setError(false); }}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 10, border: `1px solid ${error ? '#ef4444' : '#1e293b'}`,
              background: '#020617', color: '#fff', fontSize: 16, boxSizing: 'border-box',
              outline: 'none',
            }}
            autoFocus
          />
          {error && <p style={{ color: '#f87171', fontSize: 13, margin: '8px 0 0' }}>Hatalı şifre.</p>}
          <button
            type="submit"
            style={{
              width: '100%', marginTop: 16, padding: '12px 0', background: '#dc2626',
              color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 10,
              cursor: 'pointer',
            }}
          >
            Giriş
          </button>
        </form>
      </div>
    </div>
  );
}
