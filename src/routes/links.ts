import Router from 'koa-router';
import BodyParser from 'koa-body';
import { transaction } from 'objection';

import randomString from '../randomString';

import apiKeyMiddleware from '../middleware/apiKey';

import Link from '../models/Link';
import Share from '../models/Share';

import knex from '../knex';

const router = new Router();

const bodyParser = BodyParser({
  formidable: {
    maxFieldsSize: 1024 * 1024 * 1024,
  },
  jsonLimit: '1gb',
  formLimit: '1gb',
  textLimit: '1gb',
});

router.post('/api/links', apiKeyMiddleware, bodyParser, async ctx => {
  try {
    const { url } = ctx.request.body;
    const trx = await transaction.start(knex);

    const stringId = randomString();
    const deleteUrl = randomString();

    const share = await Share.query(trx).insert({
      deleteUrl,
      deleteKey: randomString(),
      stringId,
    });

    await share.$relatedQuery<Link>('link', trx).insert({
      url,
    });

    await trx.commit();

    ctx.body = {
      url: stringId,
      delete: `api/delete/${deleteUrl}`,
    };
  } catch (err) {
    console.error('failed to share link');
    console.error(err);

    ctx.status = 500;
    ctx.body = 'error';
  }
});

export default router;
