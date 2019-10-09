/* eslint-disable @typescript-eslint/no-non-null-assertion */

import Router from 'koa-router';

import send from 'koa-send';
import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import Prism from 'prismjs';
import Share from '../models/Share';

const templateText = fs.readFileSync(
  path.join(__dirname, '..', '..', 'highlight.html'),
);

const router = new Router();

router.get('/', ctx => {
  ctx.body = '<a href="https://github.com/busheezy/ts-sharex-api">GitHub</a>';
});

router.get('/:stringId/:option*', async ctx => {
  const { stringId, option } = ctx.params;

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
        root: path.join(__dirname, '..', '..', 'uploads', 'files'),
      });
    }

    if (share.image) {
      await send(ctx, share.image.fileName!, {
        root: path.join(__dirname, '..', '..', 'uploads', 'images'),
      });
    }

    if (share.link) {
      ctx.redirect(share.link.url!);
    }

    if (share.paste) {
      if (option) {
        if (!Prism.languages[option]) {
          ctx.body =
            'language not found https://prismjs.com/index.html#supported-languages';
          ctx.status = 500;
          return;
        }

        const html = Prism.highlight(
          share.paste.content!,
          Prism.languages[option],
          option,
        );

        const compileTemplate = _.template(templateText.toString());
        const compiledTemplate = compileTemplate({
          body: html,
        });

        ctx.body = compiledTemplate;
      } else {
        ctx.body = share.paste.content;
      }
    }
  } else {
    ctx.body = 'not found';
    ctx.status = 404;
  }
});

router.get('/api/delete/:deleteUrl/:deleteKey*', async ctx => {
  const { deleteUrl, deleteKey } = ctx.params;

  const share = await Share.query().findOne({
    deleteUrl,
  });

  if (share) {
    if (deleteKey) {
      if (deleteKey === share.deleteKey) {
        await share.$query().delete();
        ctx.body = 'deleted';
      } else {
        ctx.body = 'wrong key';
        ctx.status = 403;
      }
    } else {
      ctx.body = share.deleteKey;
    }
  } else {
    ctx.body = 'not found';
    ctx.status = 404;
  }
});

export default router;
