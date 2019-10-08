/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Router from 'koa-router';

import send from 'koa-send';
import path from 'path';
import Share from '../models/Share';

const router = new Router();

router.get('/', ctx => {
  ctx.body = '<a href="https://github.com/busheezy/ts-sharex-api">GitHub</a>';
});

router.get('/:stringId', async ctx => {
  const { stringId } = ctx.params;

  const share = await Share.query()
    .eager({
      file: true,
      image: true,
      link: true,
      paste: true,
    })
    .findOne({
      stringId,
    });

  if (share) {
    if (share.file) {
      await send(ctx, share.file.fileName!, {
        root: path.join(__dirname, '..', '..', 'public', 'files'),
      });
    } else if (share.image) {
      await send(ctx, share.image.fileName!, {
        root: path.join(__dirname, '..', '..', 'public', 'images'),
      });
    } else if (share.link) {
      ctx.redirect(share.link.url!);
    } else if (share.paste) {
      ctx.body = share.paste.content;
    } else {
      ctx.body = share;
      ctx.status = 500;
    }
  } else {
    ctx.body = 'not found';
    ctx.status = 404;
  }
});

export default router;
