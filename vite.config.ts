import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'save-map-plugin',
      configureServer(server) {
        // Mount the middleware directly on the target path
        server.middlewares.use('/api/save-map', (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const filePath = path.resolve(process.cwd(), 'public/map_layout.json');
                fs.writeFileSync(filePath, body);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Map saved successfully');
              } catch (err) {
                console.error('Error saving map:', err);
                res.statusCode = 500;
                res.end('Error saving map');
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  server: {
    port: 3000
  },
  build: {
    assetsInlineLimit: 0
  }
});
