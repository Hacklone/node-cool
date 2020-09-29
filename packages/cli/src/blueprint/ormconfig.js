const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  synchronize: false,
  maxQueryExecutionTime: 1000,
  entities: [`${__dirname}/entities/**/*.js`, `${__dirname}/dist/entities/**/*.js`],
  migrations: [`${__dirname}/migrations/**/*.js`, `${__dirname}/dist/migrations/**/*.js`],
  cli: {
    migrationsDir: `src/migrations`,
  },
};
