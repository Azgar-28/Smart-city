import React from 'react';

export default function ReportsList({reports}){
  if(!reports || reports.length===0) return <div className="loading">No reports yet.</div>;
  return (
    <div style={{marginTop:20}}>
      <h3>Recent Reports</h3>
      <div style={{display:'grid',gap:12}}>
        {reports.map(r=> (
          <div key={r.id} style={{background:'var(--panel-bg)', padding:12, borderRadius:8, boxShadow:'0 4px 10px rgba(2,6,23,0.04)'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <strong>{r.city}</strong>
              <small style={{color:'var(--muted)'}}>{new Date(r.createdAt).toLocaleString()}</small>
            </div>
            <div style={{marginTop:8}}>{r.issue}</div>
            <div style={{marginTop:8, color:'var(--muted)'}}>Reporter: {r.reporter}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
