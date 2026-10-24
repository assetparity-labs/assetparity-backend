import http from 'node:http';import {compare} from './compare.mjs';import {CampaignStore} from './store.mjs';import {sample} from '../assetparity-scenario-suite/index.mjs';import {coverage} from '../assetparity-scenario-suite/catalog.mjs';
export function createServer({databasePath=':memory:'}={}){
 const store=new CampaignStore(databasePath);
 const server=http.createServer(async(req,res)=>{
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))};
  if(!/^localhost(?::\d+)?$|^127\.0\.0\.1(?::\d+)?$/.test(req.headers.host??''))return send(403,{error:'Loopback Host required'});
  if(req.headers.origin&&!['http://localhost:4380','http://127.0.0.1:4380','http://localhost:4381','http://127.0.0.1:4381'].includes(req.headers.origin))return send(403,{error:'Origin rejected'});
  try{
   if(req.method==='GET'&&req.url==='/health')return send(200,{ok:true,project:'AssetParity',storage:'SQLite campaigns',signing:false});
   if(req.method==='GET'&&req.url==='/library')return send(200,{sample,coverage});
   if(req.method==='GET'&&req.url==='/campaigns')return send(200,store.list());
   if(req.method==='GET'&&/^\/campaigns\/[a-f0-9-]{36}(\/export)?$/.test(req.url??'')){let id=req.url.split('/')[2],campaign=store.get(id);return send(campaign?200:404,campaign??{error:'Campaign not found'});}
   if(req.method==='POST'&&req.url==='/campaigns'){
    if(!req.headers['content-type']?.startsWith('application/json'))return send(415,{error:'JSON required'});
    let count=0,chunks=[];for await(let c of req){count+=c.length;if(count>1048576)return send(413,{error:'Campaign import exceeds 1 MiB'});chunks.push(c)}
    let {label,corpus}=JSON.parse(Buffer.concat(chunks).toString());let report=compare(corpus);return send(201,store.save(label,corpus,report));
   }
   send(404,{error:'Not found'});
  }catch(e){send(400,{error:e.message})}
 });server.on('close',()=>store.close());return server;
}
