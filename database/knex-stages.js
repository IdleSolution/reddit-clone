module.exports = {
    development: {
        client: "pg",
        version: "13.2",
        port: 5432,
        connection: {
            host: "localhost",
            user: "postgres",
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
        version: "13.2",
        connection: {
            host: "localhost",
            user: "postgres",
            password: "cbdum123",
            database: "redditreact_test"
        }
    }
};
