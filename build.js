import nunjucks from 'nunjucks';
import fs from 'fs/promises';
import path from 'path';
import glob from 'fast-glob';

// searchPaths: '.' lets us render pages by their real path (so template errors
// report "pages/colors.njk" instead of "(unknown path)"); 'templates' is what
// {% extends %} and {% import %} resolve against.
const env = nunjucks.configure(['.', 'templates'], { autoescape: true });

const outputDir = 'docs';
await fs.mkdir(outputDir, { recursive: true });

for (const file of await glob('pages/*.njk')) {
  const name = path.basename(file, '.njk');
  const html = env.render(file, { title: name === 'index' ? null : name });
  await fs.writeFile(path.join(outputDir, `${name}.html`), html);
  console.log(`✓ Built ${name}.html`);
}

// dist/theme.css is the compiled framework; static/* is docs-only css + js.
const assets = [
  ['dist/theme.css', 'theme.css'],
  ...(await glob('static/*')).map(f => [f, path.basename(f)]),
];

for (const [from, to] of assets) {
  await fs.copyFile(from, path.join(outputDir, to));
  console.log(`✓ Copied ${to}`);
}
