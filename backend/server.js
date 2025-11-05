const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// simple request logger to make incoming requests visible in the server log
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

const DB_FILE = path.join(__dirname, 'data', 'db.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

function readUsers(){
  try{ const raw = fs.readFileSync(USERS_FILE,'utf-8'); return JSON.parse(raw); }catch(e){ return []; }
}
function writeUsers(data){ fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2)); }

function readDB(){
  const raw = fs.readFileSync(DB_FILE,'utf-8');
  return JSON.parse(raw);
}
function writeDB(data){
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/cities', (req, res)=> {
  const db = readDB();
  res.json(db.cities);
});

app.get('/api/cities/:id', (req, res)=> {
  const db = readDB();
  const c = db.cities.find(x=>x.id===req.params.id);
  if(!c) return res.status(404).json({error:'Not found'});
  res.json(c);
});

app.post('/api/reports', (req, res)=> {
  const db = readDB();
  const payload = req.body || {};
  const report = {
    id: nanoid(8),
    reporter: payload.reporter || 'anonymous',
    city: payload.city || 'unknown',
    issue: payload.issue || '',
    createdAt: new Date().toISOString()
  };
  db.reports.push(report);
  writeDB(db);
  res.status(201).json(report);
});

// Simple auth: register and login (development/demo only; passwords stored in plain text)
app.post('/api/auth/register', (req, res)=>{
  const payload = req.body || {};
  if(!payload.username || !payload.password) return res.status(400).json({error:'username and password required'});
  const users = readUsers();
  if(users.find(u=>u.username===payload.username)) return res.status(409).json({error:'user exists'});
  const newUser = {
    id: nanoid(8),
    username: payload.username,
    password: payload.password,
    role: payload.username==='admin' ? 'admin' : 'user'
  };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json({id:newUser.id, username:newUser.username, role:newUser.role});
});

app.post('/api/auth/login', (req, res)=>{
  const payload = req.body || {};
  if(!payload.username || !payload.password) return res.status(400).json({error:'username and password required'});
  const users = readUsers();
  const u = users.find(x=>x.username===payload.username && x.password===payload.password);
  if(!u) return res.status(401).json({error:'invalid credentials'});
  // generate token and persist
  const token = nanoid(16);
  u.token = token;
  writeUsers(users);
  res.json({token, role: u.role});
});

// middleware to authenticate by Bearer token
function authMiddleware(req,res,next){
  const h = req.headers.authorization || '';
  const parts = h.split(' ');
  if(parts.length!==2 || parts[0]!=='Bearer') return res.status(401).json({error:'missing token'});
  const token = parts[1];
  const users = readUsers();
  const u = users.find(x=>x.token===token);
  if(!u) return res.status(401).json({error:'invalid token'});
  req.user = u;
  next();
}

// admin-only route to add a city
app.post('/api/admin/add-city', authMiddleware, (req,res)=>{
  if(!req.user || req.user.role!=='admin') return res.status(403).json({error:'forbidden'});
  const payload = req.body || {};
  if(!payload.name) return res.status(400).json({error:'name required'});
  const db = readDB();
  const city = {
    id: nanoid(8),
    name: payload.name,
    population: payload.population || 0,
    services: payload.services || [],
    amenities: payload.amenities || []
  };
  db.cities.push(city);
  writeDB(db);
  res.status(201).json(city);
});

const PORT = process.env.PORT || 4000;
// listen on all interfaces so the server is reachable from localhost and other interfaces
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`Server listening on ${HOST}:${PORT}`));
