exports.up = knex => {
  return knex.schema.alterTable('pastes', table => {
    table.longtext('content').notNullable().alter();
  });
};

exports.down = knex => {
  return knex.schema.alterTable('pastes', table => {
    table.text('content').notNullable().alter();
  });
};
