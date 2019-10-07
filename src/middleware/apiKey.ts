import * as _ from 'lodash';
import { Context } from 'koa';
import '../env';

const apiKey = process.env.API_KEY;

export default async (ctx: Context, next: Function): Promise<void> => {
  const hasHeaders = _.hasIn(ctx, ['request', 'headers', 'x-api-key']);

  if (!hasHeaders) {
    ctx.body = 'not authorized';
    ctx.status = 401;
    return;
  }

  if (ctx.request.headers['x-api-key'] !== apiKey) {
    ctx.body = 'forbidden';
    ctx.status = 403;
    return;
  }

  await next();
};
