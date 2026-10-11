import { createCharacter, runCharacterAction, viewCharacter } from '../src/parity/engine.js';

// Toutes les écritures sont réalisées sous le verrou du personnage,
// au sein de la transaction PostgreSQL ouverte par server/index.js.
export async function createParityCharacter(db, accountId, input, now) {
  let character;
  try { character = createCharacter(input?.name, now); }
  catch (e) { return { status: 400, body: { error: e.message } }; }
  await db.query('SELECT id FROM accounts WHERE id=$1 FOR UPDATE', [accountId]);
  const inserted = await db.query(
    'INSERT INTO parity_characters(account_id,state,revision) VALUES($1,$2,1) ON CONFLICT DO NOTHING RETURNING revision',
    [accountId, JSON.stringify(character)]
  );
  if (!inserted.rows.length) return { status: 409, body: { error: 'Personnage déjà créé.' } };
  await db.query('INSERT INTO parity_events(account_id,revision,event_type) VALUES($1,1,$2)',[accountId,'character_created']);
  return { status: 201, body: { character: viewCharacter(character), revision: 1, serverNow: now } };
}
export async function getParityCharacter(db,accountId) {
  const row = await db.query('SELECT state,revision FROM parity_characters WHERE account_id=$1',[accountId]);
  if (!row.rows.length) return { status: 200, body: { character:null, revision:0 } };
  return { status: 200, body: { character:viewCharacter(row.rows[0].state), revision:Number(row.rows[0].revision) } };
}
export async function applyParityAction(db,accountId,intent,now) {
  if (!intent || !['start','settle','stop'].includes(intent.action)) return { status: 400, body: { error:'Action inconnue.' } };
  const found = await db.query('SELECT state,revision FROM parity_characters WHERE account_id=$1 FOR UPDATE',[accountId]);
  const row=found.rows[0];
  if (!row) return { status: 404, body: { error:'Créer un personnage avant de jouer.' } };
  const result=runCharacterAction(row.state,intent,now);
  if (result.error) return {status:409,body:{error:result.error}};
  const changed=JSON.stringify(row.state)!==JSON.stringify(result.character);
  let revision=Number(row.revision);
  if (changed) {
    const updated=await db.query('UPDATE parity_characters SET state=$2,revision=revision+1,updated_at=now() WHERE account_id=$1 RETURNING revision',[accountId,JSON.stringify(result.character)]);
    revision=Number(updated.rows[0].revision);
    await db.query('INSERT INTO parity_events(account_id,revision,event_type,details) VALUES($1,$2,$3,$4)',[
      accountId,revision,result.event,JSON.stringify(result.settlement||{})
    ]);
  }
  return {status:200,body:{character:viewCharacter(result.character),revision,settlement:result.settlement||null,serverNow:now}};
}