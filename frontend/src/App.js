import React, {useEffect, useState} from 'react';
import CityList from './components/CityList';
import ReportForm from './components/ReportForm';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import {getCities, submitReport} from './services/api';
import './App.css';

export default function App(){
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('login'); // home|login|register|admin
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);
  
  useEffect(()=> {
    getCities().then(setCities).catch(err => console.error(err)).finally(()=>setLoading(false));
  }, []);

  useEffect(()=>{
    try{
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }catch(e){/* ignore */}
  },[theme]);

  // if we have a saved token, go to home on load
  useEffect(()=>{
    if(token){ setPage('home'); }
  },[]);
  
  async function handleReport(data){
    await submitReport(data);
    alert('Report submitted — thank you!');
  }
  
  function handleLogin(t, r){
    setToken(t); setRole(r);
    try{ localStorage.setItem('token', t); localStorage.setItem('role', r); }catch(e){}
    setPage('home');
  }
  function handleLogout(){
    setToken(null); setRole(null);
    try{ localStorage.removeItem('token'); localStorage.removeItem('role'); }catch(e){}
    setPage('login');
  }

  // prevent unauthenticated access to Home
  useEffect(()=>{
    if(page==='home' && !token){
      setPage('login');
    }
  },[page, token]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Smart City Explorer</h1>
        <p className="app-subtitle">Discover and explore our connected cities</p>
        <div style={{marginTop:12}}>
          <button className="btn secondary" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} style={{marginRight:8}}>{theme==='dark' ? 'Light Mode' : 'Dark Mode'}</button>
          <button className="btn" onClick={()=>setPage('home')} style={{marginRight:8}}>Home</button>
          {!token && <button className="btn secondary" onClick={()=>setPage('login')} style={{marginRight:8}}>Login</button>}
          {!token && <button className="btn" onClick={()=>setPage('register')} style={{marginRight:8}}>Register</button>}
          {role==='admin' && <button className="btn secondary" onClick={()=>setPage('admin')} style={{marginRight:8}}>Admin</button>}
          {token && <button className="btn" onClick={handleLogout}>Logout</button>}
        </div>
      </header>

      {page==='home' && (
        <>
          <ReportForm onSubmit={handleReport}/>
          <hr/>
          <h2 className="section-title">City Directory</h2>
          {loading ? (
            <div className="loading">Loading cities...</div>
          ) : (
            <CityList cities={cities} />
          )}
        </>
      )}

      {page==='login' && <Login onLogin={handleLogin} />}
      {page==='register' && <Register onRegistered={()=>setPage('login')} />}
      {page==='admin' && role==='admin' && <AdminDashboard token={token} />}
      <footer className="app-footer center" style={{marginTop:40}}>
        © 2025 Smart City — All rights reserved.
      </footer>
    </div>
  );
}
