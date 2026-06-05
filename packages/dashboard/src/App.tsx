import React, { useEffect, useState } from 'react';

interface Stats {
  version: string;
  lastSnapshot: string;
  combined: { overallBand: number; daysUntilExam: number };
  writing?: { totalEssays: number; topErrors?: { category: string; count: number }[] };
  reading?: { totalPassages: number; averageBand: number; topErrors?: { category: string; count: number }[] };
  listening?: { totalSections: number; averageBand: number };
}

function App() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch('/stats.json');
        if (r.ok) { setStats(await r.json()); return; }
      } catch { /* try next */ }
      setError('No stats.json found. Run `ielts snapshot` then copy to packages/dashboard/public/.');
    };
    load();
  }, []);

  if (error) return <div style={{ padding: 40, fontFamily: 'monospace' }}>{error}</div>;
  if (!stats) return <div style={{ padding: 40, fontFamily: 'monospace' }}>Loading...</div>;

  const card = (title: string, value: string | number, subtitle: string) => (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, minWidth: 140 }}>
      <div style={{ fontSize: 12, color: '#666' }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 'bold' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#999' }}>{subtitle}</div>
    </div>
  );

  return (
    <div style={{ padding: 40, fontFamily: 'system-ui, sans-serif', maxWidth: 960, margin: '0 auto' }}>
      <h1>IELTS Dashboard</h1>
      <p style={{ color: '#666' }}>Last updated: {new Date(stats.lastSnapshot).toLocaleDateString()}</p>
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        {card('Overall', stats.combined.overallBand || '—', 'Current')}
        {card('Writing', stats.writing?.totalEssays || 0, 'essays')}
        {card('Reading', stats.reading?.totalPassages || 0, 'passages')}
        {card('Listening', stats.listening?.totalSections || 0, 'sections')}
      </div>
      {stats.combined.daysUntilExam > 0 && (
        <div style={{ background: '#fff3cd', padding: 12, borderRadius: 8, marginBottom: 24 }}>
          Exam in {stats.combined.daysUntilExam} days
        </div>
      )}
      <details>
        <summary style={{ cursor: 'pointer' }}>Raw JSON</summary>
        <pre style={{ fontSize: 11, background: '#f5f5f5', padding: 16, borderRadius: 8, overflow: 'auto' }}>
          {JSON.stringify(stats, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default App;
