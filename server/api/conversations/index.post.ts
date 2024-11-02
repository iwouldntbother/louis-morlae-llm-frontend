import { getDatabase } from '~/server/database';

export default defineEventHandler(async (event) => {
  const db = getDatabase();
  const body = await readBody(event);

  const stmt = db.prepare(
    'INSERT INTO conversations (conversation_data) VALUES (?)'
  );

  const result = stmt.run(JSON.stringify(body));
  return { id: result.lastInsertRowid };
});
