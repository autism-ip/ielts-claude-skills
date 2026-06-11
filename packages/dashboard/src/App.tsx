import React, { useEffect, useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Tooltip as RTooltip,
} from 'recharts';

interface Answer { q: number; user: string; correct: string; result: string; type?: string }
interface Err { q?: string; type?: string; detail?: string }
interface Session { date: string; type: string; title?: string; totalQuestions?: number; correctCount?: number; overall?: number; wordCount?: number; dimensions?: any; sections?: string; sectionScores?: any; errors?: Err[]; answers?: Answer[]; synonyms?: { from: string; to: string }[]; questionTypes?: string[] }
interface DayD { date: string; sessions: number; subjects: string[] }
interface Stats { version: string; lastSnapshot: string; combined: { totalStudyDays: number; totalSessions: number; targetBand: number; daysUntilExam: number; examDates: string[] }; days: DayD[]; history: Session[]; trends: any; todaySession?: any; vocab?: any; speaking?: any; profile?: any }

const c = { paper: '#f5efe6', card: '#efe6d9', ink: '#1c1a17', muted: '#8a7f72', line: '#d6c9b8', accent: '#8b3a3a', green: '#2b5c3a', gold: '#a67c2e', blue: '#3a5a8b' };
const pieC = [c.accent, c.gold, '#b8860b', c.green, c.blue, '#6b4c3b'];
const E = 'cubic-bezier(0.25,1,0.5,1)';
const sg = (i: number, d = 90, shift = 6): React.CSSProperties => ({ opacity: 0, animation: `in .6s ${E} ${i * d}ms forwards` });
const fmt = (s: string) => { const d = new Date(s); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}` };

function Nav({ active, setActive }: { active: string; setActive: (k: string) => void }) {
  const items = [{ k: 'overview', l: 'Overview' }, { k: 'reading', l: 'Reading' }, { k: 'writing', l: 'Writing' }, { k: 'listening', l: 'Listening' }, { k: 'vocab', l: 'Vocab' }];
  return (
    <nav style={{ width: 160, padding: '40px 12px', borderRight: `1px solid ${c.line}`, flexShrink: 0 }}>
      <div style={{ fontSize: 14, color: c.muted, textTransform: 'uppercase', letterSpacing: 2.5, padding: '8px 16px 28px', fontFamily: "'Fraunces',Georgia,serif", ...sg(0) }}>IELTS</div>
      {items.map((it, i) => {
        const is = active === it.k;
        return (
          <div key={it.k} onClick={() => setActive(it.k)}
            style={{ padding: '12px 16px', cursor: 'pointer', borderRadius: 6, fontSize: 15, fontWeight: is ? 600 : 400, color: is ? c.accent : c.muted, background: is ? c.accent + '12' : 'transparent', borderLeft: is ? `3px solid ${c.accent}` : '3px solid transparent', transition: 'all .2s', ...sg(i + 1, 70), transform: 'translateX(0)' }}
            onMouseEnter={e => { if (!is) { e.currentTarget.style.background = c.card; e.currentTarget.style.color = c.ink; e.currentTarget.style.transform = 'translateX(3px)'; } }}
            onMouseLeave={e => { if (!is) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.muted; e.currentTarget.style.transform = 'translateX(0)'; } }}
          >{it.l}</div>
        );
      })}
    </nav>
  );
}

function TabPane({ tab, children }: { tab: string; children: React.ReactNode }) {
  const [pt, setPt] = useState(tab); const [f, setF] = useState(false); const [cont, setCont] = useState(children);
  useEffect(() => { if (tab !== pt) { setF(true); setTimeout(() => { setCont(children); setPt(tab); setF(false); }, 140); } }, [tab, pt, children]);
  return <div style={{ opacity: f ? 0 : 1, transform: f ? 'translateY(4px)' : 'translateY(0)', transition: `opacity .2s ${E}, transform .2s ${E}` }}>{cont}</div>;
}

function App() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState('overview');
  const [selDay, setSelDay] = useState('');

  useEffect(() => {
    (async () => {
      try { const r = await fetch('/stats.json'); if (r.ok) { const d = await r.json(); setStats(d); if (d.days?.length) setSelDay(d.days[0].date); return } } catch {/**/}
      setErr('No stats.json');
    })();
  }, []);

  if (err) return <Loading m={err} />;
  if (!stats) return <Loading m="Loading..." />;
  const s = stats;

  const daySessions = s.history?.filter(h => h.date === selDay) || [];
  const idx = s.days?.findIndex(d => d.date === selDay) ?? -1;
  const readSes = daySessions.find(s => s.type === 'reading');
  const writeSes = daySessions.find(s => s.type === 'writing');
  const listenSes = daySessions.find(s => s.type === 'listening');
  const wr = writeSes?.dimensions ? Object.entries(writeSes.dimensions).map(([k, v]) => ({ d: k.toUpperCase(), v })) : [];
  const subjBands = [
    { subject: 'Writing', band: writeSes?.overall || 0 }, { subject: 'Reading', band: readSes ? +(readSes.correctCount! / readSes.totalQuestions! * 9).toFixed(1) : 0 },
    { subject: 'Listening', band: listenSes ? +(listenSes.correctCount! / listenSes.totalQuestions! * 9).toFixed(1) : 0 },
  ];
  const allErr: { n: string; c: number }[] = [];
  readSes?.errors?.forEach(e => { const t = e.type || 'error'; const ex = allErr.find(x => x.n === '📖 ' + t); if (ex) ex.c++; else allErr.push({ n: '📖 ' + t, c: 1 }); });
  writeSes?.errors?.slice(0, 6).forEach(e => { const t = e.type || 'error'; const ex = allErr.find(x => x.n === '✏️ ' + t); if (ex) ex.c++; else allErr.push({ n: '✏️ ' + t, c: 1 }); });
  listenSes?.errors?.forEach(e => { const t = e.type || 'error'; const ex = allErr.find(x => x.n === '🎧 ' + t); if (ex) ex.c++; else allErr.push({ n: '🎧 ' + t, c: 1 }); });

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={sg(0)}>
        <h1 style={{ fontSize: 36, fontWeight: 500, margin: 0, fontFamily: "'Fraunces',Georgia,serif", letterSpacing: -1, color: c.ink, lineHeight: 1.1 }}>Training Dashboard</h1>
        <p style={{ fontSize: 15, color: c.muted, margin: '8px 0 0' }}>{s.combined.totalStudyDays} days · {s.combined.totalSessions} sessions</p>
        <div style={{ width: 60, height: 3, background: c.accent, marginTop: 12, borderRadius: 2 }} />
      </div>
      {/* Date nav */}
      {s.days?.length > 0 && (
        <div style={sg(1)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <button onClick={() => idx > 0 && setSelDay(s.days[idx - 1].date)} disabled={idx <= 0} style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 4, padding: '6px 14px', cursor: idx > 0 ? 'pointer' : 'default', fontSize: 16, opacity: idx > 0 ? 1 : .3, transition: 'all .15s' }}
              onMouseEnter={e => { if (idx > 0) { e.currentTarget.style.background = c.accent; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = c.accent; } }}
              onMouseLeave={e => { if (idx > 0) { e.currentTarget.style.background = c.card; e.currentTarget.style.color = c.ink; e.currentTarget.style.borderColor = c.line; } }}
            >←</button>
            <span style={{ flex: 1, textAlign: 'center', fontFamily: "'Fraunces',Georgia,serif", fontSize: 18 }}>{selDay}</span>
            <button onClick={() => idx < s.days.length - 1 && setSelDay(s.days[idx + 1].date)} disabled={idx >= s.days.length - 1} style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 4, padding: '6px 14px', cursor: idx < s.days.length - 1 ? 'pointer' : 'default', fontSize: 16, opacity: idx < s.days.length - 1 ? 1 : .3, transition: 'all .15s' }}
              onMouseEnter={e => { if (idx < s.days.length - 1) { e.currentTarget.style.background = c.accent; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = c.accent; } }}
              onMouseLeave={e => { if (idx < s.days.length - 1) { e.currentTarget.style.background = c.card; e.currentTarget.style.color = c.ink; e.currentTarget.style.borderColor = c.line; } }}
            >→</button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {s.days.map(d => (
              <div key={d.date} onClick={() => setSelDay(d.date)} style={{ padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 13, background: d.date === selDay ? c.accent : c.card, color: d.date === selDay ? '#fff' : c.ink, border: `1px solid ${d.date === selDay ? c.accent : c.line}`, transition: 'all .2s, transform .15s' }}
                onMouseEnter={e => { if (d.date !== selDay) { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.background = c.accent + '0a'; } }}
                onMouseLeave={e => { if (d.date !== selDay) { e.currentTarget.style.borderColor = c.line; e.currentTarget.style.background = c.card; } }}
              >{fmt(d.date)} <span style={{ opacity: .6 }}>({d.sessions})</span></div>
            ))}
          </div>
        </div>
      )}
      {/* Scoreboard */}
      {daySessions.length > 0 && (
        <div style={{ background: '#fef7e0', borderRadius: 2, padding: 16, transform: 'rotate(-.3deg)', boxShadow: '2px 3px 8px rgba(0,0,0,.05)', ...sg(2) }}>
          <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10, fontFamily: "'Work Sans',sans-serif" }}>Scoreboard</div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {readSes && <div><div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Reading</div><div style={{ fontSize: 44, fontWeight: 600, color: c.blue, fontFamily: "'Fraunces',Georgia,serif", lineHeight: 1, letterSpacing: -1.5 }}>{readSes.correctCount}/{readSes.totalQuestions}</div></div>}
            {writeSes && <div><div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Writing</div><div style={{ fontSize: 44, fontWeight: 600, color: c.green, fontFamily: "'Fraunces',Georgia,serif", lineHeight: 1, letterSpacing: -1.5 }}>{writeSes.overall?.toFixed(1)}</div></div>}
            {listenSes && <div><div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Listening</div><div style={{ fontSize: 44, fontWeight: 600, color: c.accent, fontFamily: "'Fraunces',Georgia,serif", lineHeight: 1, letterSpacing: -1.5 }}>{listenSes.correctCount}/{listenSes.totalQuestions}</div></div>}
          </div>
          {s.combined.daysUntilExam > 0 && <div style={{ borderTop: `1px dashed ${c.line}`, marginTop: 10, paddingTop: 10, fontSize: 12, color: c.accent }}>{s.combined.daysUntilExam} days to exam · Target Band {s.combined.targetBand}</div>}
        </div>
      )}
      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, ...sg(3) }}>
        <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14 }}>
          <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Subject Bands</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={subjBands} margin={{ top: 5, right: 10, bottom: 0, left: -8 }}>
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: c.muted }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 9]} tick={{ fontSize: 11, fill: c.muted }} axisLine={false} tickLine={false} />
              <Bar dataKey="band" radius={[2, 2, 0, 0]} maxBarSize={44}>
                {subjBands.map((_, i) => <Cell key={i} fill={[c.green, c.blue, c.accent][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14 }}>
          <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Writing Dimensions</div>
          {wr.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={wr}>
                <PolarGrid stroke={c.line} />
                <PolarAngleAxis dataKey="d" tick={{ fontSize: 11, fill: c.muted }} />
                <Radar dataKey="v" stroke={c.accent} fill={c.accent} fillOpacity={0.06} strokeWidth={2} animationDuration={600} />
              </RadarChart>
            </ResponsiveContainer>
          ) : <div style={{ color: c.muted, fontSize: 12 }}>No data</div>}
        </div>
      </div>
      {/* Error distribution chart */}
      {allErr.length > 0 && (
        <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, ...sg(4) }}>
          <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Error Distribution</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={allErr} layout="vertical" margin={{ left: 80, right: 20, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: c.muted }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="n" tick={{ fontSize: 11, fill: c.muted }} width={80} axisLine={false} tickLine={false} />
              <Bar dataKey="c" radius={[0, 2, 2, 0]} maxBarSize={14}>
                {allErr.map((_, i) => <Cell key={i} fill={pieC[i % pieC.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      {/* Today's tasks */}
      {s.todaySession?.tasks && (
        <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, ...sg(4) }}>
          <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Plan — {s.todaySession.tasksCompleted} done, {s.todaySession.tasksPending} pending</div>
          {s.todaySession.tasks.map((t, i) => {
            const icon = { reading: '📖', writing: '✏️', listening: '🎧', speaking: '🗣️', vocab: '📝' }[t.module] || '•';
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < s.todaySession.tasks.length - 1 ? `1px dashed ${c.line}` : 'none', fontSize: 13, transition: 'padding-left .15s' }}
                onMouseEnter={e => e.currentTarget.style.paddingLeft = '6px'}
                onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}
              >
                <span style={{ color: t.status === 'skipped' ? c.muted : c.ink }}>
                  {icon} {t.name}
                  {t.time && <span style={{ color: c.muted, fontSize: 11, marginLeft: 6 }}>{t.time}</span>}
                </span>
                <span style={{
                  fontWeight: 600, fontSize: 12,
                  background: t.status === 'done' ? c.green + '18' : t.status === 'skipped' ? c.muted + '18' : c.gold + '18',
                  color: t.status === 'done' ? c.green : t.status === 'skipped' ? c.muted : c.gold,
                  padding: '1px 8px', borderRadius: 3,
                }}>
                  {t.status === 'done' ? '✓ Done' : t.status === 'skipped' ? '⏭ Skipped' : '○ Pending'}
                </span>
              </div>
            );
          })}
        </div>
      )}
      {/* Trends */}
      {s.trends && Object.entries(s.trends).filter(([, v]) => v.length > 1).length > 0 && (
        <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, ...sg(5) }}>
          <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Score Trends</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {Object.entries(s.trends).filter(([, v]) => v.length > 1).map(([type, data]) => (
              <div key={type}>
                <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 4 }}>{type}</div>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={data}>
                    <XAxis dataKey="date" tick={{ fontSize: 8, fill: c.muted }} />
                    <YAxis domain={[0, 9]} tick={{ fontSize: 8, fill: c.muted }} />
                    <Line type="monotone" dataKey="band" stroke={type === 'reading' ? c.blue : type === 'writing' ? c.green : c.accent} strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderReading = () => (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 500, fontFamily: "'Fraunces',Georgia,serif", letterSpacing: -.8, marginBottom: 18, ...sg(0) }}>Reading</h1>
      {s.history?.filter(h => h.type === 'reading').length === 0 && <div style={{ color: c.muted }}>No reading sessions yet.</div>}
      {s.history?.filter(h => h.type === 'reading').map((ses, i) => (
        <div key={i} style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, marginBottom: 12, ...sg(i + 1, 60) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 500 }}>{ses.title} <span style={{ color: c.muted, fontSize: 12 }}>· {ses.date}</span></span>
            <span style={{ fontWeight: 600, color: c.green }}>{ses.correctCount}/{ses.totalQuestions}</span>
          </div>
          {ses.answers && (
            <div style={{ fontSize: 12, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ borderBottom: `1px solid ${c.line}`, color: c.muted, fontSize: 11, textTransform: 'uppercase' }}>
                  <th style={{ padding: '3px 6px', textAlign: 'left', width: 28 }}>#</th>
                  <th style={{ padding: '3px 6px', textAlign: 'left' }}>Question</th>
                  <th style={{ padding: '3px 6px', textAlign: 'center', width: 50 }}>Your</th>
                  <th style={{ padding: '3px 6px', textAlign: 'center', width: 60 }}>Correct</th>
                  <th style={{ padding: '3px 6px', textAlign: 'center', width: 50 }}>Type</th>
                  <th style={{ padding: '3px 6px', textAlign: 'left', width: 140 }}>Note</th>
                </tr></thead>
                <tbody>
                  {ses.answers.map(a => (
                    <tr key={a.q} style={{ borderBottom: `1px solid ${c.line}` }}>
                      <td style={{ padding: '3px 6px', fontWeight: 600 }}>{a.q}</td>
                      <td style={{ padding: '3px 6px', color: c.ink, fontSize: 11, maxWidth: 200, lineHeight: 1.3 }}>{(a as any).text || ''}</td>
                      <td style={{ padding: '3px 6px', color: a.result === 'correct' ? c.green : c.accent, textAlign: 'center', fontWeight: 500 }}>{a.user}</td>
                      <td style={{ padding: '3px 6px', color: c.muted, textAlign: 'center' }}>{a.correct}</td>
                      <td style={{ padding: '3px 6px', textAlign: 'center' }}>{a.type ? <span style={{ color: c.accent, fontSize: 11 }}>{a.type.replace(/_/g, ' ')}</span> : <span style={{ color: c.green }}>✓</span>}</td>
                      <td style={{ padding: '3px 6px', color: c.muted, fontSize: 11, maxWidth: 140 }}>{a.result !== 'correct' ? ses.errors?.find((e: any) => e.q === String(a.q))?.detail || '' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {ses.synonyms && ses.synonyms.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 12 }}>
              <div style={{ color: c.muted, fontSize: 11, marginBottom: 4 }}>Synonyms ({ses.synonyms.length})</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '2px 10px' }}>
                {ses.synonyms.map((sp, j) => (<React.Fragment key={j}><span style={{ color: c.accent, fontStyle: 'italic' }}>{sp.from}</span><span style={{ color: c.gold }}>→</span><span style={{ color: c.green }}>{sp.to}</span></React.Fragment>))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderWriting = () => (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 500, fontFamily: "'Fraunces',Georgia,serif", letterSpacing: -.6, marginBottom: 16, ...sg(0) }}>Writing</h1>
      {s.history?.filter(h => h.type === 'writing').length === 0 && <div style={{ color: c.muted }}>No writing sessions yet.</div>}
      {s.history?.filter(h => h.type === 'writing').map((ses, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          {/* Topic */}
          {ses.topic && <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, marginBottom: 10, ...sg(i + 1, 60) }}>
            <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Topic</div>
            <div style={{ fontSize: 13, color: c.ink, fontStyle: 'italic', lineHeight: 1.5 }}>{ses.topic}</div>
          </div>}
          {/* Score + dimensions */}
          <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, marginBottom: 10, ...sg(i + 1, 60) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 500 }}>{ses.date} <span style={{ color: c.muted, fontSize: 12 }}>· {ses.wordCount} words</span></span>
              <span style={{ fontWeight: 600, fontSize: 22, color: c.green, fontFamily: "'Fraunces',Georgia,serif" }}>{ses.overall?.toFixed(1)}</span>
            </div>
            {ses.dimensions && (
              <>
                <div style={{ display: 'flex', gap: 16, fontSize: 14, marginBottom: 10 }}>
                  <span>TR <strong style={{ color: c.green }}>{ses.dimensions.tr}</strong></span>
                  <span>CC <strong style={{ color: c.blue }}>{ses.dimensions.cc}</strong></span>
                  <span>LR <strong style={{ color: c.gold }}>{ses.dimensions.lr}</strong></span>
                  <span style={{ color: ses.dimensions.gra === [ses.dimensions.tr, ses.dimensions.cc, ses.dimensions.lr, ses.dimensions.gra].reduce((a, b) => Math.min(a, b)) ? c.accent : c.ink }}>GRA <strong>{ses.dimensions.gra}</strong></span>
                </div>
                {/* Radar chart */}
                <ResponsiveContainer width="100%" height={160}>
                  <RadarChart data={Object.entries(ses.dimensions).map(([k, v]) => ({ d: k.toUpperCase(), v }))}>
                    <PolarGrid stroke={c.line} />
                    <PolarAngleAxis dataKey="d" tick={{ fontSize: 11, fill: c.muted }} />
                    <Radar dataKey="v" stroke={c.accent} fill={c.accent} fillOpacity={0.06} strokeWidth={2} animationDuration={600} />
                  </RadarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
          {/* Rewrite highlights */}
          {ses.rewriteHighlights && ses.rewriteHighlights.length > 0 && (
            <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, marginBottom: 10, ...sg(i + 2, 60) }}>
              <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Rewrite — Before → After</div>
              <div style={{ fontSize: 12, display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '4px 12px', alignItems: 'center' }}>
                {ses.rewriteHighlights.map((h, j) => (
                  <React.Fragment key={j}>
                    <span style={{ color: c.accent, fontStyle: 'italic' }}>{h.from}</span>
                    <span style={{ color: c.gold }}>→</span>
                    <span style={{ color: c.green }}>{h.to}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          {/* Upgrade priorities */}
          {ses.upgradePriorities && ses.upgradePriorities.length > 0 && (
            <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, marginBottom: 10, ...sg(i + 3, 60) }}>
              <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Priorities</div>
              {ses.upgradePriorities.map((p, j) => (
                <div key={j} style={{ padding: '3px 0', fontSize: 13, color: c.ink, borderBottom: j < ses.upgradePriorities.length - 1 ? `1px solid ${c.line}` : 'none' }}>{p}</div>
              ))}
            </div>
          )}
          {/* Errors */}
          {ses.errors && ses.errors.length > 0 && (
            <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, ...sg(i + 4, 60) }}>
              <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Errors ({ses.errors.length})</div>
              {(() => {
                const groups: Record<string, typeof ses.errors> = {};
                ses.errors.forEach(e => { const t = e.type || 'other'; if (!groups[t]) groups[t] = []; groups[t].push(e); });
                return Object.entries(groups).map(([type, items]) => (
                  <div key={type} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: type.includes('grammar') || type.includes('spelling') ? c.accent : c.gold, marginBottom: 3 }}>
                      {type.toUpperCase()} ({items.length})
                    </div>
                    {items.map((e, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: 6, padding: '2px 0', fontSize: 12, color: c.muted, alignItems: 'flex-start' }}>
                        <span style={{ fontWeight: 500, minWidth: 85, color: c.accent, fontSize: 11 }}>{e.q}</span>
                        {e.severity && <span style={{ fontSize: 11, color: e.severity === 'major' ? c.accent : c.gold }}>{e.severity === 'major' ? '⚡' : '○'}</span>}
                        <span>{e.detail}</span>
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderListening = () => (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 500, fontFamily: "'Fraunces',Georgia,serif", letterSpacing: -.6, marginBottom: 16, ...sg(0) }}>Listening</h1>
      {s.history?.filter(h => h.type === 'listening').length === 0 && <div style={{ color: c.muted }}>No listening sessions yet.</div>}
      {s.history?.filter(h => h.type === 'listening').map((ses, i) => (
        <div key={i} style={{ marginBottom: 18 }}>
          <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, marginBottom: 10, ...sg(i + 1, 60) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{ses.date} <span style={{ color: c.muted, fontSize: 12 }}>· {ses.book ? `${ses.book} Test ${ses.test}` : ''} · {ses.sections}</span></span>
              <span style={{ fontWeight: 600, color: c.accent }}>{ses.correctCount}/{ses.totalQuestions}</span>
            </div>
            {ses.sectionScores && (
              <div style={{ display: 'flex', gap: 20, fontSize: 14, marginBottom: 8 }}>
                <span>Section 1: <strong>{ses.sectionScores.s1}</strong></span>
                <span>Section 2: <strong>{ses.sectionScores.s2}</strong></span>
              </div>
            )}
            {/* Questions table */}
            {ses.questions && ses.questions.length > 0 && (
              <div style={{ fontSize: 12, overflowX: 'auto', marginBottom: 10 }}>
                <div style={{ color: c.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Questions</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: `1px solid ${c.line}`, color: c.muted, fontSize: 11, textTransform: 'uppercase' }}>
                    <th style={{ padding: '3px 6px', textAlign: 'left' }}>#</th>
                    <th style={{ padding: '3px 6px', textAlign: 'left' }}>Question</th>
                    <th style={{ padding: '3px 6px', textAlign: 'left' }}>Options</th>
                    <th style={{ padding: '3px 6px', textAlign: 'left' }}>Your</th>
                    <th style={{ padding: '3px 6px', textAlign: 'left' }}>Correct</th>
                  </tr></thead>
                  <tbody>
                    {ses.questions.map(q => (
                      <tr key={q.q} style={{ borderBottom: `1px solid ${c.line}` }}>
                        <td style={{ padding: '3px 6px', fontWeight: 600 }}>{q.q}</td>
                        <td style={{ padding: '3px 6px', maxWidth: 180, color: c.ink }}>{q.text}</td>
                        <td style={{ padding: '3px 6px', maxWidth: 150, color: c.muted, fontSize: 11 }}>{q.options}</td>
                        <td style={{ padding: '3px 6px', color: q.user === q.correct ? c.green : c.accent, fontWeight: 500 }}>{q.user}</td>
                        <td style={{ padding: '3px 6px', color: c.muted }}>{q.correct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Error pie chart */}
            {ses.errors && ses.errors.length > 0 && (() => {
              const groups: Record<string, number> = {};
              ses.errors.forEach(e => { const t = e.type || 'unknown'; groups[t] = (groups[t] || 0) + 1; });
              const data = Object.entries(groups).map(([k, v]) => ({ name: k, value: v }));
              if (data.length <= 1) return null;
              return (
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} innerRadius={22} animationBegin={200} animationDuration={600} label={({ name, value }) => `${name} ${value}`}>
                      {data.map((_, idx) => <Cell key={idx} fill={[c.accent, c.gold, '#b8860b', c.green, c.blue, '#6b4c3b'][idx % 6]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              );
            })()}
            {/* Errors with full detail */}
            {ses.errors && ses.errors.length > 0 && (
              <div style={{ fontSize: 12, marginTop: 6 }}>
                <div style={{ color: c.accent, fontWeight: 500, marginBottom: 4 }}>Errors ({ses.errors.length})</div>
                {ses.errors.map((e, j) => (
                  <div key={j} style={{ display: 'flex', gap: 6, padding: '3px 0', borderBottom: j < ses.errors.length - 1 ? `1px solid ${c.line}` : 'none', color: c.muted, alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 500, color: c.accent, minWidth: 32, fontSize: 11 }}>Q{e.q}</span>
                    <span style={{ background: c.accent + '12', color: c.accent, padding: '0 5px', borderRadius: 2, fontSize: 11, whiteSpace: 'nowrap' }}>{e.type}</span>
                    <span style={{ minWidth: 70, fontSize: 11, color: e.userAnswer !== e.correctAnswer ? c.accent : c.green }}>你: {e.userAnswer} → 正: {e.correctAnswer}</span>
                    <span style={{ flex: 1 }}>{e.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Archived files */}
          {ses.archivedFiles && ses.archivedFiles.length > 0 && (
            <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, ...sg(i + 2, 60) }}>
              <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Archived Files</div>
              {ses.archivedFiles.map((f, j) => (
                <div key={j} style={{ padding: '3px 0', fontSize: 12, color: c.muted }}>📁 {typeof f === 'string' ? f : JSON.stringify(f)}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderVocab = () => (
    <div>
      <h1 style={{ fontSize: 34, fontWeight: 500, fontFamily: "'Fraunces',Georgia,serif", letterSpacing: -.6, marginBottom: 16, ...sg(0) }}>Vocabulary</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16, ...sg(1) }}>
        {[
          { l: 'Reviewed', v: `${s.vocab?.wordsReviewed || 0}`, cl: c.ink },
          { l: 'New', v: `${s.vocab?.newWords || 0}`, cl: c.green },
          { l: 'Accuracy', v: s.vocab?.accuracy || '—', cl: c.gold },
          { l: 'Word Bank', v: `${s.vocab?.totalWords || 0}`, cl: c.blue },
        ].map((x, i) => (
          <div key={x.l} style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, textAlign: 'center', ...sg(i + 2) }}>
            <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: .8 }}>{x.l}</div>
            <div style={{ fontSize: 26, fontWeight: 600, color: x.cl, fontFamily: "'Fraunces',Georgia,serif", marginTop: 4 }}>{x.v}</div>
          </div>
        ))}
      </div>
      {/* Review history */}
      {s.vocab?.reviewHistory && s.vocab.reviewHistory.length > 0 && (
        <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, marginBottom: 12, ...sg(2) }}>
          <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Review History</div>
          {s.vocab.reviewHistory.map((day, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < s.vocab.reviewHistory.length - 1 ? `1px solid ${c.line}` : 'none', fontSize: 13 }}>
              <span>Day {day.day} <span style={{ color: c.muted, fontSize: 12 }}>{day.date}</span></span>
              <span>{day.reviewed} words · {day.correct} correct · <strong>{day.accuracy}</strong></span>
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 12, color: c.muted }}>Source: {s.vocab.reviewHistory.map(d => d.source).filter(Boolean).join(', ')}</div>
        </div>
      )}
      {/* Word list preview */}
      {s.vocab?.sampleWords && s.vocab.sampleWords.length > 0 && (
        <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, marginBottom: 12, ...sg(3) }}>
          <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Word Bank — Band 6 ({s.vocab.totalWords} words)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {s.vocab.sampleWords.slice(0, 50).map((w, i) => (
              <span key={i} style={{ background: c.accent + '0a', padding: '2px 8px', borderRadius: 2, fontSize: 12, color: c.ink }}>{w}</span>
            ))}
          </div>
        </div>
      )}
      {s.speaking && (
        <div style={{ background: c.card, border: `1px solid ${c.line}`, borderRadius: 3, padding: 14, ...sg(4) }}>
          <div style={{ fontSize: 11, color: c.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>Speaking</div>
          <div style={{ fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><strong>{s.speaking.storiesPrepared}</strong> story · {s.speaking.coverableTopics && <>covers <strong>{s.speaking.coverableTopics}</strong> topics</>}</div>
            <span style={{ background: s.speaking.status === 'pending' ? c.gold + '18' : c.green + '18', color: s.speaking.status === 'pending' ? c.gold : c.green, padding: '3px 10px', borderRadius: 3, fontSize: 12, fontWeight: 600 }}>{s.speaking.status}</span>
          </div>
          {s.speaking.nextTopic && <div style={{ fontSize: 12, color: c.muted, marginTop: 4 }}>Next: {s.speaking.nextTopic}</div>}
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap');
        @keyframes in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        *,:after,:before{box-sizing:border-box;margin:0;padding:0}
        body{margin:0;background:${c.paper}}
        ::selection{background:${c.accent}22}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:${c.paper}}
        ::-webkit-scrollbar-thumb{background:${c.line};border-radius:3px}
        @media(prefers-reduced-motion:reduce){*,:after,:before{animation-duration:.01ms!important;transition-duration:.01ms!important}}
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', color: c.ink, fontFamily: "'Work Sans',system-ui,sans-serif", fontSize: 15, lineHeight: 1.6 }}>
        <Nav active={tab} setActive={setTab} />
        <main style={{ flex: 1, padding: 32, overflow: 'auto', maxWidth: 960 }}>
          <TabPane tab={tab}>
            {tab === 'overview' && renderOverview()}
            {tab === 'reading' && renderReading()}
            {tab === 'writing' && renderWriting()}
            {tab === 'listening' && renderListening()}
            {tab === 'vocab' && renderVocab()}
          </TabPane>
        </main>
      </div>
    </>
  );
}

function Loading({ m }: { m: string }) {
  return <div style={{ padding: 40, color: c.ink, background: c.paper, fontFamily: "'Work Sans',sans-serif" }}>{m}</div>;
}

export default App;
