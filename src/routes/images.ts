import Router from 'koa-router';
import BodyParser from 'koa-body';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import { transaction } from 'objection';

import randomString from '../randomString';

import apiKeyMiddleware from '../middleware/apiKey';

import Image from '../models/Image';
import Share from '../models/Share';

import knex from '../knex';

type Files = import('formidable').Files;

const router = new Router();

const uploadDir = path.resolve(__dirname, '..', '..', 'public', 'images');

const bodyParser = BodyParser({
  multipart: true,
  formidable: {
    uploadDir,
  },
});

router.post('/api/images', apiKeyMiddleware, bodyParser, async ctx => {
  try {
    const files = ctx.request.files as Files;

    const { image } = files;

    const thumbnail = await sharp(image.path)
      .resize(64)
      .toBuffer();

    const extension = path.extname(files.image.name);

    const fileName = `${randomString()}${extension}`;

    await fs.writeFile(
      path.resolve(__dirname, '..', '..', 'public', 'thumbnails', fileName),
      thumbnail,
    );

    const fileNamePath = path.join(uploadDir, fileName);

    await fs.rename(image.path, fileNamePath);

    const trx = await transaction.start(knex);

    const deleteUrl = randomString();

    const share = await Share.query(trx).insert({
      deleteUrl,
      deleteKey: randomString(),
    });

    await share.$relatedQuery<Image>('image', trx).insert({
      fileName,
      type: image.type,
    });

    await trx.commit();

    ctx.body = {
      url: fileName,
      thumbnail: `/thumbnail/${fileName}`,
      delete: deleteUrl,
    };
  } catch (err) {
    console.error('failed to upload image');
    console.error(err);

    ctx.status = 500;
    ctx.body = 'error';
  }
});

export default router;
