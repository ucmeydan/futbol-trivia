'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => console.log('SW kayitli:', reg.scope))
        .catch((err) => console.log('SW hatasi:', err));
    }
  }, []);

  return null;
}
