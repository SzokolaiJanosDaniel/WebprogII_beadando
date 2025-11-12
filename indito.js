import app from './server.js';
import { ensureDbReady } from './scripts/initdb.js';

const PORT = process.env.PORT || 3000;

await ensureDbReady();

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});
