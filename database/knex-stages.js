module.exports = {
    development: {
        client: "pg",
        version: "9.5",
        connection: {
            host: "localhost",
            user: "idlesolution",
            password: "cbdum123",
            database: "redditreact"
        }
    },

    production: {
        client: "pg",
        connection: process.env.DATABASE_URL,
        migrations: {
            tableName: "knex_migrations"
        }
    },

    test: {
        client: "pg",
        version: "9.5",
        connection: {
            host: "localhost",
            user: "idlesolution",
            password: "cbdum123",
            database: "redditreact_test"
        }
    }
};
