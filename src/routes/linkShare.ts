import axios from 'axios';

import Router from 'koa-router';
import BodyParser from 'koa-body';
import apiKeyMiddleware from '../middleware/apiKey';

import env from '../env';

const bodyParser = BodyParser();

const webhookURL = env.discordWebhookUrl;

const router = new Router();

if (env.discordWebhookUrl && env.discordWebhookUrl !== '') {
  router.post('/api/link-share', apiKeyMiddleware, bodyParser, async ctx => {
    try {
      const { url } = ctx.request.body;

      const postObj = {
        username: 'Link Share',
        embeds: [
          {
            title: url,
            url,
            color: 52470,
          },
        ],
      };

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await axios.post(webhookURL!, postObj);

      ctx.body = 'ok';
    } catch (err) {
      console.error(err);
      ctx.body = 'error while sharing link';
      ctx.status = 500;
    }
  });
}

export default router;
