import Router from 'koa-router';
import BodyParser from 'koa-body';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import { transaction } from 'objection';
import '../env';
import randomString from '../randomString';

import apiKeyMiddleware from '../middleware/apiKey';

import Image from '../models/Image';
import Share from '../models/Share';

import knex from '../knex';

type Files = import('formidable').Files;

const router = new Router();

const uploadDir = path.resolve(__dirname, '..', '..', 'uploads', 'images');

const bodyParser = BodyParser({
  multipart: true,
  formidable: {
    uploadDir,
    maxFieldsSize: 1024 * 1024 * 1024,
  },
  jsonLimit: '1gb',
  formLimit: '1gb',
  textLimit: '1gb',
});

router.post('/api/images', apiKeyMiddleware, bodyParser, async ctx => {
  try {
    const files = ctx.request.files as Files;

    const { image } = files;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const thumbnailSize = parseInt(process.env.THUMBNAIL_SIZE!, 10) || 64;

    const thumbnail = await sharp(image.path)
      .resize(thumbnailSize)
      .toBuffer();

    const extension = path.extname(image.name);

    const stringId = randomString();
    const fileName = `${stringId}${extension}`;

    await fs.writeFile(
      path.resolve(__dirname, '..', '..', 'uploads', 'thumbnails', fileName),
      thumbnail,
    );

    const fileNamePath = path.join(uploadDir, fileName);

    await fs.rename(image.path, fileNamePath);

    const trx = await transaction.start(knex);

    const deleteUrl = randomString();

    const share = await Share.query(trx).insert({
      deleteUrl,
      deleteKey: randomString(),
      stringId,
    });

    await share.$relatedQuery<Image>('image', trx).insert({
      fileName,
      type: image.type,
    });

    await trx.commit();

    ctx.body = {
      url: fileName,
      thumbnail: `thumbnails/${fileName}`,
      delete: `api/delete/${deleteUrl}`,
    };
  } catch (err) {
    console.error('failed to upload image');
    console.error(err);

    ctx.status = 500;
    ctx.body = 'error';
  }
});

export default router;
