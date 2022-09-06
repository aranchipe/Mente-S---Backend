const knex = require('knex')({
    client: 'pg',
    connection: {
        host: "localhost",
        user: "postgres",
        password: "aranchipe1998",
        database: "projeto_gama"
        /* ssl: {
            rejectUnauthorized: false
        }  */
    }
});

module.exports = knex;
