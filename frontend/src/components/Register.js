import React, {useState} from 'react';
import {registerUser} from '../services/api';

export default function Register({onRegistered}){
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  async function submit(e){
    e.preventDefault(); setError('');
    try{
      await registerUser({username,password});
      onRegistered && onRegistered();
      alert('Registered — you can now login');
    }catch(err){ setError(err.message || 'Registration failed'); }
  }
  return ( 
    <form className="form" onSubmit={submit} style={{maxWidth:420, margin:'0 auto'}}>
      <h3>Register</h3>
      <div style={{marginTop:8}}> 
        <label>Username</label>
        <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      </div>
      <div style={{marginTop:8}}>
        <label>Password</label>
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      {error && <div style={{color:'red',marginTop:8}}>{error}</div>}
      <div style={{marginTop:12}}>
        <button className="btn" type="submit">Register</button>
      </div>
    </form>
  );
}
