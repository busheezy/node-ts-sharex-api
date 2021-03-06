exports.up = knex => {
  return knex.schema
    .createTable('files', table => {
      table.increments('id').primary();
      table.string('fileName', 255).notNullable();
      table.string('type', 255).notNullable();
    })
    .createTable('images', table => {
      table.increments('id').primary();
      table.string('fileName', 255).notNullable();
      table.string('type', 255).notNullable();
    })
    .createTable('links', table => {
      table.increments('id').primary();
      table.string('url', 255).notNullable();
    })
    .createTable('pastes', table => {
      table.increments('id').primary();
      table.text('content').notNullable();
      table.string('type', 255).notNullable();
    })
    .createTable('shares', table => {
      table.increments('id').primary();

      table.string('stringId', 255).notNullable();

      table.string('deleteUrl', 255).notNullable();
      table.string('deleteKey', 255).notNullable();

      table
        .integer('fileId')
        .unsigned()
        .references('id')
        .inTable('files')
        .onDelete('CASCADE')
        .index();

      table
        .integer('imageId')
        .unsigned()
        .references('id')
        .inTable('images')
        .onDelete('CASCADE')
        .index();

      table
        .integer('linkId')
        .unsigned()
        .references('id')
        .inTable('links')
        .onDelete('CASCADE')
        .index();

      table
        .integer('pasteId')
        .unsigned()
        .references('id')
        .inTable('pastes')
        .onDelete('CASCADE')
        .index();

      table
        .dateTime('createdAt')
        .notNullable()
        .defaultTo(knex.fn.now());
    });
};

exports.down = knex => {
  return knex.schema
    .dropTableIfExists('shares')
    .dropTableIfExists('files')
    .dropTableIfExists('images')
    .dropTableIfExists('links')
    .dropTableIfExists('pastes');
};
