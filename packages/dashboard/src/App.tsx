import React, { useEffect, useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

/* 🔷 Types */
interface TopError { category: string; count: number; }
interface Answer { q: number; user: string; correct: string; result: string; type?: string; note?: string; }
interface SynPair { from: string; to: string; }
interface WError { q: string; type: string; detail: string; }
interface WHighlight { from: string; to: string; }
interface VWord { word: string; status: string; meaning: string; }
interface LDetail { section: number; title: string; type: string; score: string; answers: Answer[]; }
interface Task { name: string; status: string; result: string; }

interface Stats {
  version: string; lastSnapshot: string;
  combined: { overallBand: number; daysUntilExam: number; targetBand: number; examDates: string[] };
  writing?: { totalEssays: number; averageBand: number; dimensions: any; topErrors?: TopError[]; recentTopics?: string[]; detail?: any; };
  reading?: { totalPassages: number; averageBand: number; accuracy?: string; topErrors?: TopError[]; recentPassages?: any[]; detail?: any; };
  listening?: { totalSections: number; averageBand: number; accuracy?: string; topErrors?: TopError[]; recentSessions?: any[]; detail?: LDetail[]; };
  vocab?: { wordsReviewed: number; newWords: number; accuracy: string; retention?: string; weakWords?: string[]; detail?: VWord[]; };
  speaking?: { storiesPrepared: number; status: string; nextTopic?: string; storyTitle?: string; coverableTopics?: number; };
  todaySession?: { date: string; duration: string; tasksCompleted: number; tasksPending: number; tasks: Task[]; };
}

const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
const ERR_COLORS = ['#e74c3c', '#e67e22', '#f39c12', '#2ecc71', '#3498db', '#9b59b6'];

/* 🔷 Components */
function Badge({ label, color }: { label: string; color: string }) {
  return <span style={{ background: color + '18', color, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{label}</span>;
}

function Collapsible({ title, children, open: defOpen = true }: { title: string; children: React.ReactNode; open?: boolean }) {
  const [o, setO] = useState(defOpen);
  return (
    <div style={{ border: '1px solid #e8e8e8', borderRadius: 10, marginBottom: 12, background: '#fff', overflow: 'hidden' }}>
      <div onClick={() => setO(!o)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none' }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
        <span style={{ fontSize: 10, color: '#bbb', transform: o ? 'rotate(180deg)' : '' }}>▼</span>
      </div>
      {o && <div style={{ padding: '0 16px 16px' }}>{children}</div>}
    </div>
  );
}

function AnswerTable({ answers }: { answers: Answer[] }) {
  return (
    <div style={{ fontSize: 12, overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', color: '#999' }}>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>#</th>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>Your</th>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>Correct</th>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>Result</th>
            <th style={{ textAlign: 'left', padding: '4px 8px' }}>Note</th>
          </tr>
        </thead>
        <tbody>
          {answers.map(a => (
            <tr key={a.q} style={{ borderBottom: '1px solid #f5f5f5' }}>
              <td style={{ padding: '4px 8px', fontWeight: 600 }}>{a.q}</td>
              <td style={{ padding: '4px 8px', color: a.result === 'correct' ? '#2ecc71' : '#e74c3c' }}>{a.user}</td>
              <td style={{ padding: '4px 8px' }}>{a.correct}</td>
              <td style={{ padding: '4px 8px' }}>
                {a.result === 'correct' ? <Badge label="✓" color="#2ecc71" /> : <Badge label="✗" color="#e74c3c" />}
                {a.type && <span style={{ marginLeft: 4, fontSize: 10, color: '#999' }}>{a.type.replace(/_/g, ' ')}</span>}
              </td>
              <td style={{ padding: '4px 8px', color: '#888', fontSize: 11, maxWidth: 200 }}>{a.note || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* 🔷 Main App */
function App() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/stats.json');
        if (r.ok) { setStats(await r.json()); return; }
      } catch { /* */ }
      setError('No stats.json');
    })();
  }, []);

  if (error) return <div style={{ padding: 40, fontFamily: 'monospace' }}>{error}</div>;
  if (!stats) return <div style={{ padding: 40, fontFamily: 'monospace' }}>Loading...</div>;

  const s = stats;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'reading', label: `Reading (${s.reading?.accuracy || '—'})` },
    { key: 'writing', label: `Writing (${s.writing?.averageBand.toFixed(1) || '—'})` },
    { key: 'listening', label: `Listening (${s.listening?.accuracy || '—'})` },
    { key: 'vocab', label: `Vocab (${s.vocab?.accuracy || '—'})` },
  ];

  const subjectBands = [
    { subject: 'Writing', band: s.writing?.averageBand || 0, target: s.combined.targetBand },
    { subject: 'Reading', band: s.reading?.averageBand || 0, target: s.combined.targetBand },
    { subject: 'Listening', band: s.listening?.averageBand || 0, target: s.combined.targetBand },
  ];

  const writingRadar = s.writing?.dimensions
    ? Object.entries(s.writing.dimensions).map(([k, v]) => ({ dimension: k.toUpperCase(), score: v, max: 9 }))
    : [];

  // Aggregate error chart data
  const allErr: { name: string; count: number }[] = [];
  s.reading?.topErrors?.forEach(e => allErr.push({ name: `📖 ${e.category}`, count: e.count }));
  s.writing?.topErrors?.forEach(e => allErr.push({ name: `✏️ ${e.category}`, count: e.count }));
  s.listening?.topErrors?.forEach(e => allErr.push({ name: `🎧 ${e.category}`, count: e.count }));

  return (
    <div style={{ fontFamily: "'Inter','SF Pro',system-ui,sans-serif", background: '#f5f6f8', minHeight: '100vh', color: '#222' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', color: '#fff', padding: '20px 32px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>IELTS Dashboard</div>
            <div style={{ fontSize: 11, opacity: .6, marginTop: 2 }}>{new Date(s.lastSnapshot).toLocaleDateString('zh-CN')}</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,.1)', borderRadius: 20, padding: '4px 14px', fontSize: 12 }}>
              🎯 Target Band {s.combined.targetBand}
            </div>
            <div style={{
              background: s.combined.daysUntilExam <= 7 ? 'rgba(231,76,60,.25)' : 'rgba(46,204,113,.2)',
              borderRadius: 20, padding: '4px 14px', fontSize: 12,
              color: s.combined.daysUntilExam <= 7 ? '#e74c3c' : '#2ecc71'
            }}>
              ⏰ {s.combined.daysUntilExam} days to exam
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 32px', display: 'flex', gap: 0, borderBottom: '1px solid #e0e0e0', background: '#fff' }}>
        {tabs.map(t => (
          <div key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '14px 18px', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: tab === t.key ? '#1a1a2e' : '#999',
            borderBottom: tab === t.key ? '2px solid #1a1a2e' : '2px solid transparent', transition: 'all .15s'
          }}>{t.label}</div>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: 24 }}>

        {/* === OVERVIEW === */}
        {tab === 'overview' && (
          <>
            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Current Band', value: s.combined.overallBand.toFixed(1), sub: `of ${s.combined.targetBand}`, color: '#3498db' },
                { label: 'Writing', value: s.writing?.averageBand.toFixed(1) || '—', sub: `${s.writing?.totalEssays} essay`, color: '#2ecc71' },
                { label: 'Reading', value: s.reading?.averageBand.toFixed(1) || '—', sub: s.reading?.accuracy, color: '#9b59b6' },
                { label: 'Listening', value: s.listening?.averageBand.toFixed(1) || '—', sub: s.listening?.accuracy, color: '#e74c3c' },
              ].map(c => (
                <div key={c.label} style={{ background: '#fff', borderRadius: 10, padding: 16, border: '1px solid #eee' }}>
                  <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: .5 }}>{c.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: c.color, margin: '4px 0' }}>{c.value}</div>
                  <div style={{ fontSize: 12, color: '#bbb' }}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Subject comparison chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <Collapsible title="Subject Band Comparison">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={subjectBands} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="subject" tick={{ fontSize: 12, fill: '#555' }} />
                    <YAxis domain={[0, 9]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="band" radius={[4, 4, 0, 0]}>
                      {subjectBands.map((_, i) => <Cell key={i} fill={['#2ecc71', '#9b59b6', '#e74c3c'][i]} />)}
                    </Bar>
                    <Bar dataKey="target" radius={[4, 4, 0, 0]} fill="#ddd" />
                  </BarChart>
                </ResponsiveContainer>
              </Collapsible>

              <Collapsible title="Writing Dimensions (Radar)">
                {writingRadar.length > 0 && (
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={writingRadar}>
                      <PolarGrid stroke="#e0e0e0" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#555' }} />
                      <PolarRadiusAxis domain={[0, 9]} tick={false} axisLine={false} />
                      <Radar dataKey="score" stroke="#2ecc71" fill="#2ecc71" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </Collapsible>
            </div>

            {/* Error distribution */}
            <Collapsible title="Error Distribution Across All Subjects">
              {allErr.length > 0 && (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={allErr} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#555' }} width={110} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {allErr.map((_, i) => <Cell key={i} fill={ERR_COLORS[i % ERR_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Collapsible>

            {/* Today's tasks */}
            <Collapsible title="Today's Session" open={true}>
              <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
                <div><span style={{ fontSize: 22, fontWeight: 700, color: '#2ecc71' }}>{s.todaySession?.tasksCompleted}</span><span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>done</span></div>
                <div><span style={{ fontSize: 22, fontWeight: 700, color: '#f39c12' }}>{s.todaySession?.tasksPending}</span><span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>pending</span></div>
                <div><span style={{ fontSize: 22, fontWeight: 700, color: '#3498db' }}>{s.todaySession?.duration}</span><span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>duration</span></div>
              </div>
              {s.todaySession?.tasks.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: { done: '#2ecc71', skipped: '#f39c12', pending: '#e74c3c' } [t.status] || '#ccc', display: 'inline-block' }} />
                    <span style={{ color: t.status === 'skipped' ? '#999' : '#333' }}>{t.name}</span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 12, color: t.status === 'done' ? '#2ecc71' : '#f39c12' }}>{t.result}</span>
                </div>
              ))}
            </Collapsible>

            {/* Exam timeline */}
            <Collapsible title="Exam Timeline">
              <div style={{ display: 'flex', gap: 12 }}>
                {s.combined.examDates.map((d, i) => {
                  const days = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  return (
                    <div key={i} style={{ flex: 1, padding: 12, borderRadius: 8, textAlign: 'center',
                      background: i === 0 ? '#fff3cd' : '#f8f9fa', border: i === 0 ? '2px solid #f39c12' : '1px solid #eee' }}>
                      <div style={{ fontSize: 10, color: '#999' }}>Attempt {i + 1}</div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{d}</div>
                      <div style={{ fontSize: 11, color: i === 0 ? '#e67e22' : '#999' }}>{days > 0 ? `${days}d left` : 'passed'}</div>
                    </div>
                  );
                })}
              </div>
            </Collapsible>
          </>
        )}

        {/* === READING DETAIL === */}
        {tab === 'reading' && s.reading?.detail && (
          <>
            <div style={{ background: '#fff', borderRadius: 10, padding: 20, marginBottom: 16, border: '1px solid #eee' }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{s.reading.detail.title}</div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>
                {s.reading.detail.questionTypes} · ⏱ {s.reading.detail.timeSpent} · Score: {s.reading.accuracy}
              </div>
              <AnswerTable answers={s.reading.detail.answers} />
            </div>

            <Collapsible title="📖 同义替换词表" open={true}>
              <div style={{ fontSize: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: '2px solid #eee', color: '#999' }}>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>原文用词</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>→</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>题目用词</th>
                  </tr></thead>
                  <tbody>
                    {s.reading.detail.synonyms?.map((sp, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '4px 8px', fontWeight: 600 }}>{sp.from}</td>
                        <td style={{ padding: '4px 8px', textAlign: 'center', color: '#3498db' }}>→</td>
                        <td style={{ padding: '4px 8px' }}>{sp.to}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Collapsible>
          </>
        )}

        {/* === WRITING DETAIL === */}
        {tab === 'writing' && s.writing?.detail && (
          <>
            <div style={{ background: '#fff', borderRadius: 10, padding: 20, marginBottom: 16, border: '1px solid #eee' }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{s.writing.detail.topic}</div>
              <div style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Word count: {s.writing.detail.wordCount} · Band {s.writing.averageBand}</div>
              {writingRadar.length > 0 && (
                <ResponsiveContainer width="100%" height={160}>
                  <RadarChart data={writingRadar}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#555' }} />
                    <PolarRadiusAxis domain={[0, 9]} tick={false} axisLine={false} />
                    <Radar dataKey="score" stroke="#2ecc71" fill="#2ecc71" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>

            <Collapsible title="✏️ 逐句错误" open={true}>
              <div style={{ fontSize: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: '2px solid #eee', color: '#999' }}>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>位置</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>类型</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>详情</th>
                  </tr></thead>
                  <tbody>
                    {s.writing.detail.errors?.map((e, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '4px 8px', fontWeight: 600 }}>{e.q}</td>
                        <td style={{ padding: '4px 8px' }}><Badge label={e.type} color={e.type === 'grammar' ? '#e74c3c' : '#f39c12'} /></td>
                        <td style={{ padding: '4px 8px', color: '#666' }}>{e.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Collapsible>

            <Collapsible title="🔄 改写对比 (5.0 → 6.0)">
              <div style={{ fontSize: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: '2px solid #eee', color: '#999' }}>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>原句用词</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>→</th>
                    <th style={{ textAlign: 'left', padding: '4px 8px' }}>升级版本</th>
                  </tr></thead>
                  <tbody>
                    {s.writing.detail.rewriteHighlights?.map((h, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                        <td style={{ padding: '4px 8px', color: '#e74c3c', fontStyle: 'italic' }}>{h.from}</td>
                        <td style={{ padding: '4px 8px', textAlign: 'center', color: '#3498db' }}>→</td>
                        <td style={{ padding: '4px 8px', color: '#2ecc71', fontWeight: 600 }}>{h.to}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Collapsible>

            <Collapsible title="🎯 提分优先级">
              <ul style={{ fontSize: 13, lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
                {s.writing.detail.upgradePriorities?.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </Collapsible>
          </>
        )}

        {/* === LISTENING DETAIL === */}
        {tab === 'listening' && s.listening?.detail && (
          <>
            {s.listening.detail.map((sec, si) => (
              <div key={si} style={{ background: '#fff', borderRadius: 10, padding: 20, marginBottom: 16, border: '1px solid #eee' }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Section {sec.section}: {sec.title}</div>
                <div style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>{sec.type} · Score: {sec.score}</div>
                <AnswerTable answers={sec.answers} />
              </div>
            ))}

            {/* Error pie chart */}
            {s.listening.topErrors && (
              <Collapsible title="🎧 听力错因分布">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={s.listening.topErrors} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={70} label={({ category, count }) => `${category.replace(/_/g, ' ')} ${count}`}>
                      {s.listening.topErrors.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Collapsible>
            )}
          </>
        )}

        {/* === VOCAB DETAIL === */}
        {tab === 'vocab' && s.vocab && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Reviewed', value: s.vocab.wordsReviewed, color: '#3498db' },
                { label: 'New', value: s.vocab.newWords, color: '#2ecc71' },
                { label: 'Correct', value: s.vocab.accuracy, color: '#f39c12' },
                { label: 'Retention', value: s.vocab.retention || '—', color: '#9b59b6' },
              ].map(c => (
                <div key={c.label} style={{ background: '#fff', borderRadius: 10, padding: 16, border: '1px solid #eee', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#999' }}>{c.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: c.color }}>{c.value}</div>
                </div>
              ))}
            </div>

            {s.vocab.detail && (
              <Collapsible title="📝 词汇详情" open={true}>
                <div style={{ fontSize: 12 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ borderBottom: '2px solid #eee', color: '#999' }}>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>单词</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>释义</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px' }}>掌握</th>
                    </tr></thead>
                    <tbody>
                      {s.vocab.detail.map((w, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '4px 8px', fontWeight: 600 }}>{w.word}</td>
                          <td style={{ padding: '4px 8px', color: '#666' }}>{w.meaning}</td>
                          <td style={{ padding: '4px 8px' }}>
                            <Badge label={w.status} color={w.status === 'weak' ? '#e74c3c' : '#2ecc71'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Collapsible>
            )}

            {s.speaking && (
              <Collapsible title="🗣️ Speaking Preparation">
                <div style={{ fontSize: 13 }}>
                  <div>Stories: <strong>{s.speaking.storiesPrepared}</strong></div>
                  <div>Coverable topics: <strong>{s.speaking.coverableTopics}</strong></div>
                  <div>Next: <span style={{ color: '#666' }}>{s.speaking.nextTopic}</span></div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ background: '#fff3cd', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                      {s.speaking.status === 'pending' ? '⏳ Pending — practice tomorrow' : '✅ Ready'}
                    </span>
                  </div>
                </div>
              </Collapsible>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
