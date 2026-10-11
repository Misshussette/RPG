import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { passwordHash,verifyPassword,newToken,hashToken,parseCookies,validIdentity } from './security.js';
import { applyAction } from './actions.js';

const port=Number(process.env.PORT||3001);
const origin=process.env.APP_ORIGIN;
if (!process.env.DATABASE_URL || !origin || !/^https?:\/\//.test(origin)) throw new Error('DATABASE_URL et APP_ORIGIN requis.');
const pool=new Pool({connectionString:process.env.DATABASE_URL,max:10,connectionTimeoutMillis:3000});
const secure=origin.startsWith('https://');
const cookieAttrs=`HttpOnly; Path=/; SameSite=Strict; ${secure?'Secure; ':''}Max-Age=604800`;
const sessionCookie=(token)=>`eb_session=${token}; ${cookieAttrs}`;
const clearCookie=`eb_session=; HttpOnly; Path=/; SameSite=Strict; ${secure?'Secure; ':''}Max-Age=0`;
const rates=new Map();
function rate(ip, now=Date.now()){
 const x=rates.get(ip)||{begin:now,n:0};
 if(now-x.begin>60000){x.begin=now;x.n=0;}
 x.n++;rates.set(ip,x);
 if(rates.size>15000) for(const [key,v] of rates) if(now-v.begin>60000) rates.delete(key);
 return x.n<=90;
}
function json(res,status,data,headers={}){
 const body=JSON.stringify(data);
 res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff',...headers});
 res.end(body);
}
async function body(req){
 if(!req.headers['content-type']?.startsWith('application/json')) throw new Error('JSON attendu');
 let value='';
 for await(const chunk of req){value+=chunk;if(value.length>16000)throw new Error('Requête trop volumineuse');}
 return JSON.parse(value||'{}');
}
async function withTransaction(fn) {
 const db=await pool.connect();
 try{await db.query('BEGIN');const value=await fn(db);await db.query('COMMIT');return value;}
 catch(e){await db.query('ROLLBACK');throw e}
 finally{db.release();}
}
async function accountOf(db,req){
 const token=parseCookies(req.headers.cookie).eb_session;
 if(!token || token.length>100)return null;
 const found=await db.query('SELECT account_id FROM sessions WHERE token_hash=$1 AND expires_at>now()',[hashToken(token)]);
 return found.rows[0]?.account_id||null;
}
async function register(input){
 const email=String(input.email||'').trim().toLowerCase();
 if(!validIdentity(email,input.password))return {status:400,body:{error:'Adresse ou mot de passe invalide (12 caractères minimum).'}};
 const {salt,hash}=await passwordHash(input.password);
 const id=randomUUID();
 try{await pool.query('INSERT INTO accounts(id,email,password_salt,password_hash) VALUES($1,$2,$3,$4)',[id,email,salt,hash]);}
 catch(e){if(e.code==='23505')return {status:409,body:{error:'Compte déjà existant.'}};throw e;}
 return startSession(id);
}
async function login(input){
 const email=String(input.email||'').trim().toLowerCase();
 if(typeof input.password!=='string')return {status:401,body:{error:'Identifiants incorrects.'}};
 const r=await pool.query('SELECT id,password_salt,password_hash FROM accounts WHERE email=$1',[email]);
 const u=r.rows[0];
 if(!u || !(await verifyPassword(input.password,u.password_salt,u.password_hash)))return {status:401,body:{error:'Identifiants incorrects.'}};
 return startSession(u.id);
}
async function startSession(id){
 const token=newToken();
 await pool.query("INSERT INTO sessions(token_hash,account_id,expires_at) VALUES($1,$2,now()+interval '7 days')",[hashToken(token),id]);
 return {status:200,body:{ok:true},headers:{'set-cookie':sessionCookie(token)}};
}
async function route(req,res){
 const url=new URL(req.url,'http://localhost');
 if(req.method==='GET' && url.pathname==='/api/health') return json(res,200,{status:'ok'});
 if(!url.pathname.startsWith('/api/'))return json(res,404,{error:'API uniquement.'});
 const reqOrigin=req.headers.origin;
 // Toutes les mutations exigent la véritable origine du client, et pas seulement SameSite.
 if(req.method!=='GET' && reqOrigin!==origin)return json(res,403,{error:'Origine interdite.'});
 const ip=req.socket.remoteAddress||'unknown'; 
 if(!rate(ip))return json(res,429,{error:'Trop de requêtes.'});
 try {
  if(req.method==='POST' && url.pathname==='/api/register'){
   const value=await register(await body(req));return json(res,value.status,value.body,value.headers);
  }
  if(req.method==='POST' && url.pathname==='/api/login'){
   const value=await login(await body(req));return json(res,value.status,value.body,value.headers);
  }
  const db=await pool.connect();
  let accountId;
  try{accountId=await accountOf(db,req);}finally{db.release();}
  if(!accountId)return json(res,401,{error:'Authentification nécessaire.'});
  if(req.method==='POST' && url.pathname==='/api/logout'){
   const token=parseCookies(req.headers.cookie).eb_session;
   await pool.query('DELETE FROM sessions WHERE token_hash=$1',[hashToken(token)]);
   return json(res,200,{ok:true},{'set-cookie':clearCookie});
  }
  if(req.method==='GET' && url.pathname==='/api/me'){
   const result=await pool.query('SELECT state,revision FROM characters WHERE account_id=$1',[accountId]);
   return json(res,200,{character:result.rows[0]?.state||null,revision:result.rows[0]?.revision??0});
  }
  if(req.method==='POST' && url.pathname==='/api/action'){
   const input=await body(req);
   // Une transaction et un verrou par personnage empêchent deux gains simultanés.
   const result=await withTransaction(async(db)=>{
    const current=await db.query('SELECT state,revision,last_attack_at FROM characters WHERE account_id=$1 FOR UPDATE',[accountId]);
    const row=current.rows[0];
    if(!row && input.action!=='create')return {status:409,error:'Créer un personnage avant de jouer.'};
    // Sérialiser également les créations simultanées avec le verrou du compte.
    if(!row) await db.query('SELECT id FROM accounts WHERE id=$1 FOR UPDATE',[accountId]);
    const refreshed=!row ? await db.query('SELECT state,revision,last_attack_at FROM characters WHERE account_id=$1 FOR UPDATE',[accountId]):current;
    const latest=refreshed.rows[0]||null;
    const now=Date.now();
    const action=applyAction(latest?.state??null,input,latest?.last_attack_at??null,now);
    if(action.error){
     if(action.suspicion)await db.query("INSERT INTO security_alerts(account_id,code,severity,details) VALUES($1,$2,'warning',$3)",[accountId,action.suspicion,JSON.stringify({action:input.action})]);
     return {status:409,error:action.error};
    }
    if(!latest)await db.query('INSERT INTO characters(account_id,state,revision,last_attack_at) VALUES($1,$2,1,$3)',[accountId,JSON.stringify(action.game),action.lastAttackAt||null]);
    else await db.query('UPDATE characters SET state=$2,revision=revision+1,last_attack_at=$3,updated_at=now() WHERE account_id=$1',[accountId,JSON.stringify(action.game),action.lastAttackAt||null]);
    await db.query('INSERT INTO game_events(account_id,event_type,details) VALUES($1,$2,$3)',[accountId,action.event,JSON.stringify({revision:(latest?.revision??0)+1})]);
    return {status:200,character:action.game,revision:Number(latest?.revision??0)+1};
   });
   return json(res,result.status,result.error?{error:result.error}:{character:result.character,revision:result.revision});
  }
  return json(res,404,{error:'Route inconnue.'});
 } catch(e){
  if(e instanceof SyntaxError || /JSON attendu|trop volumineuse/.test(e.message))return json(res,400,{error:'Requête JSON invalide.'});
  console.error('Erreur API',e);return json(res,500,{error:'Erreur interne.'});
 }
}
const server=http.createServer((req,res)=>{route(req,res).catch(e=>{console.error(e);if(!res.headersSent)json(res,500,{error:'Erreur interne.'});else res.end();});});
server.requestTimeout=10000;
server.listen(port,'127.0.0.1',()=>console.log(`L’Éclipse Blanche API locale : http://127.0.0.1:${port}`));
