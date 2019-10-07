import Router from 'koa-router';
import BodyParser from 'koa-body';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import apiKeyMiddleware from '../middleware/apiKey';

type Files = import('formidable').Files;

const router = new Router();

const bodyParser = BodyParser({
  multipart: true,
  formidable: {
    uploadDir: path.resolve(__dirname, '..', '..', 'public', 'images'),
    keepExtensions: true,
  },
});

router.post('/api/images', apiKeyMiddleware, bodyParser, async ctx => {
  const files = ctx.request.files as Files;

  const imagePath = files.image.path;

  const thumbnail = await sharp(imagePath)
    .resize(64)
    .toBuffer();

  const extension = path.extname(files.image.name);

  await fs.writeFile(
    path.resolve(
      __dirname,
      '..',
      '..',
      'public',
      'thumbnails',
      `test${extension}`,
    ),
    thumbnail,
  );

  ctx.body = {
    url: 'test1',
    thumbnail: 'test2',
    delete: 'test3',
  };
});

export default router;
