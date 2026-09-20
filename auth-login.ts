import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
const C={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization,x-client-info,apikey,content-type","Access-Control-Allow-Methods":"POST,OPTIONS"};
const out=(x:any,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{...C,"Content-Type":"application/json"}});
async function hash(v:string){const d=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v));return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function token(payload:any,secret:string){
 const b=(s:string)=>btoa(unescape(encodeURIComponent(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
 const head=b(JSON.stringify({alg:"HS256",typ:"JWT"})), body=b(JSON.stringify(payload));
 const sig=await crypto.subtle.sign("HMAC",await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]),new TextEncoder().encode(head+"."+body));
 return head+"."+body+"."+b(String.fromCharCode(...new Uint8Array(sig)));
}
serve(async req=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:C});
 try{
  const {username,password}=await req.json(); const u=String(username||"").trim(); const p=String(password||"");
  const url=Deno.env.get("SUPABASE_URL")!, key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, secret=Deno.env.get("APP_SESSION_SECRET")||key;
  const r=await fetch(`${url}/rest/v1/users?select=id,username,is_admin&username=eq.${encodeURIComponent(u)}&password_hash=eq.${await hash(p)}&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
  const a=await r.json(); if(!a?.length)return out({ok:false});
  const user=a[0], t=await token({sub:user.id,username:user.username,admin:user.is_admin,exp:Date.now()+1000*60*60*12},secret);
  return out({ok:true,user,token:t});
 }catch{return out({ok:false},400)}
});