import Koa from 'koa';

import './env';
import './knex';

import routes from './routes/index';
import routesImages from './routes/images';
import routesFiles from './routes/files';
import routesPastes from './routes/pastes';
import routesLinks from './routes/links';

const app = new Koa();

app.use(routes.routes());
app.use(routesImages.routes());
app.use(routesFiles.routes());
app.use(routesPastes.routes());
app.use(routesLinks.routes());

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(port, () => {
  if (process.send) {
    process.send('ready');
  }
});
