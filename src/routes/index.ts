import Router from 'koa-router';

const router = new Router();

router.get('/', ctx => {
  ctx.body = '<a href="https://github.com/busheezy/ts-sharex-api">GitHub</a>';
});

export default router;
