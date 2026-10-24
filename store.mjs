import {DatabaseSync} from 'node:sqlite';import {randomUUID} from 'node:crypto';
export class CampaignStore {
 constructor(path=':memory:'){this.db=new DatabaseSync(path);this.db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS campaigns (id TEXT PRIMARY KEY, label TEXT NOT NULL, created_at TEXT NOT NULL, corpus TEXT NOT NULL, report TEXT NOT NULL)');}
 list(){return this.db.prepare('SELECT id,label,created_at,report FROM campaigns ORDER BY rowid DESC LIMIT 200').all().map(r=>({id:r.id,label:r.label,createdAt:r.created_at,summary:JSON.parse(r.report).summary,network:JSON.parse(r.report).network,asset:JSON.parse(r.report).asset}));}
 get(id){let r=this.db.prepare('SELECT * FROM campaigns WHERE id=?').get(id);return r?{id:r.id,label:r.label,createdAt:r.created_at,corpus:JSON.parse(r.corpus),report:JSON.parse(r.report)}:null;}
 save(label,corpus,report){if(typeof label!=='string'||!label.trim()||label.length>80)throw Error('Campaign name must contain 1–80 characters');let id=randomUUID(),createdAt=new Date().toISOString();this.db.exec('BEGIN');try{this.db.prepare('INSERT INTO campaigns VALUES (?,?,?,?,?)').run(id,label.trim(),createdAt,JSON.stringify(corpus),JSON.stringify(report));this.db.exec('DELETE FROM campaigns WHERE id NOT IN (SELECT id FROM campaigns ORDER BY rowid DESC LIMIT 200); COMMIT');}catch(e){this.db.exec('ROLLBACK');throw e}return this.get(id);}
 close(){this.db.close();}
}
