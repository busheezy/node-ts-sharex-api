import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import mount from 'koa-mount';
import fs from 'fs-extra';

import env from './env';
import './knex';

import routes from './routes/index';
import routesImages from './routes/images';
import routesFiles from './routes/files';
import routesPastes from './routes/pastes';
import routesLinks from './routes/links';
import routesLinkShare from './routes/linkShare';

import './generateSXCU';

const app = new Koa();

const isDev = env.nodeEnv !== 'production';

const imagesDir = path.join(__dirname, '..', 'uploads', 'images');
const thumbsDir = path.join(__dirname, '..', 'uploads', 'thumbnails');
const filesDir = path.join(__dirname, '..', 'uploads', 'files');

fs.ensureDirSync(imagesDir);
fs.ensureDirSync(thumbsDir);
fs.ensureDirSync(filesDir);

if (isDev) {
  app.use(serve(path.join(__dirname, '..', 'public')));

  app.use(serve(imagesDir));
  app.use(serve(filesDir));

  app.use(mount('/thumbnails', serve(thumbsDir)));

  app.use(mount('/css', serve(path.join(__dirname, '..', 'uploads', 'css'))));
}

app.use(routesImages.routes());
app.use(routesFiles.routes());
app.use(routesPastes.routes());
app.use(routesLinks.routes());
app.use(routesLinkShare.routes());
app.use(routes.routes());

const port = env.port ? parseInt(env.port, 10) : 3000;
const host = env.host || '0.0.0.0';

app.listen(port, host, () => {
  if (process.send) {
    process.send('ready');
  }
});
