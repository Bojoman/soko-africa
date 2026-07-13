import { execSync } from 'node:child_process';

const PORTS = [3000, 3001];

function listListeningPids(port) {
  try {
    const output = execSync(`netstat -ano | findstr ":${port}"`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    const pids = new Set();
    for (const line of output.split(/\r?\n/)) {
      if (!line.includes('LISTENING')) continue;
      const pid = Number(line.trim().split(/\s+/).at(-1));
      if (Number.isInteger(pid) && pid > 0) pids.add(pid);
    }
    return [...pids];
  } catch {
    return [];
  }
}

for (const port of PORTS) {
  for (const pid of listListeningPids(port)) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      console.log(`Freed port ${port} (stopped PID ${pid})`);
    } catch {
      // Process may have already exited.
    }
  }
}
