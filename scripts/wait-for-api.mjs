const base = process.env.API_URL || 'http://127.0.0.1:3001';
const deadline = Date.now() + 60000;
let ready = false;
while (Date.now() < deadline) {
  try {
    const res = await fetch(`${base}/health/ready`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) { ready = true; break; }
  } catch { /* API may still be booting. */ }
  await new Promise(resolve => setTimeout(resolve, 1000));
}
if (!ready) throw new Error(`Test API/database never became ready at ${base}`);
console.log(`Test API and database ready at ${base}`);
