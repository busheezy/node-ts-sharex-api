import Router from 'koa-router';
import BodyParser from 'koa-body';
import path from 'path';
import fs from 'fs-extra';
import { transaction } from 'objection';

import randomString from '../randomString';

import apiKeyMiddleware from '../middleware/apiKey';

import File from '../models/File';
import Share from '../models/Share';

import knex from '../knex';

type Files = import('formidable').Files;

const router = new Router();

const uploadDir = path.resolve(__dirname, '..', '..', 'public', 'files');

const bodyParser = BodyParser({
  multipart: true,
  formidable: {
    uploadDir,
  },
});

router.post('/api/files', apiKeyMiddleware, bodyParser, async ctx => {
  try {
    const files = ctx.request.files as Files;

    const { file } = files;

    const extension = path.extname(file.name);

    const stringId = randomString();
    const fileName = `${stringId}${extension}`;

    const fileNamePath = path.join(uploadDir, fileName);

    await fs.rename(file.path, fileNamePath);

    const trx = await transaction.start(knex);

    const deleteUrl = randomString();

    const share = await Share.query(trx).insert({
      deleteUrl,
      deleteKey: randomString(),
      stringId,
    });

    await share.$relatedQuery<File>('file', trx).insert({
      fileName,
      type: file.type,
    });

    await trx.commit();

    ctx.body = {
      url: fileName,
      delete: deleteUrl,
    };
  } catch (err) {
    console.error('failed to upload file');
    console.error(err);

    ctx.status = 500;
    ctx.body = 'error';
  }
});

export default router;
