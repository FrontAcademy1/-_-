import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
const C={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization,x-client-info,apikey,content-type","Access-Control-Allow-Methods":"POST,OPTIONS"};
const out=(x:any,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...C,"Content-Type":"application/json"}});
function dec(s:string){return decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/"))))}
async function verify(t:string,secret:string){
 const [h,p,s]=t.split("."); if(!h||!p||!s)return null;
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
 const sig=Uint8Array.from(dec(s),c=>c.charCodeAt(0));
 const ok=await crypto.subtle.verify("HMAC",key,sig,new TextEncoder().encode(h+"."+p)); if(!ok)return null;
 const x=JSON.parse(dec(p)); return x.exp>Date.now()?x:null;
}
async function db(path:string,init:RequestInit={}){const u=Deno.env.get("SUPABASE_URL")!,k=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;return fetch(`${u}/rest/v1/${path}`,{...init,headers:{apikey:k,Authorization:`Bearer ${k}`,"Content-Type":"application/json",...(init.headers||{})}})}
serve(async req=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:C});
 try{
  const b=await req.json(), secret=Deno.env.get("APP_SESSION_SECRET")||Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, u=await verify(String(b.token||""),secret);
  if(!u?.admin)return out({ok:false,reason:"unauthorized"},401);
  if(b.action==="list")return out({ok:true,data:await (await db("questions?select=*&order=created_at.desc")).json()});
  if(b.action==="add"){const r=await db("questions",{method:"POST",body:JSON.stringify(b.question)});return out({ok:r.ok},r.ok?200:400)}
  if(b.action==="delete"){const r=await db(`questions?id=eq.${Number(b.id)}`,{method:"DELETE"});return out({ok:r.ok},r.ok?200:400)}
  if(b.action==="settings"){const r=await db("site_settings?id=eq.1",{method:"PATCH",headers:{Prefer:"return=minimal"},body:JSON.stringify(b.settings)});return out({ok:r.ok},r.ok?200:400)}
  return out({ok:false},400);
 }catch{return out({ok:false},400)}
});