const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function getCities(){
  const res = await fetch(`${API_BASE}/api/cities`);
  if(!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}

export async function submitReport(payload){
  const res = await fetch(`${API_BASE}/api/reports`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!res.ok) throw new Error('Failed to submit report');
  return res.json();
}

export async function registerUser(payload){
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
  });
  if(!res.ok) throw new Error('Failed to register');
  return res.json();
}

export async function loginUser(payload){
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
  });
  if(!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function addCity(payload, token){
  const res = await fetch(`${API_BASE}/api/admin/add-city`, {
    method: 'POST', headers: {'Content-Type':'application/json', 'Authorization': `Bearer ${token}`}, body: JSON.stringify(payload)
  });
  if(!res.ok) throw new Error('Failed to add city');
  return res.json();
}
