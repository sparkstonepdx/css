import chokidar from 'chokidar';
import { exec } from 'child_process';
import { promisify } from 'util';
import liveServer from 'live-server';

const run = promisify(exec);

async function rebuild() {
  try {
    console.log('🔄 Rebuilding...');
    // sass first: build.js copies dist/theme.css into docs/, so it has to exist
    await run('sass src/theme.scss dist/theme.css');
    await run('node build.js');
    console.log('✅ Build complete.\n');
  } catch (err) {
    console.error('❌ Build failed:', err.stderr || err);
  }
}

await rebuild();

const watcher = chokidar.watch(['src', 'pages', 'templates', 'static', 'build.js'], {
  ignoreInitial: true,
  persistent: true,
});

watcher.on('all', async (event, path) => {
  console.log(`📁 ${event} ${path}`);
  await rebuild();
});

liveServer.start({
  root: 'docs',
  open: true,
  wait: 100,
  logLevel: 0,
});
