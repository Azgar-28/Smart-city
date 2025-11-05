import React, {useState} from 'react';

export default function ReportForm({onSubmit}){
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [issue, setIssue] = useState('');
  return (
    <form className="form" onSubmit={(e)=>{ e.preventDefault(); onSubmit({reporter:name, city, issue}); setName(''); setCity(''); setIssue(''); }}>
      <h2>Report an Issue</h2>
      <div>
        <label>Name</label>
        <input className="input" value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <div style={{marginTop:10}}>
        <label>City</label>
        <input className="input" value={city} onChange={e=>setCity(e.target.value)} />
      </div>
      <div style={{marginTop:10}}>
        <label>Issue</label>
        <textarea className="input" value={issue} onChange={e=>setIssue(e.target.value)} rows={3}/>
      </div>
      <div style={{marginTop:12}}>
        <button className="btn" type="submit">Submit Report</button>
      </div>
    </form>
  );
}
