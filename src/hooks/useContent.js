import { useState, useEffect } from 'react';

const API = 'http://localhost:4000';

export function useContent(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}${endpoint}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [endpoint]);

  return { data, loading };
}
