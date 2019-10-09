import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import mount from 'koa-mount';

import './env';
import './knex';

import routes from './routes/index';
import routesImages from './routes/images';
import routesFiles from './routes/files';
import routesPastes from './routes/pastes';
import routesLinks from './routes/links';
import routesLinkShare from './routes/linkShare';

const app = new Koa();

const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  app.use(serve(path.join(__dirname, '..', 'public')));

  app.use(serve(path.join(__dirname, '..', 'uploads', 'images')));
  app.use(serve(path.join(__dirname, '..', 'uploads', 'files')));

  app.use(
    mount(
      '/thumbnails',
      serve(path.join(__dirname, '..', 'uploads', 'thumbnails')),
    ),
  );

  app.use(mount('/css', serve(path.join(__dirname, '..', 'uploads', 'css'))));
}

app.use(routesImages.routes());
app.use(routesFiles.routes());
app.use(routesPastes.routes());
app.use(routesLinks.routes());
app.use(routesLinkShare.routes());
app.use(routes.routes());

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(port, () => {
  if (process.send) {
    process.send('ready');
  }
});
