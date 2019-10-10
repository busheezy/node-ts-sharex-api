import Knex from 'knex';
import { Model } from 'objection';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexConfig = require('../knexfile');

const knex = Knex(knexConfig);

Model.knex(knex);

export default knex;
