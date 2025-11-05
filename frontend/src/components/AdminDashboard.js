import React, {useState} from 'react';
import {addCity} from '../services/api';

export default function AdminDashboard({token}){
  const [name,setName]=useState('');
  const [population,setPopulation]=useState('');
  const [services,setServices]=useState('');
  const [amenities,setAmenities]=useState('');
  const [msg,setMsg]=useState('');

  async function submit(e){
    e.preventDefault(); setMsg('');
    try{
      const payload = {
        name,
        population: parseInt(population||0,10),
        services: services.split(',').map(s=>s.trim()).filter(Boolean),
        amenities: amenities.split(',').map(a=>a.trim()).filter(Boolean)
      };
      const res = await addCity(payload, token);
      setMsg(`Added city ${res.name}`);
      setName(''); setPopulation(''); setServices(''); setAmenities('');
    }catch(err){ setMsg(err.message || 'Failed'); }
  }

  return (
    <div style={{maxWidth:700, margin:'0 auto'}}>
      <h3>Admin Dashboard</h3>
      <form className="form" onSubmit={submit}>
        <div style={{marginTop:8}}>
          <label>City name</label>
          <input className="input" placeholder="City name" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div style={{marginTop:8}}>
          <label>Population</label>
          <input className="input" placeholder="Population" value={population} onChange={e=>setPopulation(e.target.value)} />
        </div>
        <div style={{marginTop:8}}>
          <label>Services (comma separated)</label>
          <input className="input" placeholder="Services (comma separated)" value={services} onChange={e=>setServices(e.target.value)} />
        </div>
        <div style={{marginTop:8}}>
          <label>Amenities (comma separated)</label>
          <input className="input" placeholder="Amenities (comma separated)" value={amenities} onChange={e=>setAmenities(e.target.value)} />
        </div>
        <div style={{marginTop:12}}>
          <button className="btn" style={{marginRight:8}}>Add City</button>
        </div>
      </form>
      {msg && <div style={{marginTop:12}}>{msg}</div>}
    </div>
  );
}
