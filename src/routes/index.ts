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
    } else if (share.image) {
      await send(ctx, share.image.fileName!, {
        root: path.join(__dirname, '..', '..', 'uploads', 'images'),
      });
    } else if (share.link) {
      ctx.redirect(share.link.url!);
    } else if (share.paste) {
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
