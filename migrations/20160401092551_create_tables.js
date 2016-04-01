
exports.up = function(knex, Promise) {
  return Promise.all([

    knex.schema.createTable('users', function( table ){
      table.increments();
      table.string('userName');
      table.string('password');
    }),
    knex.schema.createTable('nouns', function( table ){
      table.increments();
      table.string('word');
    }),
    knex.schema.createTable('verbs', function( table ){
      table.increments();
      table.string('word');
    }),
    knex.schema.createTable('adjectives', function( table ){
      table.increments();
      table.string('word');
    })

  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([

    knex.schema.dropTable('users'),
    knex.schema.dropTable('nouns'),
    knex.schema.dropTable('verbs'),
    knex.schema.dropTable('adjectives')

  ])
};
