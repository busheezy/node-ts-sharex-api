import Router from 'koa-router';
import BodyParser from 'koa-body';
import fs from 'fs-extra';
import { transaction } from 'objection';

import randomString from '../randomString';

import apiKeyMiddleware from '../middleware/apiKey';

import Paste from '../models/Paste';
import Share from '../models/Share';

import knex from '../knex';

type Files = import('formidable').Files;

const router = new Router();

const bodyParser = BodyParser({
  multipart: true,
  formidable: {
    maxFieldsSize: 1024 * 1024 * 1024,
  },
  jsonLimit: '1gb',
  formLimit: '1gb',
  textLimit: '1gb',
});

router.post('/api/pastes', apiKeyMiddleware, bodyParser, async ctx => {
  try {
    const files = ctx.request.files as Files;

    const { paste } = files;

    const fileConentsBuffer = await fs.readFile(paste.path);
    const fileContents = fileConentsBuffer.toString();

    const stringId = randomString();

    const trx = await transaction.start(knex);

    const deleteUrl = randomString();

    const share = await Share.query(trx).insert({
      deleteUrl,
      deleteKey: randomString(),
      stringId,
    });

    await share.$relatedQuery<Paste>('paste', trx).insert({
      content: fileContents,
      type: paste.type,
    });

    await trx.commit();

    ctx.body = {
      url: stringId,
      delete: deleteUrl,
    };
  } catch (err) {
    console.error('failed to share paste');
    console.error(err);

    ctx.status = 500;
    ctx.body = 'error';
  }
});

export default router;
