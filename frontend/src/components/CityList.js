import React, {useState} from 'react';
import './CityList.css';

function CityCard({c}){
  const [showServices, setShowServices] = useState(false);
  return (
    <div className="city-card">
      <h3>
        {c.name}
        <small>{c.population?.toLocaleString() || 'N/A'} residents</small>
      </h3>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <p style={{margin:0}}><strong>Amenities:</strong></p>
          <div className="tag-list" style={{marginTop:8}}>
            {c.amenities?.map(amenity => (
              <span key={amenity} className="tag amenity">{amenity}</span>
            )) || '—'}
          </div>
        </div>
        <div>
          <button className="btn secondary" onClick={()=>setShowServices(s=>!s)}>{showServices? 'Hide Services' : 'Show Services'}</button>
        </div>
      </div>

      {showServices && (
        <div className="services-panel" style={{marginTop:12}}>
          <h4 style={{margin:'6px 0'}}>Services</h4>
          <ul>
            {c.services?.map(s=> <li key={s}>{s}</li> )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function CityList({cities}){
  if(!cities || cities.length===0) return <div className="loading">No cities found.</div>;
  return (
    <div className="city-list">
      {cities.map(c=> <CityCard key={c.id} c={c} />)}
    </div>
  );
}
