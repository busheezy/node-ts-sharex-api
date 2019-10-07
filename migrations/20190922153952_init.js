exports.up = async knex => {
  await knex.schema.createTable('', table => {
    table.increments('id').primary();
    table.string('', 255);
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists('');
};
