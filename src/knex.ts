import Knex from 'knex';
import { Model } from 'objection';

const knex = Knex({
  client: 'mysql2',
  useNullAsDefault: true,
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8',
  },
  migrations: {
    tableName: 'knex_migrations',
  },
});

Model.knex(knex);

export default knex;
